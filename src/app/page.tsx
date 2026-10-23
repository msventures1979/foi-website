import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/inquiry-form";
import { PageShell } from "@/components/site";
import { editions, latestEdition } from "@/content/editions";
import { partnerTiers } from "@/content/partners";
import { CONTACT_MAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const principles = [
  {
    title: "Gäste zahlen nichts",
    text: "Kein Ticket, kein Beitrag, keine Gegenleistung. Den Abend tragen die Gastgeber und eine kleine Zahl von Partnern.",
  },
  {
    title: "Jeder Gast wird persönlich eingeladen",
    text: "Eine Anmeldung gibt es nicht. Eingeladen wird durch die Gastgeber oder auf Empfehlung eines Gastes.",
  },
  {
    title: "Nie zweimal dieselbe Runde",
    text: "Ein großer Teil der Gäste ist bei jedem Abend neu. So wachsen Netzwerke, statt sich zu schließen.",
  },
];

const format = [
  { label: "Impuls", text: "Ein Gast, der etwas zu sagen hat – aus Wirtschaft, Sport, Wissenschaft oder Politik." },
  { label: "Podium", text: "Ein Gespräch auf der Bühne, mit Haltung statt Präsentation." },
  { label: "Dinner", text: "Der eigentliche Kern: lange Tische, gemischte Runden, Zeit für Gespräche." },
];

const guests = [
  { label: "Gründer", text: "Menschen, die Unternehmen aufgebaut haben." },
  { label: "Führungskräfte", text: "Entscheider aus Unternehmen der Region und darüber hinaus." },
  { label: "Politik", text: "Verantwortliche aus Stadt und Land." },
  { label: "Wild Cards", text: "Fünf Plätze je Abend für Gründer junger Unternehmen – auf Bewerbung." },
];

const strip = ["06", "10", "15", "19", "02", "22"];

const hosts = [
  {
    name: "Matthias Storch",
    img: "/images/menschen/matthias-storch.jpg",
    text: "Gründer von claida und der Good Brands AG. Baut seit vielen Jahren Unternehmen auf, mit Erfahrung in Marketing und Vertrieb bis zum Exit.",
    linkedin: "https://www.linkedin.com/in/matthiasstorch/",
  },
  {
    name: "Süleyman Acar",
    img: "/images/menschen/sueleyman-acar.jpg",
    text: "Geschäftsführer der eCademy GmbH. Gründer mit Exit an Ströer, Investor und Business Angel mit Erfahrung in Vertrieb und Restrukturierung.",
    linkedin: "https://www.linkedin.com/in/sueleyman-acar/",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/foi-logo.png`,
    email: CONTACT_MAIL,
    sameAs: ["https://www.linkedin.com/company/frontline-of-innovation/", "https://www.youtube.com/@FOI-FrontlineOfInnovation"],
    founder: hosts.map((h) => ({ "@type": "Person", name: h.name })),
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <Image
          src="/images/archiv/2026-05/08.webp"
          alt="Gäste und Bühne beim Dinner in der Alten Schildkrötfabrik, Mai 2026"
          fill
          priority
          sizes="100vw"
          className="photo-dim -z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="mx-auto flex min-h-[78vh] max-w-[1240px] flex-col justify-end px-4 pb-16 pt-32 sm:px-6 md:min-h-[86vh] md:pb-24">
          <p className="eyebrow">Mannheim · auf persönliche Einladung</p>
          <h1 className="mt-5 max-w-5xl font-display text-[clamp(48px,9vw,128px)] font-bold uppercase leading-[0.92] tracking-[-0.01em]">
            Frontline of Innovation
          </h1>
          <p className="lead mt-7 max-w-2xl">
            Ein Abend, an dem Entscheider aus Wirtschaft, Sport, Wissenschaft und Politik an einem Tisch sitzen. Zweimal im Jahr, an wechselnden Orten in
            Mannheim.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="#format" className="btn-gold">
              Der Abend
            </Link>
            <Link href="/archiv" className="btn-ghost">
              Rückblick auf sieben Editionen
            </Link>
          </div>
        </div>
      </section>

      {/* Haltung */}
      <section aria-labelledby="haltung" className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28">
          <p className="eyebrow">Haltung</p>
          <h2 id="haltung" className="h-section mt-4 max-w-3xl">
            Kein Geschäftsmodell. Ein Abend aus Überzeugung.
          </h2>
          <ol className="mt-14 grid gap-px bg-line md:grid-cols-3">
            {principles.map((p, i) => (
              <li key={p.title} className="bg-black p-7 md:p-9">
                <span className="font-display text-sm text-gold">0{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold uppercase leading-tight">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
          <blockquote className="mt-16 max-w-4xl border-l-2 border-gold pl-6 md:pl-8">
            <p className="font-display text-[clamp(24px,3vw,38px)] font-normal leading-snug">
              „Am Ende zählt nicht die Zahl der Gäste, sondern die Zahl der Gespräche, die es ohne diesen Abend nie gegeben hätte.“
            </p>
            <footer className="mt-4 text-sm text-dim">Matthias Storch und Süleyman Acar, Gastgeber</footer>
          </blockquote>
        </div>
      </section>

      {/* Format */}
      <section id="format" aria-labelledby="format-h" className="border-b border-line">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.15fr] md:py-28">
          <div>
            <p className="eyebrow">Der Abend</p>
            <h2 id="format-h" className="h-section mt-4">
              Bis zu 150 Gäste. Ein Ort, den man so nicht kennt.
            </h2>
            <p className="lead mt-6">
              Ein Restaurant, eine Arena, eine Kirche, ein Fernmeldeturm, eine alte Fabrikhalle: Jeder Abend findet an einem anderen Ort
              statt. Der Ablauf bleibt bewusst schlicht.
            </p>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {format.map((f) => (
              <div key={f.label} className="grid gap-2 py-6 sm:grid-cols-[160px_1fr]">
                <dt className="font-display text-xl font-semibold uppercase text-gold">{f.label}</dt>
                <dd className="leading-relaxed text-muted">{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Gäste */}
      <section aria-labelledby="gaeste-h" className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28">
          <p className="eyebrow">Am Tisch</p>
          <h2 id="gaeste-h" className="h-section mt-4 max-w-3xl">
            Gemischte Runden statt geschlossener Kreise
          </h2>
          <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {guests.map((g) => (
              <li key={g.label} className="bg-black p-7">
                <h3 className="font-display text-xl font-semibold uppercase">{g.label}</h3>
                <p className="mt-2 leading-relaxed text-muted">{g.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-muted">
            Sie kennen jemanden, der an diesen Tisch gehört, oder möchten sich um eine Wild Card bewerben?{" "}
            <Link href="#kontakt">Schreiben Sie uns.</Link>
          </p>
        </div>
      </section>

      {/* Zuletzt */}
      <section aria-labelledby="zuletzt-h" className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">
                Zuletzt · {latestEdition.period}
              </p>
              <h2 id="zuletzt-h" className="h-section mt-4">
                {latestEdition.venue}
              </h2>
            </div>
            <Link href={`/archiv/${latestEdition.slug}`} className="btn-ghost">
              Programm und Bilder
            </Link>
          </div>
          <div className="mt-8 max-w-3xl space-y-4 leading-relaxed text-muted">
            {latestEdition.summary?.map((s) => <p key={s}>{s}</p>)}
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3">
            {strip.map((n, i) => (
              <li key={n} className={i === 0 ? "col-span-2 row-span-2 md:col-span-2" : ""}>
                <Image
                  src={`/images/archiv/2026-05/${n}${i === 0 ? "" : "-klein"}.webp`}
                  alt={`Frontline of Innovation, Mai 2026, Bild ${i + 1}`}
                  width={i === 0 ? 1600 : 640}
                  height={i === 0 ? 1067 : 427}
                  sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                  className="photo h-full w-full object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Editionen */}
      <section aria-labelledby="editionen-h" className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28">
          <p className="eyebrow">Sieben Editionen</p>
          <h2 id="editionen-h" className="h-section mt-4">
            Jedes Mal ein anderer Ort
          </h2>
          <ol className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-7">
            {editions.map((e) => {
              const inner = (
                <>
                  <Image src={e.cover} alt={e.venue} width={368} height={400} sizes="(min-width: 1024px) 170px, (min-width: 640px) 33vw, 50vw" className="photo aspect-[23/25] w-full object-cover" />
                  <span className="mt-3 block text-xs uppercase tracking-[0.16em] text-dim">
                    {e.number}. Edition{e.period ? ` · ${e.period}` : ""}
                  </span>
                  <span className="mt-1 block font-display text-lg font-semibold uppercase leading-tight text-white">{e.venue}</span>
                </>
              );
              return (
                <li key={e.slug}>
                  {e.photos ? (
                    <Link href={`/archiv/${e.slug}`} className="group block no-underline">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Gastgeber */}
      <section id="gastgeber" aria-labelledby="gastgeber-h" className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28">
          <p className="eyebrow">Gastgeber</p>
          <h2 id="gastgeber-h" className="h-section mt-4">
            Wer einlädt
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-2">
            {hosts.map((h) => (
              <li key={h.name} className="flex gap-6">
                <Image src={h.img} alt={h.name} width={320} height={320} className="photo h-28 w-28 shrink-0 object-cover sm:h-36 sm:w-36" />
                <div>
                  <h3 className="font-display text-2xl font-semibold uppercase">{h.name}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{h.text}</p>
                  <a href={h.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block py-1 text-sm">
                    LinkedIn
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partner */}
      <section aria-labelledby="partner-h" className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Partner der Edition {latestEdition.period}</p>
              <h2 id="partner-h" className="h-section mt-4">
                Wer den Abend möglich macht
              </h2>
            </div>
            <Link href="/sponsoring" className="btn-ghost">
              Partner werden
            </Link>
          </div>
          <div className="mt-12 space-y-12">
            {partnerTiers.map((t) => (
              <div key={t.tier}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-dim">{t.tier}</h3>
                <ul className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-8">
                  {t.partners.map((p) => {
                    // Gleiche optische Fläche statt gleicher Höhe – sonst wirken breite Logos riesig und Bildmarken winzig.
                    const area = t.tier === "Hauptpartner" ? 12000 : 4800;
                    const ratio = p.w / p.h;
                    const height = Math.round(Math.min(72, Math.max(22, Math.sqrt(area / ratio))));
                    return (
                      <li key={p.name}>
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="logo-partner block" title={p.name}>
                          <Image src={p.logo} alt={p.name} width={Math.round(height * ratio)} height={Math.round(height)} style={{ height, width: "auto" }} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" aria-labelledby="kontakt-h">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.4fr] md:py-28">
          <div>
            <p className="eyebrow">Kontakt</p>
            <h2 id="kontakt-h" className="h-section mt-4">
              Empfehlen, bewerben, fragen
            </h2>
            <p className="lead mt-6">
              Einen Platz kann man nicht buchen. Aber Sie können uns jemanden empfehlen, sich als Gründer eines jungen Unternehmens um eine Wild Card
              bewerben oder uns einfach schreiben.
            </p>
            <p className="mt-6 text-muted">
              Oder direkt per Mail: <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>
            </p>
          </div>
          <InquiryForm kind="kontakt" submitLabel="Nachricht senden" />
        </div>
      </section>
    </PageShell>
  );
}
