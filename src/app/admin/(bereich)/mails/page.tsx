import { runQueue } from "@/app/admin/actions";
import { fmtDateTime, H1, Notice } from "@/components/admin";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { sentLast24h } from "@/lib/mail/queue";
import { MAIL_LABEL, type MailType } from "@/lib/mail/templates";
import { db } from "@/lib/supabase/admin";

export const metadata = { title: "Mails" };

export default async function MailsPage({ searchParams }: { searchParams: Promise<{ hinweis?: string }> }) {
  await requireAdmin();
  const { hinweis } = await searchParams;
  const supa = db();
  const [{ data: pending, count: pendingCount }, { data: log }, sent24] = await Promise.all([
    supa
      .from("email_queue")
      .select("id,to_email,type,priority,scheduled_for,attempts,last_error", { count: "exact" })
      .is("sent_at", null)
      .order("priority")
      .order("scheduled_for")
      .limit(100),
    supa.from("email_log").select("id,to_email,type,subject,status,error,created_at").order("created_at", { ascending: false }).limit(150),
    sentLast24h(),
  ]);
  const label = (t: string) => MAIL_LABEL[t as MailType] ?? t;

  return (
    <>
      <H1 sub={`Gesendet in den letzten 24 Stunden: ${sent24} von höchstens ${env.mailDailyLimit}. Bestätigungen für Gäste haben Vorrang.`}>Mails</H1>
      <Notice text={hinweis} />

      <section className="card-dark flex flex-wrap items-center justify-between gap-4 p-5">
        <p>
          <b className="font-display text-2xl">{pendingCount ?? 0}</b> <span className="text-muted">Mails in der Warteschlange</span>
        </p>
        <form action={runQueue}>
          <button type="submit" className="btn-sm" disabled={!pendingCount}>
            Jetzt weiter versenden
          </button>
        </form>
      </section>

      {pending?.length ? (
        <div className="mt-6 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>An</th>
                <th>Mail</th>
                <th>Geplant</th>
                <th>Versuche</th>
                <th>Letzter Fehler</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((m) => (
                <tr key={m.id}>
                  <td>{m.to_email}</td>
                  <td>{label(m.type)}</td>
                  <td>{fmtDateTime(m.scheduled_for)}</td>
                  <td>{m.attempts}</td>
                  <td className="text-xs text-red-400">{m.last_error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <h2 className="mt-12 font-display text-2xl font-semibold uppercase">Protokoll</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Zeit</th>
              <th>An</th>
              <th>Mail</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(log ?? []).map((m) => (
              <tr key={m.id}>
                <td className="whitespace-nowrap">{fmtDateTime(m.created_at)}</td>
                <td>{m.to_email}</td>
                <td>
                  {label(m.type)}
                  <span className="block text-xs text-dim">{m.subject}</span>
                </td>
                <td className={m.status === "gesendet" ? "text-green-400" : "text-red-400"}>
                  {m.status}
                  {m.error ? <span className="block text-xs">{m.error}</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!log?.length ? <p className="mt-4 text-sm text-muted">Noch keine Mails verschickt.</p> : null}
      </div>
    </>
  );
}
