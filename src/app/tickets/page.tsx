import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { PageShell } from "@/components/site";
import { Icon, PageHero, SectionTitle } from "@/components/ui";
import { MAX_TICKETS } from "@/lib/inquiry";

/**
 * Nicht öffentlich verlinkt: Diese Seite wird gezielt an Partner (z. B. Banken) geschickt,
 * die für ein bis zwei ihrer Kunden einen Platz erwerben dürfen. Kein Eintrag in der Sitemap, noindex.
 */
export const metadata: Metadata = {
  title: "Plätze für Ihre Kunden",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
};

const included = [
  { icon: "dinner", title: "Ein Platz am Tisch", text: "Für jeden Ihrer Gäste: Impuls, Podium und Menü – der ganze Abend." },
  { icon: "einladung", title: "Persönliche Einladung", text: "Eine Einladung, die Sie an Ihre Gäste weitergeben – als Zeichen Ihrer Wertschätzung." },
  { icon: "gaeste", title: "Durchdachte Tischplatzierung", text: "Wir setzen Ihre Gäste dorthin, wo die Gespräche für sie passen." },
] as const;

export default function TicketsPage() {
  return (
    <PageShell>
      <PageHero image="/images/archiv/2026-05/06.webp" imageAlt="Gedeckte Tafeln in der Alten Schildkrötfabrik" eyebrow="Für Partner" title="Laden Sie Ihre" outline="besten Kunden ein">
        Unsere Gäste zahlen nichts – sie werden persönlich eingeladen. Ausgewählten Partnern bieten wir zusätzlich an, für bis zu {MAX_TICKETS} ihrer Kunden
        einen Platz zu erwerben. Ein Abend, der in Erinnerung bleibt.
      </PageHero>

      <section aria-labelledby="enthalten-h" className="py-16 md:py-28">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionTitle id="enthalten-h" eyebrow="Enthalten" title="Was Ihre Gäste erwartet" />
          <ul className="mt-10 grid gap-3 md:mt-14 md:grid-cols-3 md:gap-4">
            {included.map((i) => (
              <li key={i.title} className="card-dark flex gap-5 p-6 md:block md:p-8 md:text-center">
                <Icon name={i.icon} className="h-8 w-8 shrink-0 text-dim md:mx-auto md:h-9 md:w-9" />
                <div>
                  <h3 className="font-display text-xl font-semibold uppercase md:mt-5 md:text-2xl">{i.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:mt-3">{i.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-12 grid max-w-[860px] items-center gap-8 border border-gold bg-[#141414] p-7 md:mt-16 md:grid-cols-[auto_1fr] md:gap-12 md:p-10">
            <div className="text-center md:text-left">
              <p className="text-[11px] uppercase tracking-[0.24em] text-dim">Je Platz</p>
              <p className="mt-1 font-display text-[64px] font-bold leading-none">
                1.500 <span className="text-2xl text-dim">€</span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-dim">netto · max. {MAX_TICKETS} je Unternehmen</p>
            </div>
            <p className="leading-relaxed text-muted">
              Damit der Abend bleibt, was er ist, achten wir auf die Zusammensetzung der Runde. Bitte nennen Sie uns, wen Sie mitbringen möchten. Wir
              bestätigen jede Anfrage persönlich und senden Ihnen danach die Rechnung.
            </p>
          </div>
        </div>
      </section>

      <section id="anfrage" aria-labelledby="anfrage-h" className="border-t border-line py-16 md:py-28">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <SectionTitle id="anfrage-h" eyebrow="Anfrage" title="Plätze anfragen" ghost="Tickets" />
          <div className="mt-12">
            <InquiryForm kind="tickets" submitLabel="Anfrage senden" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
