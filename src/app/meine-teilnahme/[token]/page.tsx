import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RsvpForm } from "@/app/einladung/forms";
import { PageShell } from "@/components/site";
import { env } from "@/lib/env";
import { fmtEventDate } from "@/lib/mail/templates";
import { canAccept, invitationByToken, isOver } from "@/lib/rsvp";

export const metadata: Metadata = { title: "Ihre Teilnahme", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const MSG: Record<string, string> = {
  zusage: "Vielen Dank für Ihre Zusage. Eine Bestätigung ist per Mail unterwegs.",
  gespeichert: "Ihre Angaben sind gespeichert.",
  absage: "Ihre Absage ist angekommen. Schade – wir freuen uns auf ein nächstes Mal.",
};

export default async function TeilnahmePage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ ok?: string }> }) {
  const { token } = await params;
  const { ok } = await searchParams;
  const inv = env.hasDb ? await invitationByToken(token) : null;
  if (!inv) notFound();
  const e = inv.events;
  const c = inv.contacts;
  const over = isOver(e);

  return (
    <PageShell>
      <section className="mx-auto max-w-[860px] px-4 py-16 sm:px-6 md:py-24">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Ihre Teilnahme</p>
        <h1 className="mt-4 font-display text-[clamp(40px,6vw,72px)] font-bold uppercase leading-[0.95]">
          {e.venue || e.name}
          {e.starts_at ? <span className="outline-text block">{fmtEventDate(e.starts_at, false)}</span> : null}
        </h1>
        <p className="mt-4 text-muted">
          {[c.title, c.first_name, c.last_name].filter(Boolean).join(" ")}
          {c.company ? ` · ${c.company}` : ""}
        </p>

        {ok && MSG[ok] ? (
          <p role="status" className="mt-8 border-l-2 border-gold bg-card px-5 py-4">
            {MSG[ok]}
          </p>
        ) : null}

        <dl className="mt-10 grid gap-px bg-line sm:grid-cols-3">
          <div className="bg-black p-5">
            <dt className="text-[11px] uppercase tracking-[0.24em] text-dim">Status</dt>
            <dd className="mt-1 font-display text-2xl font-semibold uppercase">
              {inv.status === "zugesagt" ? "Zugesagt" : inv.status === "abgesagt" ? "Abgesagt" : "Offen"}
            </dd>
          </div>
          <div className="bg-black p-5">
            <dt className="text-[11px] uppercase tracking-[0.24em] text-dim">Wann</dt>
            <dd className="mt-1">{e.starts_at ? fmtEventDate(e.starts_at) : "wird noch bekannt gegeben"}</dd>
          </div>
          <div className="bg-black p-5">
            <dt className="text-[11px] uppercase tracking-[0.24em] text-dim">Wo</dt>
            <dd className="mt-1">{[e.venue, e.address].filter(Boolean).join(", ") || "wird noch bekannt gegeben"}</dd>
          </div>
        </dl>
        {e.details ? <p className="mt-8 whitespace-pre-line leading-relaxed text-muted">{e.details}</p> : null}

        {!over ? (
          <div className="mt-12 border-t border-line pt-10">
            <h2 className="font-display text-2xl font-semibold uppercase">{inv.status === "zugesagt" ? "Angaben ändern oder absagen" : "Ihre Antwort"}</h2>
            <div className="mt-6">
              <RsvpForm token={token} canAccept={canAccept(e)} current={{ status: inv.status, diet: inv.diet, allergies: inv.allergies, phone: inv.phone }} />
            </div>
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}
