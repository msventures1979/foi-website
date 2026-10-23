import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/inquiry-form";
import { PageShell } from "@/components/site";
import { Slider } from "@/components/slider";
import { Icon, Marquee, SectionTitle } from "@/components/ui";
import { editions, latestEdition } from "@/content/editions";
import { partnerTiers } from "@/content/partners";
import { CONTACT_MAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const principles = [
  { icon: "einladung", title: "Gäste zahlen nichts", text: "Kein Ticket, kein Beitrag, keine Gegenleistung. Den Abend tragen die Gastgeber und eine kleine Zahl von Partnern." },
  { icon: "gaeste", title: "Persönlich eingeladen", text: "Eine Anmeldung gibt es nicht. Eingeladen wird durch die Gastgeber oder auf Empfehlung eines Gastes." },
  { icon: "branchen", title: "Nie dieselbe Runde", text: "Ein großer Teil der Gäste ist bei jedem Abend neu. So wachsen Netzwerke, statt sich zu schließen." },
] as const;

const highlights = [
  { icon: "dinner", label: "Kuratiertes", value: "Dinner", text: "Lange Tafeln, gemischte Runden und Zeit für Gespräche – der eigentliche Kern des Abends." },
  { icon: "ort", label: "Außergewöhnliche", value: "Orte", text: "Restaurant, Arena, Kirche, Fernmeldeturm, Fabrikhalle: jedes Mal ein anderer Ort in Mannheim." },
  { icon: "mikro", label: "Impuls &", value: "Podium", text: "Gäste, die etwas zu sagen haben – aus Wirtschaft, Sport, Wissenschaft und Politik." },
  { icon: "gaeste", label: "Bis zu 150", value: "Gäste", text: "Ein kuratierter Kreis aus Gründern, Führungskräften und Verantwortlichen aus der Politik." },
  { icon: "branchen", label: "Vielfältige", value: "Branchen", text: "Bewusst gemischt, damit Begegnungen entstehen, die es sonst nicht gäbe." },
  { icon: "einladung", label: "Nur auf", value: "Einladung", text: "Kein Ticketverkauf an Gäste. Wer kommt, wird persönlich eingeladen." },
] as const;

const guests = [
  { label: "Gründer", text: "Menschen, die Unternehmen aufgebaut haben.", img: "/images/start/gaeste-gruender.webp" },
  { label: "Führungskräfte", text: "Entscheider aus Unternehmen der Region und darüber hinaus.", img: "/images/start/gaeste-fuehrungskraefte.webp" },
  { label: "Politik", text: "Verantwortliche aus Stadt und Land.", img: "/images/start/gaeste-politiker.webp" },
  { label: "Wild Cards", text: "Fünf Plätze je Abend für Gründer junger Unternehmen.", img: "/images/start/gaeste-wild-cards.webp" },
];

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

const ortBilder = [
  { src: "/images/start/hero.webp", alt: "Die Alte Schildkrötfabrik in Mannheim von außen" },
  { src: "/images/start/ort-1.webp", alt: "Gelände der Alten Schildkrötfabrik" },
  { src: "/images/start/ort-2.webp", alt: "Halle der Alten Schildkrötfabrik mit hohen Fenstern" },
  { src: "/images/start/ort-3.webp", alt: "Lange Halle der Alten Schildkrötfabrik" },
  { src: "/images/start/ort-4.webp", alt: "Backsteinfassade der Alten Schildkrötfabrik" },
];

const impressions = ["05", "02", "04", "17", "18", "09", "08", "13", "15", "12", "20", "21"];

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
  const earlier = editions.slice(0, -1);

  return (
    <PageShell sponsorStrip>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src="/images/start/hero.webp" alt="Die Alte Schildkrötfabrik in Mannheim, Ort der siebten Edition" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/35 to-black/0" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="mx-auto flex min-h-[86vh] max-w-[1240px] flex-col justify-center px-4 pb-32 pt-20 sm:px-6 md:min-h-[92vh]">
          <h1 className="font-display text-[clamp(52px,9vw,124px)] font-bold leading-[0.95] tracking-[-0.005em]">
            Frontline of
            <br />
            Innovation
            <span className="outline-text block uppercase">Dinner</span>
          </h1>
          <p className="mt-6 font-display text-[clamp(18px,2.2vw,30px)] font-semibold">Mannheim · zweimal im Jahr · auf Einladung</p>
          <div className="mt-8">
            <Link href="#haltung" className="inline-flex min-h-12 items-center gap-3 bg-black px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline hover:bg-white hover:text-black">
              <Icon name="rechts" className="h-4 w-4" />
              Mehr erfahren
            </Link>
          </div>
        </div>
        <Link
          href="#haltung"
          className="absolute bottom-0 right-0 flex max-w-[460px] items-center gap-6 bg-black px-6 py-6 text-white no-underline sm:px-9 sm:py-8"
          aria-label="Weiter zum Abschnitt Haltung"
        >
          <span className="font-display text-base font-semibold uppercase leading-snug sm:text-lg">
            Ein Abend für Entscheider aus Wirtschaft, Sport, Wissenschaft und Politik
          </span>
          <Icon name="pfeil" className="h-8 w-8 shrink-0" />
        </Link>
      </section>

      {/* Editionen 1–6 */}
      <section aria-labelledby="editionen-h" className="mx-auto max-w-[1100px] px-4 pb-10 pt-24 sm:px-6 md:pt-28">
        <h2 id="editionen-h" className="sr-only">
          Die bisherigen Editionen
        </h2>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3">
          {earlier.map((e) => {
            const inner = (
              <>
                <span className="block text-xs uppercase tracking-[0.2em] text-dim">{e.number}. Edition{e.period ? ` · ${e.period}` : ""}</span>
                <span className="mt-2 block min-h-[2.2em] font-display text-[clamp(18px,2.2vw,28px)] font-semibold uppercase leading-[1.1] text-white">
                  {e.venue}
                  <span className="block">{e.city}</span>
                </span>
                <span className="mx-auto mt-4 block w-full max-w-[220px] overflow-hidden">
                  <Image src={e.cover} alt={`${e.venue}, ${e.city}`} width={368} height={400} sizes="220px" className="photo aspect-[23/25] w-full object-cover transition duration-500 group-hover:scale-105" />
                </span>
              </>
            );
            return (
              <li key={e.slug} className="text-center">
                {e.photos ? (
                  <Link href={`/archiv/${e.slug}`} className="group block no-underline">
                    {inner}
                  </Link>
                ) : (
                  <div className="group">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Siebte Edition */}
      <section aria-labelledby="zuletzt-h" className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-dim">{latestEdition.number}. Edition · zuletzt</p>
          <h2 id="zuletzt-h" className="mt-3 font-display text-[clamp(44px,7vw,92px)] font-bold uppercase leading-none">
            {latestEdition.period}
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.24em] text-muted">{latestEdition.venue}</p>
        </div>
        <div className="mt-12">
          <Slider
            images={ortBilder}
            caption={
              <>
                <p className="text-xs uppercase tracking-[0.24em] text-white/80">Ort</p>
                <p className="mt-1 font-display text-[clamp(22px,3vw,34px)] font-semibold uppercase leading-none">{latestEdition.venue}</p>
                <p className="mt-1 text-sm text-white/80">Floßwörthstraße 36–38, Mannheim</p>
              </>
            }
          />
        </div>

        {/* Speaker + Programm */}
        <div className="mt-16 grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative aspect-[4/5] self-start overflow-hidden bg-card md:sticky md:top-28">
            <Image
              src="/images/menschen/oliver-bierhoff.webp"
              alt="Oliver Bierhoff"
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover object-[58%_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-white/80">Im Gespräch</p>
              <p className="font-display text-[clamp(30px,4vw,46px)] font-semibold uppercase leading-none">Oliver Bierhoff</p>
            </div>
          </div>
          <div>
            <div className="space-y-4 leading-relaxed text-muted">{latestEdition.summary?.map((s) => <p key={s}>{s}</p>)}</div>
            <h3 className="mt-10 font-display text-2xl font-semibold uppercase">Programm</h3>
            <ol className="mt-4 divide-y divide-line border-y border-line">
              {latestEdition.program?.map((p, i) => (
                <li key={i} className="grid grid-cols-[68px_1fr] gap-4 py-3.5">
                  <span className="font-display text-lg font-semibold">{p.time}h</span>
                  <span>
                    <span className="font-semibold text-white">{p.title}</span>
                    {p.detail ? <span className="block text-sm text-muted">{p.detail}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
            <Link href={`/archiv/${latestEdition.slug}`} className="btn-ghost mt-8">
              Alle Bilder dieses Abends
            </Link>
          </div>
        </div>
      </section>

      {/* Haltung */}
      <section id="haltung" aria-labelledby="haltung-h" className="py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionTitle id="haltung-h" eyebrow="Wofür wir stehen" title="Kein Geschäftsmodell" ghost="Haltung" />
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {principles.map((p) => (
              <li key={p.title} className="card-dark p-8 text-center">
                <Icon name={p.icon} className="mx-auto h-9 w-9 text-dim" />
                <h3 className="mt-5 font-display text-2xl font-semibold uppercase">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
          <blockquote className="mx-auto mt-20 max-w-4xl text-center">
            <p className="font-display text-[clamp(26px,3.4vw,44px)] font-semibold uppercase leading-[1.15]">
              „Am Ende zählt nicht die Zahl der Gäste, sondern die Zahl der Gespräche, die es ohne diesen Abend nie gegeben hätte.“
            </p>
            <footer className="mt-5 text-sm uppercase tracking-[0.2em] text-dim">Matthias Storch &amp; Süleyman Acar</footer>
          </blockquote>
        </div>
      </section>

      {/* Der Abend */}
      <section id="format" aria-labelledby="format-h" className="border-t border-line py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionTitle id="format-h" eyebrow="Das Format" title="Was Sie an diesem Abend erwartet" ghost="Der Abend" />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h) => (
              <li key={h.value} className="card-dark group p-8 text-center transition-colors hover:border-[#444]">
                <Icon name={h.icon} className="mx-auto h-9 w-9 text-dim transition-colors group-hover:text-gold" />
                <p className="mt-5 text-[11px] uppercase tracking-[0.26em] text-dim">{h.label}</p>
                <h3 className="mt-1 font-display text-3xl font-semibold uppercase">{h.value}</h3>
                <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-muted">{h.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Marquee text="Auf persönliche Einladung · Mannheim" />

      {/* Gäste */}
      <section id="gaeste" aria-labelledby="gaeste-h" className="py-24 md:py-28">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <h2 id="gaeste-h" className="sr-only">
            Gäste
          </h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {guests.map((g) => (
              <li key={g.label} className="text-center">
                <div className="overflow-hidden">
                  <Image src={g.img} alt={g.label} width={368} height={400} sizes="(min-width: 768px) 260px, 50vw" className="photo aspect-[23/28] w-full object-cover transition duration-500 hover:scale-105" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.04em]">{g.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{g.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-24 text-right">
            <p aria-hidden className="ghost text-left md:text-center">
              Invite only
            </p>
            <p className="-mt-2 font-display text-[clamp(22px,3vw,36px)] font-semibold uppercase md:-mt-6">Einladungen &amp; Empfehlungen</p>
          </div>
          <div className="mt-10 grid items-start gap-8 md:grid-cols-[1fr_auto]">
            <p className="max-w-2xl leading-relaxed text-muted">
              Wir laden eine sorgfältig ausgewählte Runde von Persönlichkeiten ein. Unsere Gäste können weitere Personen empfehlen – so wächst der Kreis
              mit jedem Abend, ohne beliebig zu werden.
            </p>
            <Link href="#kontakt" className="flex h-20 w-20 items-center justify-center border border-line-strong text-white no-underline hover:border-white" aria-label="Zum Kontaktformular">
              <Icon name="pfeil" className="h-7 w-7" />
            </Link>
          </div>
          <Image
            src="/images/start/gaeste-einladungen-banner.webp"
            alt="Gäste im Gespräch"
            width={1960}
            height={478}
            sizes="(min-width: 1100px) 1052px, 100vw"
            className="photo mt-8 w-full object-cover"
          />
          <div className="mt-10 grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-xl font-semibold uppercase">Wild Card</h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted">
                Fünf Plätze je Abend vergeben wir an Gründer junger Unternehmen. Wer an diesen Tisch gehört, kann sich bei uns bewerben.
              </p>
            </div>
            <Link href="#kontakt" className="inline-flex min-h-12 items-center gap-3 border border-white px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline hover:bg-white hover:text-black">
              <Icon name="rechts" className="h-4 w-4" />
              Jetzt bewerben
            </Link>
          </div>
        </div>
      </section>

      {/* Gastgeber */}
      <section id="gastgeber" aria-labelledby="gastgeber-h" className="border-t border-line py-24 md:py-28">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
          <SectionTitle id="gastgeber-h" eyebrow="Gastgeber" title="Wer einlädt" />
          <ul className="mt-14 grid gap-14 sm:grid-cols-2">
            {hosts.map((h) => (
              <li key={h.name} className="text-center">
                <div className="mx-auto w-full max-w-[300px] overflow-hidden">
                  <Image src={h.img} alt={h.name} width={320} height={320} sizes="300px" className="photo aspect-square w-full object-cover transition duration-500 hover:[filter:none]" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold uppercase">{h.name}</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{h.text}</p>
                <a href={h.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-black no-underline hover:bg-gold" aria-label={`${h.name} auf LinkedIn`}>
                  in
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partner */}
      <section aria-labelledby="partner-h" className="border-t border-line py-24 md:py-28">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionTitle id="partner-h" eyebrow={`Partner der Edition ${latestEdition.period}`} title="Wer den Abend möglich macht" />
          <div className="mt-14 space-y-14">
            {partnerTiers.map((t) => {
              const main = t.tier === "Hauptpartner";
              return (
                <div key={t.tier}>
                  <h3 className="text-center text-[11px] uppercase tracking-[0.28em] text-dim">{t.tier}</h3>
                  <ul className={main ? "mt-6 grid gap-4 sm:grid-cols-2" : "mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-10"}>
                    {t.partners.map((p) => {
                      const ratio = p.w / p.h;
                      const height = Math.round(Math.min(main ? 110 : 64, Math.max(main ? 40 : 22, Math.sqrt((main ? 28000 : 5200) / ratio))));
                      const img = <Image src={p.logo} alt={p.name} width={Math.round(height * ratio)} height={height} style={{ height, width: "auto" }} />;
                      return (
                        <li key={p.name}>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={p.name}
                            className={main ? "card-dark logo-partner flex h-48 items-center justify-center px-8 md:h-56" : "logo-partner block"}
                          >
                            {img}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-16 border-t border-line pt-8 text-center">
            <Link href="/sponsoring" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted no-underline hover:text-white">
              Partner werden <Icon name="rechts" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Impressionen */}
      <section aria-labelledby="impressionen-h" className="border-t border-line py-24 md:py-28">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <SectionTitle id="impressionen-h" title="Impressionen" eyebrow={`${latestEdition.period} · ${latestEdition.venue}`} />
          <ul className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4">
            {impressions.map((n) => (
              <li key={n} className="overflow-hidden">
                <Image
                  src={`/images/archiv/2026-05/${n}-klein.webp`}
                  alt={`Frontline of Innovation, ${latestEdition.period}`}
                  width={640}
                  height={427}
                  sizes="(min-width: 768px) 300px, 50vw"
                  className="aspect-[3/2] w-full object-cover transition duration-500 hover:scale-105"
                />
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center">
            <Link href="/archiv" className="border-b border-dim pb-1 text-xs uppercase tracking-[0.24em] text-muted no-underline hover:text-white">
              Frühere Editionen im Archiv →
            </Link>
          </p>
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" aria-labelledby="kontakt-h" className="border-t border-line py-24 md:py-28">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <SectionTitle id="kontakt-h" title="Empfehlen, bewerben, fragen" ghost="Kontakt" />
          <p className="mx-auto mt-8 max-w-2xl text-center leading-relaxed text-muted">
            Einen Platz kann man nicht buchen. Aber Sie können uns jemanden empfehlen, sich als Gründer eines jungen Unternehmens um eine Wild Card
            bewerben oder uns einfach schreiben – gern auch direkt an <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>.
          </p>
          <div className="mt-12">
            <InquiryForm kind="kontakt" submitLabel="Nachricht senden" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
