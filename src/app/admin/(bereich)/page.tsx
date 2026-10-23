import Link from "next/link";
import { fmtDateTime, H1, Notice } from "@/components/admin";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { sentLast24h } from "@/lib/mail/queue";
import { fmtEventDate } from "@/lib/mail/templates";
import { db } from "@/lib/supabase/admin";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ hinweis?: string; fehler?: string }> }) {
  const admin = await requireAdmin();
  const { hinweis, fehler } = await searchParams;
  const supa = db();
  const [{ data: events }, { count: newInquiries }, { count: contacts }, { count: queued }, sent24, { data: activity }] = await Promise.all([
    supa.from("events").select("id,name,edition,venue,starts_at,status,registration_open").order("starts_at", { ascending: false, nullsFirst: true }).limit(6),
    supa.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "neu"),
    supa.from("contacts").select("id", { count: "exact", head: true }),
    supa.from("email_queue").select("id", { count: "exact", head: true }).is("sent_at", null).lt("attempts", 5),
    sentLast24h(),
    supa.from("activity_log").select("actor,action,created_at").order("created_at", { ascending: false }).limit(12),
  ]);
  const ids = (events ?? []).map((e) => e.id);
  const { data: inv } = ids.length ? await supa.from("invitations").select("event_id,status").in("event_id", ids) : { data: [] };
  const count = (id: string, s: string) => (inv ?? []).filter((r) => r.event_id === id && r.status === s).length;

  return (
    <>
      <H1 sub={`Angemeldet als ${admin.name || admin.email}`}>Übersicht</H1>
      <Notice text={hinweis ?? (fehler === "rechte" ? "Fehler: Für diese Aktion fehlen Ihnen die Rechte." : undefined)} />

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li className="card-dark p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-dim">Neue Anfragen</p>
          <p className="mt-1 font-display text-4xl font-bold">{newInquiries ?? 0}</p>
          <Link href="/admin/anfragen" className="text-sm">
            Ansehen →
          </Link>
        </li>
        <li className="card-dark p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-dim">Kontakte</p>
          <p className="mt-1 font-display text-4xl font-bold">{contacts ?? 0}</p>
          <Link href="/admin/kontakte" className="text-sm">
            Alle Kontakte →
          </Link>
        </li>
        <li className="card-dark p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-dim">Mails in Warteschlange</p>
          <p className="mt-1 font-display text-4xl font-bold">{queued ?? 0}</p>
          <Link href="/admin/mails" className="text-sm">
            Versand →
          </Link>
        </li>
        <li className="card-dark p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-dim">Gesendet (24 h)</p>
          <p className="mt-1 font-display text-4xl font-bold">
            {sent24} <span className="text-lg text-dim">/ {env.mailDailyLimit}</span>
          </p>
          <span className="text-sm text-dim">Tageslimit Resend</span>
        </li>
      </ul>

      <h2 className="mb-3 mt-12 font-display text-2xl font-semibold uppercase">Events</h2>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Datum</th>
              <th>Status</th>
              <th>Anmeldung</th>
              <th>Zugesagt</th>
              <th>Abgesagt</th>
              <th>Offen</th>
            </tr>
          </thead>
          <tbody>
            {(events ?? []).map((e) => (
              <tr key={e.id}>
                <td>
                  <Link href={`/admin/events/${e.id}`}>{e.edition ? `${e.edition}. Edition · ` : ""}{e.venue || e.name}</Link>
                </td>
                <td>{e.starts_at ? fmtEventDate(e.starts_at, false) : "–"}</td>
                <td>{e.status}</td>
                <td>{e.registration_open ? "offen" : "zu"}</td>
                <td>{count(e.id, "zugesagt") + count(e.id, "teilgenommen")}</td>
                <td>{count(e.id, "abgesagt")}</td>
                <td>{count(e.id, "eingeladen") + count(e.id, "vorgemerkt")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!events?.length ? (
          <p className="mt-4 text-sm text-muted">
            Noch kein Event angelegt. <Link href="/admin/events">Jetzt anlegen →</Link>
          </p>
        ) : null}
      </div>

      <h2 className="mb-3 mt-12 font-display text-2xl font-semibold uppercase">Letzte Aktivitäten</h2>
      <ul className="divide-y divide-line border-y border-line text-sm">
        {(activity ?? []).map((a, i) => (
          <li key={i} className="flex gap-4 py-2">
            <span className="w-32 shrink-0 text-dim">{fmtDateTime(a.created_at)}</span>
            <span className="w-56 shrink-0 truncate">{a.actor}</span>
            <span className="text-muted">{a.action}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
