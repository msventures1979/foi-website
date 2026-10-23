import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { PackageForm } from "./package-form";
import { PageIntro, PageShell } from "@/components/site";
import { SPONSOR_PACKAGES } from "@/lib/inquiry";
import { CONTACT_MAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner werden",
  description:
    "Frontline of Innovation arbeitet mit wenigen festen Partnern. Pakete, Leistungen und Kontakt für eine Partnerschaft bei den Abenden in Mannheim.",
  alternates: { canonical: "/sponsoring" },
};

const reasons = [
  {
    title: "Wenige Partner",
    text: "Wir arbeiten bewusst mit einer kleinen Zahl fester Partner. Ihre Marke steht nicht in einer langen Logoreihe, sondern wird wahrgenommen.",
  },
  {
    title: "Echte Begegnungen",
    text: "Bis zu 150 Entscheider aus Wirtschaft, Sport, Wissenschaft und Politik – an einem Abend, an einem Tisch, ohne Messestand.",
  },
  {
    title: "Langfristig gedacht",
    text: "Partnerschaften über mehrere Abende sind uns lieber als einmaliges Sponsoring. Inhalte gestalten Sie auf Wunsch mit.",
  },
];

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

export default function SponsoringPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Partner werden" title="Wenige Partner. Volle Aufmerksamkeit.">
        Frontline of Innovation ist kein kommerzielles Format: Gäste zahlen nichts. Getragen wird der Abend von den Gastgebern und einer kleinen Zahl von
        Partnern, die mit uns Begegnungen möglich machen wollen.
      </PageIntro>

      <section className="border-b border-line">
        <ul className="mx-auto grid max-w-[1240px] gap-px bg-line px-0 md:grid-cols-3">
          {reasons.map((r) => (
            <li key={r.title} className="bg-black px-4 py-12 sm:px-6 md:px-9">
              <h2 className="font-display text-2xl font-semibold uppercase">{r.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{r.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pakete-h" className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28">
          <p className="eyebrow">Pakete</p>
          <h2 id="pakete-h" className="h-section mt-4">
            Drei Wege, Partner zu werden
          </h2>
          <p className="mt-4 text-muted">Preise je Abend, zuzüglich Umsatzsteuer. Individuelle Anpassungen sind möglich.</p>
          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {packages.map((p) => (
              <li key={p.name} className={`flex flex-col border p-7 md:p-9 ${p.featured ? "border-gold" : "border-line-strong"} bg-card`}>
                <h3 className="font-display text-2xl font-semibold uppercase">{p.name}</h3>
                <p className="mt-4 font-display text-5xl font-semibold">
                  {p.price} <span className="text-2xl text-dim">€</span>
                </p>
                <ul className="mt-7 flex-1 space-y-3 text-[15px] text-muted">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-gold" />
                      {i}
                    </li>
                  ))}
                </ul>
                <a href={`?paket=${encodeURIComponent(p.name)}#anfrage`} className={`${p.featured ? "btn-gold" : "btn-ghost"} mt-9`}>
                  Anfragen
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="fragen-h" className="border-b border-line">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.4fr] md:py-28">
          <div>
            <p className="eyebrow">Fragen</p>
            <h2 id="fragen-h" className="h-section mt-4">
              Gut zu wissen
            </h2>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-center justify-between gap-6 text-lg text-white">
                  {f.q}
                  <span aria-hidden className="plus text-2xl text-gold transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SponsorInquiry />
    </PageShell>
  );
}

function SponsorInquiry() {
  return (
    <section id="anfrage" aria-labelledby="anfrage-h">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.4fr] md:py-28">
        <div>
          <p className="eyebrow">Anfrage</p>
          <h2 id="anfrage-h" className="h-section mt-4">
            Sprechen wir
          </h2>
          <p className="lead mt-6">Schreiben Sie uns, welches Paket Sie interessiert. Wir melden uns für ein persönliches Gespräch.</p>
          <div className="mt-10 flex gap-5">
            <Image src="/images/menschen/matthias-storch.jpg" alt="" width={320} height={320} className="photo h-16 w-16 object-cover" />
            <Image src="/images/menschen/sueleyman-acar.jpg" alt="" width={320} height={320} className="photo h-16 w-16 object-cover" />
          </div>
          <p className="mt-4 text-muted">
            Matthias Storch und Süleyman Acar
            <br />
            <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>
          </p>
        </div>
        <Suspense fallback={<InquiryForm kind="sponsoring" submitLabel="Anfrage senden" />}>
          <PackageForm />
        </Suspense>
      </div>
    </section>
  );
}
