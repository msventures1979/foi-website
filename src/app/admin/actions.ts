"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroySession, requireAdmin } from "@/lib/auth";
import { newInvitationCode } from "@/lib/codes";
import { logActivity } from "@/lib/log";
import { enqueue, processQueue } from "@/lib/mail/queue";
import { BULK_TYPES, type MailType } from "@/lib/mail/templates";
import { STATUS_KEYS } from "@/lib/status";
import { db } from "@/lib/supabase/admin";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const back = (path: string, msg: string): never => redirect(`${path}${path.includes("?") ? "&" : "?"}hinweis=${encodeURIComponent(msg)}`);

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

function eventFields(f: FormData) {
  const date = str(f, "date");
  const time = str(f, "time") || "18:00";
  // Eingaben sind Ortszeit Mannheim; als ISO mit Zeitzone speichern
  const starts_at = date ? new Date(`${date}T${time}:00${berlinOffset(date)}`).toISOString() : null;
  const capacity = Number(str(f, "capacity")) || null;
  const edition = Number(str(f, "edition")) || null;
  return {
    name: str(f, "name") || "Frontline of Innovation",
    edition,
    starts_at,
    venue: str(f, "venue"),
    address: str(f, "address"),
    details: str(f, "details"),
    rsvp_deadline: str(f, "rsvp_deadline") || null,
    capacity,
    closed_message: str(f, "closed_message") || "Die Anmeldung ist geschlossen.",
    status: (["entwurf", "aktiv", "abgeschlossen"].includes(str(f, "status")) ? str(f, "status") : "entwurf") as string,
  };
}

/** Sommer-/Winterzeit für ein Datum in Europe/Berlin */
function berlinOffset(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  const s = d.toLocaleString("en-US", { timeZone: "Europe/Berlin", timeZoneName: "shortOffset" });
  const m = s.match(/GMT([+-]\d+)/);
  const h = m ? Number(m[1]) : 1;
  return `${h >= 0 ? "+" : "-"}${String(Math.abs(h)).padStart(2, "0")}:00`;
}

export async function createEvent(f: FormData) {
  const admin = await requireAdmin("admin");
  const fields = eventFields(f);
  const slug =
    str(f, "slug") ||
    `${(fields.venue || fields.name).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${fields.starts_at ? fields.starts_at.slice(0, 7) : Date.now()}`;
  const { data, error } = await db().from("events").insert({ ...fields, slug }).select("id").single();
  if (error) back("/admin/events", `Fehler: ${error.message}`);
  await logActivity(admin.email, "event.angelegt", "event", data!.id, { slug });
  redirect(`/admin/events/${data!.id}?hinweis=${encodeURIComponent("Event angelegt")}`);
}

export async function updateEvent(f: FormData) {
  const admin = await requireAdmin("admin");
  const id = str(f, "id");
  const { error } = await db().from("events").update(eventFields(f)).eq("id", id);
  if (error) back(`/admin/events/${id}`, `Fehler: ${error.message}`);
  await logActivity(admin.email, "event.geaendert", "event", id);
  revalidatePath(`/admin/events/${id}`);
  back(`/admin/events/${id}`, "Gespeichert");
}

export async function toggleRegistration(f: FormData) {
  const admin = await requireAdmin("admin");
  const id = str(f, "id");
  const open = str(f, "open") === "1";
  await db().from("events").update({ registration_open: open }).eq("id", id);
  await logActivity(admin.email, open ? "anmeldung.geoeffnet" : "anmeldung.geschlossen", "event", id);
  revalidatePath(`/admin/events/${id}`);
  back(`/admin/events/${id}`, open ? "Anmeldung geöffnet" : "Anmeldung geschlossen");
}

// ---------------------------------------------------------------------------
// Gäste
// ---------------------------------------------------------------------------

async function uniqueCode() {
  for (let i = 0; i < 10; i++) {
    const code = newInvitationCode();
    const { count } = await db().from("invitations").select("id", { count: "exact", head: true }).eq("code", code);
    if (!count) return code;
  }
  throw new Error("Kein freier Code gefunden");
}

/** Gast zu einem Event hinzufügen – vorhandene Kontakte werden über die Mailadresse wiedererkannt. */
export async function addGuest(f: FormData) {
  const admin = await requireAdmin();
  const eventId = str(f, "event_id");
  const path = `/admin/events/${eventId}`;
  const supa = db();
  let contactId = str(f, "contact_id");
  const email = str(f, "email").toLowerCase();

  if (!contactId) {
    if (!str(f, "first_name") || !str(f, "last_name")) back(path, "Bitte Vor- und Nachnamen angeben");
    if (email) {
      const { data: existing } = await supa.from("contacts").select("id").eq("email", email).maybeSingle();
      if (existing) contactId = existing.id;
    }
    if (!contactId) {
      const { data, error } = await supa
        .from("contacts")
        .insert({
          salutation: ["Herr", "Frau"].includes(str(f, "salutation")) ? str(f, "salutation") : "",
          title: str(f, "title"),
          first_name: str(f, "first_name"),
          last_name: str(f, "last_name"),
          email: email || null,
          company: str(f, "company"),
          position: str(f, "position"),
          linkedin: str(f, "linkedin"),
          referred_by: str(f, "referred_by"),
          source: "admin",
        })
        .select("id")
        .single();
      if (error) back(path, `Fehler: ${error.message}`);
      contactId = data!.id;
    }
  }

  const { data: dup } = await supa.from("invitations").select("id").eq("event_id", eventId).eq("contact_id", contactId).maybeSingle();
  if (dup) back(path, "Diese Person ist für das Event bereits eingetragen");

  const { data: inv, error } = await supa
    .from("invitations")
    .insert({ event_id: eventId, contact_id: contactId, code: await uniqueCode(), status: "vorgemerkt", category: str(f, "category"), source: "admin" })
    .select("id, code")
    .single();
  if (error) back(path, `Fehler: ${error.message}`);
  await logActivity(admin.email, "gast.hinzugefuegt", "invitation", inv!.id, { code: inv!.code });
  if (str(f, "send_now") === "on") {
    await enqueue([inv!.id], "einladung");
    await processQueue(5);
  }
  revalidatePath(path);
  back(path, `Gast hinzugefügt (${inv!.code})`);
}

/** Gäste aus einem früheren Event übernehmen (z. B. alle, die zugesagt hatten) */
export async function copyGuests(f: FormData) {
  const admin = await requireAdmin("admin");
  const eventId = str(f, "event_id");
  const fromId = str(f, "from_event_id");
  const statuses = f.getAll("from_status").map(String).filter((s) => STATUS_KEYS.includes(s as never));
  const path = `/admin/events/${eventId}`;
  if (!fromId || !statuses.length) back(path, "Bitte Quelle und Status wählen");
  const supa = db();
  const [{ data: src }, { data: have }] = await Promise.all([
    supa.from("invitations").select("contact_id, category, contacts!inner(opted_out_at)").eq("event_id", fromId).in("status", statuses),
    supa.from("invitations").select("contact_id").eq("event_id", eventId),
  ]);
  const existing = new Set((have ?? []).map((r) => r.contact_id));
  const rows = [];
  for (const r of (src ?? []) as unknown as { contact_id: string; category: string; contacts: { opted_out_at: string | null } }[]) {
    if (existing.has(r.contact_id) || r.contacts.opted_out_at) continue;
    existing.add(r.contact_id);
    rows.push({ event_id: eventId, contact_id: r.contact_id, code: await uniqueCode(), status: "vorgemerkt", category: r.category, source: `uebernommen:${fromId}` });
  }
  if (rows.length) {
    const { error } = await supa.from("invitations").insert(rows);
    if (error) back(path, `Fehler: ${error.message}`);
  }
  await logActivity(admin.email, "gaeste.uebernommen", "event", eventId, { from: fromId, statuses, count: rows.length });
  revalidatePath(path);
  back(path, `${rows.length} Gäste als „vorgemerkt“ übernommen`);
}

export async function updateInvitation(f: FormData) {
  const admin = await requireAdmin();
  const id = str(f, "id");
  const eventId = str(f, "event_id");
  const status = str(f, "status");
  const patch: Record<string, unknown> = {
    category: str(f, "category"),
    table_no: str(f, "table_no"),
    note: str(f, "note"),
    diet: str(f, "diet"),
  };
  if (STATUS_KEYS.includes(status as never)) {
    patch.status = status;
    if (status === "teilgenommen") patch.checked_in_at = new Date().toISOString();
  }
  await db().from("invitations").update(patch).eq("id", id);
  await logActivity(admin.email, "einladung.geaendert", "invitation", id, { status });
  revalidatePath(`/admin/events/${eventId}`);
  back(`/admin/events/${eventId}`, "Gespeichert");
}

export async function removeInvitation(f: FormData) {
  const admin = await requireAdmin("admin");
  const id = str(f, "id");
  const eventId = str(f, "event_id");
  await db().from("invitations").delete().eq("id", id).in("status", ["vorgemerkt"]);
  await logActivity(admin.email, "einladung.entfernt", "invitation", id);
  revalidatePath(`/admin/events/${eventId}`);
  back(`/admin/events/${eventId}`, "Entfernt (nur möglich, solange noch keine Einladung verschickt wurde)");
}

export async function updateContact(f: FormData) {
  const admin = await requireAdmin();
  const id = str(f, "id");
  const back_to = str(f, "back") || "/admin/kontakte";
  const email = str(f, "email").toLowerCase();
  const { error } = await db()
    .from("contacts")
    .update({
      salutation: ["Herr", "Frau"].includes(str(f, "salutation")) ? str(f, "salutation") : "",
      title: str(f, "title"),
      first_name: str(f, "first_name"),
      last_name: str(f, "last_name"),
      email: email || null,
      company: str(f, "company"),
      position: str(f, "position"),
      phone: str(f, "phone"),
      linkedin: str(f, "linkedin"),
      referred_by: str(f, "referred_by"),
      notes: str(f, "notes"),
      opted_out_at: str(f, "opted_out") === "on" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) back(back_to, `Fehler: ${error.message.includes("duplicate") ? "Diese Mailadresse gibt es schon" : error.message}`);
  await logActivity(admin.email, "kontakt.geaendert", "contact", id);
  revalidatePath(back_to);
  back(back_to, "Kontakt gespeichert");
}

// ---------------------------------------------------------------------------
// Mails
// ---------------------------------------------------------------------------

export async function sendBulk(f: FormData) {
  const admin = await requireAdmin("admin");
  const eventId = str(f, "event_id");
  const type = str(f, "type") as MailType;
  const path = `/admin/events/${eventId}`;
  if (!BULK_TYPES.includes(type)) back(path, "Unbekannte Mail");
  if (str(f, "confirm") !== "on") back(path, "Bitte den Versand bestätigen");
  const statuses = type === "einladung" ? ["vorgemerkt"] : ["eingeladen"];
  const { data } = await db().from("invitations").select("id").eq("event_id", eventId).in("status", statuses);
  const ids = (data ?? []).map((r) => r.id);
  const { queued, skipped } = await enqueue(ids, type);
  const r = await processQueue(40);
  await logActivity(admin.email, "versand.gestartet", "event", eventId, { type, queued, skipped, ...r });
  revalidatePath(path);
  back(path, `${queued} Mails eingereiht, ${r.sent} sofort verschickt${r.deferred ? `, ${r.deferred} wegen Tageslimit später` : ""}${r.failed ? `, ${r.failed} Fehler` : ""}`);
}

export async function sendSingle(f: FormData) {
  const admin = await requireAdmin();
  const id = str(f, "id");
  const eventId = str(f, "event_id");
  const type = str(f, "type") as MailType;
  const { queued } = await enqueue([id], type, { priority: 2, force: true });
  const r = await processQueue(5);
  await logActivity(admin.email, "mail.einzeln", "invitation", id, { type });
  revalidatePath(`/admin/events/${eventId}`);
  back(`/admin/events/${eventId}`, queued ? (r.sent ? "Mail verschickt" : "Mail eingereiht") : "Nicht verschickt (Kontakt ohne Mail oder abgemeldet)");
}

export async function runQueue() {
  const admin = await requireAdmin();
  const r = await processQueue(60);
  await logActivity(admin.email, "versand.manuell", "", "", r);
  revalidatePath("/admin/mails");
  back("/admin/mails", `${r.sent} verschickt${r.deferred ? `, ${r.deferred} warten auf das Tageslimit` : ""}${r.failed ? `, ${r.failed} Fehler` : ""}`);
}

// ---------------------------------------------------------------------------
// Anfragen
// ---------------------------------------------------------------------------

export async function setInquiryStatus(f: FormData) {
  const admin = await requireAdmin();
  const id = str(f, "id");
  const status = str(f, "status");
  if (!["neu", "in_bearbeitung", "erledigt", "abgelehnt"].includes(status)) back("/admin/anfragen", "Unbekannter Status");
  await db().from("inquiries").update({ status }).eq("id", id);
  await logActivity(admin.email, "anfrage.status", "inquiry", id, { status });
  revalidatePath("/admin/anfragen");
  back("/admin/anfragen", "Status gespeichert");
}
