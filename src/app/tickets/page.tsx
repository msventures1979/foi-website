import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { PageIntro, PageShell } from "@/components/site";
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
  "Ein Platz beim Dinner für jeden Ihrer Gäste, mit Impuls, Podium und Menü",
  "Eine persönliche Einladung, die Sie an Ihre Gäste weitergeben",
  "Tischplatzierung mit Blick darauf, wer zu wem passt",
];

export default function TicketsPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Für Partner" title="Laden Sie Ihre wichtigsten Kunden ein">
        Unsere Gäste zahlen nichts – sie werden persönlich eingeladen. Ausgewählten Partnern bieten wir zusätzlich an, für bis zu {MAX_TICKETS} ihrer
        Kunden einen Platz zu erwerben. Ein Abend, der in Erinnerung bleibt, als Zeichen Ihrer Wertschätzung.
      </PageIntro>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="eyebrow">Enthalten</h2>
            <ul className="mt-6 space-y-4 text-muted">
              {included.map((i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-[11px] h-px w-3 shrink-0 bg-gold" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line-strong bg-card p-7 md:p-9">
            <p className="text-sm uppercase tracking-[0.16em] text-dim">Je Platz</p>
            <p className="mt-2 font-display text-5xl font-semibold">
              1.500 <span className="text-2xl text-dim">€</span>
            </p>
            <p className="mt-2 text-sm text-muted">zuzüglich Umsatzsteuer, höchstens {MAX_TICKETS} Plätze je Unternehmen</p>
            <p className="mt-6 leading-relaxed text-muted">
              Damit der Abend bleibt, was er ist, achten wir auf die Zusammensetzung: Bitte nennen Sie uns, wen Sie mitbringen möchten. Wir bestätigen
              jede Anfrage persönlich und senden Ihnen danach die Rechnung.
            </p>
          </div>
        </div>
      </section>

      <section id="anfrage" aria-labelledby="anfrage-h">
        <div className="mx-auto max-w-[860px] px-4 py-16 sm:px-6 md:py-20">
          <h2 id="anfrage-h" className="h-section">
            Plätze anfragen
          </h2>
          <div className="mt-10">
            <InquiryForm kind="tickets" submitLabel="Anfrage senden" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
