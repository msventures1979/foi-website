import Link from "next/link";
import { notFound } from "next/navigation";
import { updateContact } from "@/app/admin/actions";
import { fmtDateTime, H1, Notice, StatusPill } from "@/components/admin";
import { requireAdmin } from "@/lib/auth";
import { MAIL_LABEL, type MailType } from "@/lib/mail/templates";
import { db } from "@/lib/supabase/admin";

export const metadata = { title: "Kontakt" };

export default async function KontaktPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ hinweis?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { hinweis } = await searchParams;
  const supa = db();
  const { data: c } = await supa.from("contacts").select("*").eq("id", id).maybeSingle();
  if (!c) notFound();
  const { data: invs } = await supa
    .from("invitations")
    .select("id,code,status,diet,responded_at,events(id,name,edition,venue,starts_at)")
    .eq("contact_id", id)
    .order("created_at", { ascending: false });
  const invIds = (invs ?? []).map((i) => i.id);
  const { data: mails } = invIds.length
    ? await supa.from("email_log").select("id,type,subject,status,error,created_at").in("invitation_id", invIds).order("created_at", { ascending: false }).limit(50)
    : { data: [] };
  const path = `/admin/kontakte/${id}`;
  const f = (name: string, label: string, value: string | null, type = "text") => (
    <label className="block">
      <span className="lbl">{label}</span>
      <input name={name} type={type} defaultValue={value ?? ""} className="field" />
    </label>
  );

  return (
    <>
      <p className="mb-2 text-sm">
        <Link href="/admin/kontakte">← Alle Kontakte</Link>
      </p>
      <H1 sub={[c.position, c.company].filter(Boolean).join(" · ")}>{[c.title, c.first_name, c.last_name].filter(Boolean).join(" ")}</H1>
      <Notice text={hinweis} />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <form action={updateContact} className="card-dark grid gap-4 p-6 sm:grid-cols-2">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="back" value={path} />
          <label className="block">
            <span className="lbl">Anrede</span>
            <select name="salutation" defaultValue={c.salutation} className="field">
              <option value="">–</option>
              <option>Herr</option>
              <option>Frau</option>
            </select>
          </label>
          {f("title", "Titel", c.title)}
          {f("first_name", "Vorname", c.first_name)}
          {f("last_name", "Nachname", c.last_name)}
          {f("email", "E-Mail", c.email, "email")}
          {f("phone", "Telefon", c.phone)}
          {f("company", "Unternehmen", c.company)}
          {f("position", "Position", c.position)}
          {f("linkedin", "LinkedIn", c.linkedin)}
          {f("referred_by", "Empfohlen von", c.referred_by)}
          <label className="block sm:col-span-2">
            <span className="lbl">Notizen</span>
            <textarea name="notes" defaultValue={c.notes} rows={4} className="field" />
          </label>
          <label className="chk sm:col-span-2">
            <input type="checkbox" name="opted_out" defaultChecked={Boolean(c.opted_out_at)} />
            <span>Möchte keine Einladungen mehr erhalten{c.opted_out_at ? ` (seit ${fmtDateTime(c.opted_out_at)})` : ""}</span>
          </label>
          <button type="submit" className="btn-gold sm:col-span-2">
            Speichern
          </button>
        </form>

        <div className="space-y-8">
          <section>
            <h2 className="font-display text-xl font-semibold uppercase">Events</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line text-sm">
              {(invs ?? []).map((i) => {
                const e = i.events as unknown as { id: string; name: string; edition: number | null; venue: string; starts_at: string | null };
                return (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <Link href={`/admin/events/${e.id}`} className="text-white">
                      {e.edition ? `${e.edition}. Edition · ` : ""}
                      {e.venue || e.name}
                    </Link>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-dim">{i.code}</span>
                      <StatusPill status={i.status} />
                    </span>
                  </li>
                );
              })}
              {!invs?.length ? <li className="py-3 text-muted">Noch keinem Event zugeordnet.</li> : null}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold uppercase">Mails</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line text-sm">
              {(mails ?? []).map((m) => (
                <li key={m.id} className="py-3">
                  <span className="text-dim">{fmtDateTime(m.created_at)}</span> · {MAIL_LABEL[m.type as MailType] ?? m.type}
                  {m.status !== "gesendet" ? <span className="block text-xs text-red-400">{m.error ?? m.status}</span> : null}
                </li>
              ))}
              {!mails?.length ? <li className="py-3 text-muted">Noch keine Mails.</li> : null}
            </ul>
          </section>
          <p className="text-xs text-dim">
            Angelegt {fmtDateTime(c.created_at)}
            {c.source ? ` · Quelle: ${c.source}` : ""}
          </p>
        </div>
      </div>
    </>
  );
}
