import Image from "next/image";
import { partnerTiers } from "@/content/partners";

/** Überschrift im Stil der bisherigen Seite: kleine Zeile, große Zeile, optional riesiges Geisterwort, kurzer Strich. */
export function SectionTitle({
  eyebrow,
  title,
  ghost,
  align = "center",
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  ghost?: string;
  align?: "center" | "left";
  id?: string;
}) {
  const center = align === "center";
  return (
    <div className={`relative ${center ? "text-center" : ""}`}>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.28em] text-dim">{eyebrow}</p> : null}
      <h2 id={id} className={`mt-3 font-display text-[clamp(30px,4vw,52px)] font-semibold uppercase leading-[1.05] tracking-[0.02em]`}>
        {title}
      </h2>
      {ghost ? (
        <p aria-hidden className="ghost mt-1 select-none">
          {ghost}
        </p>
      ) : null}
      <span aria-hidden className={`mt-6 block h-[2px] w-12 bg-white ${center ? "mx-auto" : ""}`} />
    </div>
  );
}

/** Weiße Logoleiste ganz oben – Partner der letzten Edition. */
export function SponsorStrip() {
  const all = partnerTiers.flatMap((t) => t.partners.map((p) => ({ ...p, main: t.tier === "Hauptpartner" })));
  const logos = (hidden: boolean) =>
    all.map((p) => {
      const ratio = p.w / p.h;
      const h = Math.round(Math.min(p.main ? 34 : 22, Math.max(11, Math.sqrt((p.main ? 2200 : 1000) / ratio))));
      return (
        <a
          key={p.name}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          title={p.name}
          tabIndex={hidden ? -1 : undefined}
          aria-hidden={hidden || undefined}
          className={`shrink-0 opacity-80 hover:opacity-100 ${hidden ? "lg:hidden" : ""}`}
        >
          <Image src={p.logo} alt={hidden ? "" : p.name} width={Math.round(h * ratio)} height={h} style={{ height: h, width: "auto" }} className="invert" />
        </a>
      );
    });
  // Auf kleinen Bildschirmen läuft die Leiste durch (Logos doppelt), ab Desktop steht sie zentriert.
  return (
    <div className="overflow-hidden bg-white">
      <div className="marquee-logos flex w-max items-center gap-x-8 px-4 py-2.5 lg:mx-auto lg:w-auto lg:max-w-[1240px] lg:justify-center lg:px-6">
        {logos(false)}
        {logos(true)}
      </div>
    </div>
  );
}

/** Laufband wie auf der bisherigen Seite. */
export function Marquee({ text }: { text: string }) {
  const items = Array.from({ length: 14 }, () => text);
  return (
    <div className="overflow-hidden border-y border-white bg-white py-2.5 text-black" aria-label={text}>
      <div aria-hidden className="marquee flex w-max gap-6 font-display text-sm font-semibold uppercase tracking-[0.18em]">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-6">
            {t}
            <span>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Schlichte Linien-Icons (24px Raster, Stil wie lucide). */
const paths: Record<string, React.ReactNode> = {
  dinner: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </>
  ),
  ort: (
    <>
      <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  mikro: (
    <>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
    </>
  ),
  gaeste: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  branchen: (
    <>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </>
  ),
  einladung: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  pfeil: <path d="M12 5v14M19 12l-7 7-7-7" />,
  rechts: <path d="M5 12h14M12 5l7 7-7 7" />,
};

export function Icon({ name, className = "h-8 w-8" }: { name: keyof typeof paths; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths[name]}
    </svg>
  );
}

/** Großer Bildkopf für Unterseiten, im Stil der Startseite. */
export function PageHero({
  image,
  imageAlt = "",
  eyebrow,
  title,
  outline,
  children,
  grayscale = false,
  position = "center",
}: {
  image: string;
  imageAlt?: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  outline?: string;
  children?: React.ReactNode;
  grayscale?: boolean;
  position?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={`-z-10 object-cover ${grayscale ? "photo-dim" : ""}`} style={{ objectPosition: position }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/10 to-transparent" />
      <div className="mx-auto flex min-h-[62vh] max-w-[1240px] flex-col justify-end px-4 pb-14 pt-24 sm:px-6 md:min-h-[70vh] md:pb-20">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(44px,7.5vw,104px)] font-bold uppercase leading-[0.95]">
          {title}
          {outline ? <span className="outline-text block">{outline}</span> : null}
        </h1>
        {children ? <div className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/85 md:text-lg">{children}</div> : null}
      </div>
    </section>
  );
}

/** Kennzahlen-Leiste */
export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <ul className="grid grid-cols-2 border-y border-line md:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.label} className={`px-4 py-8 text-center ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} md:border-l md:first:border-l-0`}>
          <p className="font-display text-[clamp(34px,4.5vw,56px)] font-bold leading-none">{s.value}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-dim">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}
