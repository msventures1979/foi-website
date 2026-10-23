import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { db } from "@/lib/supabase/admin";
import { renderMail, type MailType } from "@/lib/mail/templates";

/** Puffer im Tageslimit, der für Bestätigungsmails frei bleibt */
const TRANSACTIONAL_RESERVE = 15;

/** Mails, die pro Einladung nur einmal rausgehen (außer bewusst erzwungen) */
const ONCE: MailType[] = ["einladung", "zusage", "absage"];

export async function enqueue(invitationIds: string[], type: MailType, opts: { priority?: number; force?: boolean } = {}) {
  if (!invitationIds.length) return { queued: 0, skipped: 0 };
  const supa = db();
  const rows: { invitation_id: string; to_email: string; type: string; priority: number }[] = [];
  let skipped = 0;
  for (let i = 0; i < invitationIds.length; i += 100) {
    const ids = invitationIds.slice(i, i + 100);
    const { data } = await supa.from("invitations").select("id, contacts!inner(email, opted_out_at)").in("id", ids);
    const skip = new Set<string>();
    if (!opts.force && ONCE.includes(type)) {
      const [{ data: sent }, { data: pending }] = await Promise.all([
        supa.from("email_log").select("invitation_id").eq("type", type).eq("status", "gesendet").in("invitation_id", ids),
        supa.from("email_queue").select("invitation_id").eq("type", type).is("sent_at", null).lt("attempts", 5).in("invitation_id", ids),
      ]);
      [...(sent ?? []), ...(pending ?? [])].forEach((r) => skip.add(r.invitation_id as string));
    }
    for (const r of (data ?? []) as unknown as { id: string; contacts: { email: string | null; opted_out_at: string | null } }[]) {
      if (skip.has(r.id) || !r.contacts.email || r.contacts.opted_out_at) {
        skipped++;
        continue;
      }
      rows.push({ invitation_id: r.id, to_email: r.contacts.email, type, priority: opts.priority ?? 5 });
    }
  }
  if (rows.length) {
    const { error } = await supa.from("email_queue").insert(rows);
    if (error) throw error;
  }
  return { queued: rows.length, skipped };
}

export async function sentLast24h() {
  const { count } = await db()
    .from("email_log")
    .select("id", { count: "exact", head: true })
    .eq("status", "gesendet")
    .gte("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString());
  return count ?? 0;
}

type Job = { id: number; invitation_id: string | null; to_email: string; type: string; priority: number; attempts: number };

/** Arbeitet die Warteschlange ab: Bestätigungen immer, Massenmails bis zum Tageslimit. */
export async function processQueue(max = 40) {
  if (!env.resendKey) return { sent: 0, failed: 0, deferred: 0, error: "Kein Resend-Schlüssel" };
  const supa = db();
  const resend = new Resend(env.resendKey);
  let today = await sentLast24h();
  const { data: jobs, error } = await supa.rpc("claim_emails", { p_limit: max });
  if (error) throw error;
  let sent = 0,
    failed = 0,
    deferred = 0;

  for (const job of (jobs ?? []) as Job[]) {
    const transactional = job.priority <= 1;
    if (today >= env.mailDailyLimit || (!transactional && today >= env.mailDailyLimit - TRANSACTIONAL_RESERVE)) {
      deferred++;
      await supa.from("email_queue").update({ locked_at: null, attempts: job.attempts - 1 }).eq("id", job.id);
      continue;
    }
    const { data: inv } = await supa
      .from("invitations")
      .select("id, code, manage_token, status, contacts(salutation,title,first_name,last_name,opted_out_at), events(name,edition,starts_at,venue,address,details,rsvp_deadline)")
      .eq("id", job.invitation_id ?? "")
      .maybeSingle();
    const done = (note: string) => supa.from("email_queue").update({ sent_at: new Date().toISOString(), last_error: note, locked_at: null }).eq("id", job.id);
    if (!inv) {
      await done("Einladung gelöscht");
      continue;
    }
    const i = inv as unknown as {
      id: string;
      code: string;
      manage_token: string;
      status: string;
      contacts: { salutation: string; title: string; first_name: string; last_name: string; opted_out_at: string | null };
      events: { name: string; edition: number | null; starts_at: string | null; venue: string; address: string; details: string; rsvp_deadline: string | null };
    };
    // Mails, deren Anlass sich erledigt hat, verwerfen
    const stale =
      i.contacts.opted_out_at ||
      (["einladung", "erinnerung"].includes(job.type) && !["vorgemerkt", "eingeladen"].includes(i.status)) ||
      (job.type === "zusage" && i.status !== "zugesagt") ||
      (job.type === "absage" && i.status !== "abgesagt");
    if (stale) {
      await done(`übersprungen (Status ${i.status})`);
      continue;
    }

    let mail;
    try {
      mail = renderMail(job.type as MailType, { person: i.contacts, event: i.events, code: i.code, manageToken: i.manage_token, siteUrl: env.publicUrl });
    } catch (e) {
      failed++;
      const msg = e instanceof Error ? e.message : String(e);
      await supa.from("email_queue").update({ attempts: 5, last_error: msg, locked_at: null }).eq("id", job.id);
      await supa.from("email_log").insert({ invitation_id: i.id, to_email: job.to_email, type: job.type, status: "fehler", error: msg });
      continue;
    }

    const res = await resend.emails.send(
      {
        from: env.mailFrom,
        to: job.to_email,
        replyTo: "info@frontlineofinnovation.de",
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: { "X-Entity-Ref-ID": `${job.type}-${job.id}` },
      },
      { idempotencyKey: `foi-web-${job.type}-${job.id}` },
    );
    if (res.error) {
      failed++;
      await supa.from("email_queue").update({ last_error: res.error.message, locked_at: null }).eq("id", job.id);
      await supa.from("email_log").insert({ invitation_id: i.id, to_email: job.to_email, type: job.type, subject: mail.subject, status: "fehler", error: res.error.message });
      if (/rate|limit|quota/i.test(res.error.message)) break;
      continue;
    }
    sent++;
    today++;
    await supa.from("email_queue").update({ sent_at: new Date().toISOString(), locked_at: null, last_error: null }).eq("id", job.id);
    await supa.from("email_log").insert({ invitation_id: i.id, to_email: job.to_email, type: job.type, subject: mail.subject, resend_id: res.data?.id ?? null });
    if (job.type === "einladung" && i.status === "vorgemerkt") {
      await supa.from("invitations").update({ status: "eingeladen", invited_at: new Date().toISOString() }).eq("id", i.id);
    }
    await new Promise((r) => setTimeout(r, 550)); // Resend: wenige Anfragen pro Sekunde
  }
  return { sent, failed, deferred };
}

/** Bestätigungsmail sofort einreihen und versenden – Fehler blockieren die Anmeldung nie. */
export async function sendNow(invitationId: string, type: MailType) {
  try {
    await enqueue([invitationId], type, { priority: 1, force: true });
    await processQueue(5);
  } catch (e) {
    console.error("Mailversand fehlgeschlagen", type, invitationId, e);
  }
}
