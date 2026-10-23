import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { PageShell } from "@/components/site";
import { Icon, PageHero, SectionTitle, Stats } from "@/components/ui";
import { partnerTiers } from "@/content/partners";
import { SPONSOR_PACKAGES } from "@/lib/inquiry";
import { CONTACT_MAIL } from "@/lib/site";
import { PackageForm } from "./package-form";

export const metadata: Metadata = {
  title: "Partner werden",
  description:
    "Frontline of Innovation arbeitet mit wenigen festen Partnern. Pakete, Leistungen und Kontakt für eine Partnerschaft bei den Abenden in Mannheim.",
  alternates: { canonical: "/sponsoring" },
};

const reasons = [
  {
    icon: "gaeste",
    title: "Wenige Partner",
    text: "Wir arbeiten bewusst mit einer kleinen Zahl fester Partner. Ihre Marke steht nicht in einer langen Logoreihe, sondern wird wahrgenommen.",
  },
  {
    icon: "dinner",
    title: "Echte Begegnungen",
    text: "Bis zu 150 Entscheider aus Wirtschaft, Sport, Wissenschaft und Politik – an einem Abend, an einem Tisch, ohne Messestand.",
  },
  {
    icon: "branchen",
    title: "Langfristig gedacht",
    text: "Partnerschaften über mehrere Abende sind uns lieber als einmaliges Sponsoring. Inhalte gestalten Sie auf Wunsch mit.",
  },
] as const;

const packages: { name: (typeof SPONSOR_PACKAGES)[number]; price: string; items: string[]; featured?: boolean }[] = [
  {
    name: "Hauptpartner",
    price: "15.000",
    items: [
      "Herausgehobene Platzierung Ihres Logos",
      "Markenauftritt vor Ort",
      "Begrüßung auf der Bühne (2–3 Minuten)",
      "Präsenz in unseren Beiträgen auf LinkedIn und im Film zum Abend",
      "Produktpräsentation vor Ort",
      "5 Plätze für Gäste Ihres Hauses",
    ],
  },
  {
    name: "Premiumpartner",
    price: "10.000",
    featured: true,
    items: [
      "Platzierung Ihres Logos",
      "Markenauftritt vor Ort",
      "Präsenz in unseren Beiträgen auf LinkedIn und im Film zum Abend",
      "Produktpräsentation vor Ort",
      "3 Plätze für Gäste Ihres Hauses",
      "Vorrang bei der Tischplatzierung",
    ],
  },
  {
    name: "Förderpartner",
    price: "5.000",
    items: [
      "Platzierung Ihres Logos",
      "Markenauftritt vor Ort",
      "Präsenz in unseren Beiträgen auf LinkedIn und im Film zum Abend",
      "2 Plätze für Gäste Ihres Hauses",
      "Vorrang bei der Tischplatzierung",
    ],
  },
];

const faqs = [
  {
    q: "Wie viele Partner gibt es je Abend?",
    a: "Bewusst wenige. Die genaue Zahl hängt vom Ort und vom Programm ab – wir sagen Ihnen im Gespräch offen, wer sonst dabei ist.",
  },
  {
    q: "Kann ich ein Paket anpassen?",
    a: "Ja. Die Pakete sind ein Ausgangspunkt. Wir stimmen die Partnerschaft gern auf Ihre Ziele ab.",
  },
  {
    q: "Wie lange läuft eine Partnerschaft?",
    a: "Die Preise gelten je Abend. Partnerschaften über mehrere Abende vereinbaren wir individuell.",
  },
  {
    q: "Wie geht es nach meiner Anfrage weiter?",
    a: "Wir melden uns in den nächsten Tagen für ein persönliches Gespräch. Danach erhalten Sie einen Vertrag, den Sie online bestätigen.",
  },
];

const strip = ["12", "13", "14", "16"];

export default function SponsoringPage() {
  const logos = partnerTiers.flatMap((t) => t.partners);
  return (
    <PageShell>
      <PageHero
        image="/images/archiv/2026-05/12.webp"
        imageAlt="Bühne mit Partnerwand beim Dinner im Mai 2026"
        eyebrow="Partner werden"
        title="Wenige Partner."
        outline="Volle Aufmerksamkeit."
        position="60% 30%"
      >
        Frontline of Innovation ist kein kommerzielles Format: Gäste zahlen nichts. Getragen wird der Abend von den Gastgebern und einer kleinen Zahl von
        Partnern, die Begegnungen möglich machen wollen.
      </PageHero>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <Stats
          items={[
            { value: "150", label: "Gäste je Abend" },
            { value: "7", label: "Editionen" },
            { value: "2×", label: "im Jahr" },
            { value: "0 €", label: "für Gäste" },
          ]}
        />
      </div>

      {/* Warum */}
      <section aria-labelledby="warum-h" className="py-16 md:py-28">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionTitle id="warum-h" eyebrow="Warum Partner werden" title="Mehr als ein Logo" ghost="Partner" />
          <ul className="mt-10 grid gap-3 md:mt-14 md:grid-cols-3 md:gap-4">
            {reasons.map((r) => (
              <li key={r.title} className="card-dark flex gap-5 p-6 md:block md:p-8 md:text-center">
                <Icon name={r.icon} className="h-8 w-8 shrink-0 text-dim md:mx-auto md:h-9 md:w-9" />
                <div>
                  <h3 className="font-display text-xl font-semibold uppercase md:mt-5 md:text-2xl">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:mt-3">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bildleiste */}
      <ul className="grid grid-cols-2 gap-1 md:grid-cols-4">
        {strip.map((n) => (
          <li key={n} className="overflow-hidden">
            <Image src={`/images/archiv/2026-05/${n}-klein.webp`} alt="" width={640} height={427} sizes="(min-width: 768px) 25vw, 50vw" className="photo aspect-[3/2] w-full object-cover transition duration-700 hover:scale-105 hover:[filter:none]" />
          </li>
        ))}
      </ul>

      {/* Pakete */}
      <section id="pakete" aria-labelledby="pakete-h" className="py-16 md:py-28">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionTitle id="pakete-h" eyebrow="Pakete" title="Drei Wege, Partner zu werden" ghost="Pakete" />
          <p className="mt-6 text-center text-sm text-muted">Preise je Abend, zuzüglich Umsatzsteuer. Individuelle Anpassungen sind möglich.</p>
          <ul className="mt-10 grid gap-4 md:mt-14 lg:grid-cols-3">
            {packages.map((p) => (
              <li key={p.name} className={`relative flex flex-col p-7 md:p-9 ${p.featured ? "border border-gold bg-[#141414]" : "card-dark"}`}>
                {p.featured ? (
                  <span className="absolute -top-3 left-7 bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black md:left-9">Empfohlen</span>
                ) : null}
                <h3 className="font-display text-2xl font-semibold uppercase">{p.name}</h3>
                <p className="mt-4 font-display text-[56px] font-bold leading-none">
                  {p.price} <span className="text-2xl text-dim">€</span>
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-dim">je Abend, netto</p>
                <ul className="mt-7 flex-1 space-y-3 text-[15px] text-muted">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-gold" />
                      {i}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`?paket=${encodeURIComponent(p.name)}#anfrage`}
                  scroll={false}
                  className={`mt-9 inline-flex min-h-12 items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] no-underline ${p.featured ? "bg-gold text-black hover:bg-gold-light hover:text-black" : "border border-white text-white hover:bg-white hover:text-black"}`}
                >
                  <Icon name="rechts" className="h-4 w-4" />
                  Anfragen
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Zuletzt dabei */}
      <section aria-labelledby="dabei-h" className="border-y border-line bg-[#070707] py-14 md:py-20">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <h2 id="dabei-h" className="text-center text-[11px] uppercase tracking-[0.28em] text-dim">
            Zuletzt dabei
          </h2>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
            {logos.map((p) => {
              const ratio = p.w / p.h;
              const height = Math.round(Math.min(56, Math.max(20, Math.sqrt(3600 / ratio))));
              return (
                <li key={p.name}>
                  <Image src={p.logo} alt={p.name} width={Math.round(height * ratio)} height={height} style={{ height, width: "auto" }} className="logo-partner" />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Fragen */}
      <section aria-labelledby="fragen-h" className="py-16 md:py-28">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <SectionTitle id="fragen-h" eyebrow="Fragen" title="Gut zu wissen" />
          <div className="mt-10 divide-y divide-line border-y border-line md:mt-14">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-center justify-between gap-6 font-display text-lg font-semibold uppercase tracking-[0.02em] text-white md:text-xl">
                  {f.q}
                  <span aria-hidden className="plus text-3xl font-normal text-gold transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Anfrage */}
      <section id="anfrage" aria-labelledby="anfrage-h" className="border-t border-line py-16 md:py-28">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <SectionTitle id="anfrage-h" eyebrow="Anfrage" title="Sprechen wir" ghost="Kontakt" />
          <p className="mx-auto mt-8 max-w-2xl text-center leading-relaxed text-muted">
            Schreiben Sie uns, welches Paket Sie interessiert. Matthias Storch und Süleyman Acar melden sich für ein persönliches Gespräch – oder direkt an{" "}
            <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>.
          </p>
          <div className="mt-12">
            <Suspense fallback={<InquiryForm kind="sponsoring" submitLabel="Anfrage senden" />}>
              <PackageForm />
            </Suspense>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
