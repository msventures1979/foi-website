import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site";
import { PageHero } from "@/components/ui";
import { env } from "@/lib/env";
import { fmtEventDate } from "@/lib/mail/templates";
import { canAccept, invitationByCode, isOver } from "@/lib/rsvp";
import { CodeForm, RsvpForm } from "./forms";

export const metadata: Metadata = {
  title: "Ihre Einladung",
  robots: { index: false, follow: false },
  alternates: { canonical: "/einladung" },
};
export const dynamic = "force-dynamic";

export default async function EinladungPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  const inv = code && env.hasDb ? await invitationByCode(code) : null;

  if (!inv) {
    return (
      <PageShell>
        <PageHero image="/images/archiv/2026-05/16.webp" eyebrow="Auf persönliche Einladung" title="Ihre" outline="Einladung" grayscale>
          Geben Sie den persönlichen Code aus Ihrer Einladung ein, um zu- oder abzusagen.
        </PageHero>
        <section className="mx-auto max-w-[860px] px-4 py-16 text-center sm:px-6 md:py-24">
          <CodeForm initial={code ?? ""} />
          {code ? (
            <p role="alert" className="mt-6 text-sm text-gold-light">
              Den Code „{code}“ kennen wir nicht. Bitte prüfen Sie die Schreibweise.
            </p>
          ) : null}
          <p className="mx-auto mt-10 max-w-lg text-sm leading-relaxed text-muted">
            Sie haben keinen Code, möchten aber dabei sein? Frontline of Innovation ist ein Abend auf persönliche Einladung. Sie können uns aber gern{" "}
            <Link href="/#kontakt">schreiben</Link> oder sich um eine Wild Card bewerben.
          </p>
        </section>
      </PageShell>
    );
  }

  const e = inv.events;
  const c = inv.contacts;
  const name = [c.title, c.first_name, c.last_name].filter(Boolean).join(" ");
  const open = canAccept(e);
  const over = isOver(e);

  return (
    <PageShell>
      <PageHero image="/images/archiv/2026-05/16.webp" eyebrow={e.edition ? `${e.edition}. Edition` : "Einladung"} title={e.venue || e.name} outline={e.starts_at ? fmtEventDate(e.starts_at, false) : undefined} grayscale>
        {e.starts_at ? fmtEventDate(e.starts_at) : null}
        {e.address ? <span className="block">{e.address}</span> : null}
      </PageHero>
      <section className="mx-auto max-w-[860px] px-4 py-16 sm:px-6 md:py-24">
        <p className="text-xs uppercase tracking-[0.28em] text-dim">Einladung für</p>
        <h2 className="mt-2 font-display text-[clamp(30px,4vw,48px)] font-bold uppercase leading-none">{name}</h2>
        {c.company ? <p className="mt-2 text-muted">{c.company}</p> : null}

        {e.details ? <p className="mt-8 whitespace-pre-line leading-relaxed text-muted">{e.details}</p> : null}

        <div className="mt-10">
          {over ? (
            <p className="text-muted">Dieser Abend liegt bereits hinter uns. Vielen Dank für Ihr Interesse.</p>
          ) : inv.status === "zugesagt" || inv.status === "abgesagt" ? (
            <div className="card-dark p-6 md:p-8">
              <p className="font-display text-2xl font-semibold uppercase">{inv.status === "zugesagt" ? "Sie haben zugesagt" : "Sie haben abgesagt"}</p>
              <p className="mt-2 text-muted">Ihre Antwort können Sie jederzeit ändern.</p>
              <Link href={`/meine-teilnahme/${inv.manage_token}`} className="btn-gold mt-6">
                Teilnahme verwalten
              </Link>
            </div>
          ) : (
            <>
              {!open ? <p className="mb-6 text-gold-light">{e.closed_message}</p> : null}
              <RsvpForm code={inv.code} canAccept={open} current={{ status: inv.status, diet: inv.diet, allergies: inv.allergies, phone: inv.phone }} />
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
