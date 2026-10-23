import Link from "next/link";
import { notFound } from "next/navigation";
import { addGuest, copyGuests, removeInvitation, sendBulk, sendSingle, toggleRegistration, updateEvent, updateInvitation } from "@/app/admin/actions";
import { H1, Notice, StatusPill } from "@/components/admin";
import { EventFields } from "@/components/event-form";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { fmtEventDate, MAIL_LABEL, previewContext, renderMail, type MailType } from "@/lib/mail/templates";
import { DIETS } from "@/lib/rsvp-shared";
import { CATEGORY, STATUS, STATUS_KEYS } from "@/lib/status";
import { db } from "@/lib/supabase/admin";

export const metadata = { title: "Event" };

type Row = {
  id: string;
  code: string;
  manage_token: string;
  status: string;
  category: string;
  diet: string;
  allergies: string;
  phone: string;
  table_no: string;
  note: string;
  responded_at: string | null;
  contacts: { id: string; title: string; first_name: string; last_name: string; email: string | null; company: string; position: string; opted_out_at: string | null };
};

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hinweis?: string; status?: string; q?: string; vorschau?: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const { hinweis, status = "", q = "", vorschau } = await searchParams;
  const supa = db();
  const { data: ev } = await supa.from("events").select("*").eq("id", id).maybeSingle();
  if (!ev) notFound();

  const [{ data: rows }, { data: otherEvents }, { count: queued }] = await Promise.all([
    supa
      .from("invitations")
      .select("id,code,manage_token,status,category,diet,allergies,phone,table_no,note,responded_at,contacts(id,title,first_name,last_name,email,company,position,opted_out_at)")
      .eq("event_id", id)
      .order("created_at", { ascending: true }),
    supa.from("events").select("id,name,edition,venue").neq("id", id).order("starts_at", { ascending: false }),
    supa.from("email_queue").select("id, invitations!inner(event_id)", { count: "exact", head: true }).eq("invitations.event_id", id).is("sent_at", null).lt("attempts", 5),
  ]);
  const all = (rows ?? []) as unknown as Row[];
  const counts = Object.fromEntries(STATUS_KEYS.map((s) => [s, all.filter((r) => r.status === s).length]));
  const needle = q.trim().toLowerCase();
  const list = all.filter(
    (r) =>
      (!status || r.status === status) &&
      (!needle || `${r.contacts.first_name} ${r.contacts.last_name} ${r.contacts.company} ${r.contacts.email} ${r.code}`.toLowerCase().includes(needle)),
  );
  const zugesagt = counts.zugesagt + counts.teilgenommen;
  const isAdmin = admin.role === "admin";
  const mailEvent = { name: ev.name, edition: ev.edition, starts_at: ev.starts_at, venue: ev.venue, address: ev.address, details: ev.details, rsvp_deadline: ev.rsvp_deadline };
  let preview: { subject: string; text: string } | null = null;
  let previewError = "";
  if (vorschau && vorschau in MAIL_LABEL) {
    try {
      preview = renderMail(vorschau as MailType, previewContext(mailEvent, env.publicUrl));
    } catch (e) {
      previewError = e instanceof Error ? e.message : String(e);
    }
  }
  const qs = (p: Record<string, string>) => {
    const u = new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), ...p });
    for (const [k, v] of [...u.entries()]) if (!v) u.delete(k);
    const s = u.toString();
    return `/admin/events/${id}${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <p className="mb-2 text-sm">
        <Link href="/admin/events">← Alle Events</Link>
      </p>
      <H1 sub={`${ev.starts_at ? fmtEventDate(ev.starts_at) : "Datum offen"}${ev.address ? ` · ${ev.address}` : ""}`}>
        {ev.edition ? `${ev.edition}. Edition · ` : ""}
        {ev.venue || ev.name}
      </H1>
      <Notice text={hinweis} />

      {/* Kennzahlen + Anmeldung */}
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
          {STATUS_KEYS.map((s) => (
            <li key={s}>
              <Link href={qs({ status: status === s ? "" : s })} className={`card-dark block p-3 no-underline ${status === s ? "!border-gold" : ""}`}>
                <span className="block text-[10px] uppercase tracking-[0.16em]" style={{ color: STATUS[s].color }}>
                  {STATUS[s].label}
                </span>
                <span className="font-display text-2xl font-bold text-white">{counts[s]}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="card-dark flex flex-col justify-between gap-3 p-4">
          <p className="text-sm">
            <span className="text-dim">Zusagen </span>
            <b className="font-display text-xl">
              {zugesagt}
              {ev.capacity ? ` / ${ev.capacity}` : ""}
            </b>
            <span className="ml-3 text-dim">Anmeldung </span>
            <b className={ev.registration_open ? "text-green-400" : "text-gold"}>{ev.registration_open ? "offen" : "geschlossen"}</b>
            {ev.status !== "aktiv" ? <span className="block text-xs text-gold-light">Status „{ev.status}“ – Zusagen erst möglich, wenn das Event „aktiv“ ist.</span> : null}
          </p>
          {isAdmin ? (
            <form action={toggleRegistration}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="open" value={ev.registration_open ? "0" : "1"} />
              <button type="submit" className="btn-sm">
                {ev.registration_open ? "Anmeldung schließen" : "Anmeldung öffnen"}
              </button>
            </form>
          ) : null}
        </div>
      </div>

      {/* Werkzeuge */}
      <div className="mt-6 grid gap-3 xl:grid-cols-3">
        <details className="card-dark p-5" open={all.length === 0}>
          <summary className="font-display text-lg font-semibold uppercase">+ Gast hinzufügen</summary>
          <form action={addGuest} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="event_id" value={id} />
            <select name="salutation" className="field" defaultValue="">
              <option value="">Anrede</option>
              <option>Herr</option>
              <option>Frau</option>
            </select>
            <input name="title" className="field" placeholder="Titel (z. B. Dr.)" />
            <input name="first_name" className="field" placeholder="Vorname *" required />
            <input name="last_name" className="field" placeholder="Nachname *" required />
            <input name="email" type="email" className="field sm:col-span-2" placeholder="E-Mail (vorhandene Kontakte werden erkannt)" />
            <input name="company" className="field" placeholder="Unternehmen" />
            <input name="position" className="field" placeholder="Position" />
            <select name="category" className="field" defaultValue="">
              {Object.entries(CATEGORY).map(([k, v]) => (
                <option key={k} value={k}>
                  {k ? v : "Kategorie"}
                </option>
              ))}
            </select>
            <input name="referred_by" className="field" placeholder="Empfohlen von" />
            <label className="chk sm:col-span-2">
              <input type="checkbox" name="send_now" />
              <span>Einladung sofort per Mail schicken</span>
            </label>
            <button type="submit" className="btn-gold sm:col-span-2">
              Hinzufügen
            </button>
          </form>
        </details>

        {isAdmin ? (
          <details className="card-dark p-5">
            <summary className="font-display text-lg font-semibold uppercase">Gäste aus früherem Event</summary>
            <form action={copyGuests} className="mt-4 space-y-3">
              <input type="hidden" name="event_id" value={id} />
              <select name="from_event_id" className="field" required defaultValue="">
                <option value="">Event wählen</option>
                {(otherEvents ?? []).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.edition ? `${o.edition}. Edition · ` : ""}
                    {o.venue || o.name}
                  </option>
                ))}
              </select>
              <fieldset className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <legend className="lbl">mit Status</legend>
                {STATUS_KEYS.map((s) => (
                  <label key={s} className="chk text-sm">
                    <input type="checkbox" name="from_status" value={s} defaultChecked={s === "zugesagt" || s === "teilgenommen"} />
                    <span>{STATUS[s].label}</span>
                  </label>
                ))}
              </fieldset>
              <p className="text-xs text-dim">Übernommene Gäste stehen als „vorgemerkt“ in der Liste und bekommen erst mit dem Versand der Einladung eine Mail. Abgemeldete Kontakte werden übersprungen.</p>
              <button type="submit" className="btn-sm">
                Übernehmen
              </button>
            </form>
          </details>
        ) : null}

        {isAdmin ? (
          <details className="card-dark p-5" open={Boolean(vorschau)}>
            <summary className="font-display text-lg font-semibold uppercase">Versand</summary>
            <div className="mt-4 space-y-4 text-sm">
              <p className="text-muted">
                Vorschau:{" "}
                {(Object.keys(MAIL_LABEL) as MailType[]).map((t) => (
                  <Link key={t} href={qs({ vorschau: t })} className="mr-3">
                    {MAIL_LABEL[t]}
                  </Link>
                ))}
              </p>
              {(["einladung", "erinnerung"] as const).map((t) => {
                const target = t === "einladung" ? counts.vorgemerkt : counts.eingeladen;
                return (
                  <form key={t} action={sendBulk} className="border-t border-line pt-4">
                    <input type="hidden" name="event_id" value={id} />
                    <input type="hidden" name="type" value={t} />
                    <p>
                      <b>{MAIL_LABEL[t]}</b> an alle mit Status „{t === "einladung" ? "Vorgemerkt" : "Eingeladen"}“ ({target})
                    </p>
                    <label className="chk mt-2 text-sm">
                      <input type="checkbox" name="confirm" />
                      <span>Ja, an {target} Gäste senden</span>
                    </label>
                    <button type="submit" className="btn-sm mt-2" disabled={!target}>
                      Senden
                    </button>
                  </form>
                );
              })}
              <p className="text-xs text-dim">
                Höchstens {env.mailDailyLimit} Mails in 24 Stunden (Resend). Was darüber liegt, bleibt in der Warteschlange und geht über „Mails“ später raus.
                {queued ? ` Aktuell ${queued} wartend.` : ""}
              </p>
            </div>
          </details>
        ) : null}
      </div>

      {preview || previewError ? (
        <div className="card-dark mt-4 p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold uppercase">Vorschau: {MAIL_LABEL[vorschau as MailType]}</p>
            <Link href={qs({ vorschau: "" })} className="btn-sm">
              Schließen
            </Link>
          </div>
          {previewError ? <p className="mt-3 text-gold-light">{previewError} – bitte die Event-Angaben ergänzen. Solange Platzhalter offen sind, geht diese Mail nicht raus.</p> : null}
          {preview ? (
            <>
              <p className="mt-3 text-sm text-muted">Betreff: {preview.subject}</p>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#ddd]">{preview.text}</pre>
            </>
          ) : null}
        </div>
      ) : null}

      {/* Gästeliste */}
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold uppercase">
          Gäste {status ? `· ${STATUS[status as keyof typeof STATUS]?.label}` : ""} <span className="text-dim">({list.length})</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <form className="flex gap-2">
            {status ? <input type="hidden" name="status" value={status} /> : null}
            <input name="q" defaultValue={q} placeholder="Suchen: Name, Firma, Code" className="field !min-h-9 !w-64 !text-sm" />
            <button className="btn-sm" type="submit">
              Suchen
            </button>
          </form>
          <a href={`/admin/export/${id}`} className="btn-sm">
            Excel-Export
          </a>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Unternehmen</th>
              <th>Status</th>
              <th>Menü</th>
              <th>Allergien</th>
              <th>Tisch</th>
              <th>Code</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link href={`/admin/kontakte/${r.contacts.id}`} className="text-white">
                    {[r.contacts.title, r.contacts.first_name, r.contacts.last_name].filter(Boolean).join(" ")}
                  </Link>
                  <span className="block text-xs text-dim">{r.contacts.email ?? "keine Mail"}{r.contacts.opted_out_at ? " · abgemeldet" : ""}</span>
                </td>
                <td>
                  {r.contacts.company}
                  {r.category ? <span className="block text-xs text-dim">{CATEGORY[r.category]}</span> : null}
                </td>
                <td>
                  <StatusPill status={r.status} />
                </td>
                <td>{r.diet}</td>
                <td className="max-w-[180px] text-xs">{r.allergies}</td>
                <td>{r.table_no}</td>
                <td className="font-mono text-xs">{r.code}</td>
                <td>
                  <details>
                    <summary className="btn-sm">Bearbeiten</summary>
                    <div className="mt-2 w-72 space-y-3 border border-line bg-[#0b0b0b] p-3">
                      <form action={updateInvitation} className="space-y-2">
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="event_id" value={id} />
                        <select name="status" className="field !min-h-9 !text-sm" defaultValue={r.status}>
                          {STATUS_KEYS.map((s) => (
                            <option key={s} value={s}>
                              {STATUS[s].label}
                            </option>
                          ))}
                        </select>
                        <select name="category" className="field !min-h-9 !text-sm" defaultValue={r.category}>
                          {Object.entries(CATEGORY).map(([k, v]) => (
                            <option key={k} value={k}>
                              {k ? v : "Kategorie"}
                            </option>
                          ))}
                        </select>
                        <select name="diet" className="field !min-h-9 !text-sm" defaultValue={r.diet}>
                          <option value="">Menü</option>
                          {DIETS.map((d) => (
                            <option key={d}>{d}</option>
                          ))}
                        </select>
                        <input name="table_no" className="field !min-h-9 !text-sm" placeholder="Tisch" defaultValue={r.table_no} />
                        <textarea name="note" className="field !text-sm" rows={2} placeholder="Notiz" defaultValue={r.note} />
                        <button type="submit" className="btn-sm">
                          Speichern
                        </button>
                      </form>
                      <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                        {(["einladung", "erinnerung"] as const).map((t) => (
                          <form key={t} action={sendSingle}>
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="event_id" value={id} />
                            <input type="hidden" name="type" value={t} />
                            <button type="submit" className="btn-sm">
                              {t === "einladung" ? "Einladung senden" : "Erinnern"}
                            </button>
                          </form>
                        ))}
                        {r.status === "vorgemerkt" && isAdmin ? (
                          <form action={removeInvitation}>
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="event_id" value={id} />
                            <button type="submit" className="btn-sm">
                              Entfernen
                            </button>
                          </form>
                        ) : null}
                      </div>
                      <p className="break-all text-xs text-dim">
                        Link für den Gast: {env.publicUrl}/einladung?code={r.code}
                      </p>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length ? <p className="mt-4 text-sm text-muted">Keine Gäste {status || q ? "für diesen Filter" : "– fügen Sie oben welche hinzu"}.</p> : null}
      </div>

      {isAdmin ? (
        <details className="card-dark mt-12 p-5">
          <summary className="font-display text-lg font-semibold uppercase">Event-Angaben bearbeiten</summary>
          <form action={updateEvent} className="mt-6 space-y-6">
            <EventFields ev={ev} />
            <button type="submit" className="btn-gold">
              Speichern
            </button>
          </form>
        </details>
      ) : null}
    </>
  );
}
