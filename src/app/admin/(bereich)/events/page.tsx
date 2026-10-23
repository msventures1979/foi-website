import Link from "next/link";
import { createEvent } from "@/app/admin/actions";
import { H1, Notice } from "@/components/admin";
import { EventFields } from "@/components/event-form";
import { requireAdmin } from "@/lib/auth";
import { fmtEventDate } from "@/lib/mail/templates";
import { db } from "@/lib/supabase/admin";

export const metadata = { title: "Events" };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ hinweis?: string }> }) {
  const admin = await requireAdmin();
  const { hinweis } = await searchParams;
  const { data: events } = await db().from("events").select("id,name,edition,venue,starts_at,status,registration_open").order("starts_at", { ascending: false, nullsFirst: true });
  return (
    <>
      <H1 sub="Jedes Dinner und jedes weitere Format ist ein Event mit eigener Gästeliste.">Events & Gäste</H1>
      <Notice text={hinweis} />
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(events ?? []).map((e) => (
          <li key={e.id}>
            <Link href={`/admin/events/${e.id}`} className="card-dark block p-5 no-underline hover:border-[#555]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-dim">
                {e.edition ? `${e.edition}. Edition · ` : ""}
                {e.status}
                {e.registration_open ? " · Anmeldung offen" : ""}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold uppercase text-white">{e.venue || e.name}</p>
              <p className="text-sm text-muted">{e.starts_at ? fmtEventDate(e.starts_at) : "Datum offen"}</p>
            </Link>
          </li>
        ))}
      </ul>

      {admin.role === "admin" ? (
        <details className="card-dark mt-10 p-5">
          <summary className="font-display text-xl font-semibold uppercase">+ Neues Event anlegen</summary>
          <form action={createEvent} className="mt-6 space-y-6">
            <EventFields />
            <button type="submit" className="btn-gold">
              Event anlegen
            </button>
          </form>
        </details>
      ) : null}
    </>
  );
}
