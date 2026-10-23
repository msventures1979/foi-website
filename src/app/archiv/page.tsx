import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/site";
import { PageHero, SectionTitle } from "@/components/ui";
import { editions, specials } from "@/content/editions";

export const metadata: Metadata = {
  title: "Archiv",
  description: "Alle bisherigen Abende von Frontline of Innovation – Orte, Programm und Bilder.",
  alternates: { canonical: "/archiv" },
};

export default function ArchivPage() {
  const withPhotos = editions.filter((e) => e.photos).reverse();
  const earlier = editions.filter((e) => !e.photos);

  return (
    <PageShell>
      <PageHero image="/images/archiv/2025-11/05.webp" imageAlt="Abend auf dem Fernmeldeturm Mannheim, November 2025" eyebrow="Archiv" title="Sieben Abende." outline="Sieben Orte.">
        Seit der ersten Edition im OBEN Restaurant findet jeder Abend an einem anderen Ort in Mannheim statt. Hier finden Sie Programm und Bilder der
        bisherigen Editionen.
      </PageHero>

      {/* Editionen mit Bildern */}
      <section aria-labelledby="galerien-h" className="py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <SectionTitle id="galerien-h" eyebrow="Mit Programm und Bildern" title="Die letzten Editionen" />
          <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2">
            {withPhotos.map((e, i) => (
              <li key={e.slug} className={i === 0 ? "md:col-span-2" : ""}>
                <Link href={`/archiv/${e.slug}`} className={`group relative block overflow-hidden no-underline ${i === 0 ? "aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/5] sm:aspect-[3/2]"}`}>
                  <Image
                    src={e.photos![0].src}
                    alt={e.photos![0].alt}
                    fill
                    sizes={i === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-6 md:p-9">
                    <span className="block text-[11px] uppercase tracking-[0.26em] text-gold">
                      {e.number}. Edition · {e.period}
                    </span>
                    <span className={`mt-2 block font-display font-bold uppercase leading-[0.95] text-white ${i === 0 ? "text-[clamp(38px,6vw,84px)]" : "text-[clamp(30px,3.4vw,44px)]"}`}>
                      {e.venue}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/80 group-hover:text-white">
                      {e.photos!.length} Bilder{e.program ? " · Programm" : ""} →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Frühere Editionen */}
      <section aria-labelledby="frueher-h" className="border-t border-line py-16 md:py-24">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionTitle id="frueher-h" eyebrow="Die Anfänge" title="Editionen 1 bis 4" ghost="Archiv" />
          <ol className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-6">
            {earlier.map((e) => (
              <li key={e.slug} className="text-center">
                <span className="block text-xs uppercase tracking-[0.2em] text-dim">{e.number}. Edition</span>
                <span className="mt-2 block font-display text-[clamp(18px,2vw,24px)] font-semibold uppercase leading-[1.1]">{e.venue}</span>
                <Image src={e.cover} alt={`${e.venue}, ${e.city}`} width={368} height={400} sizes="(min-width: 768px) 240px, 50vw" className="photo mt-4 aspect-[23/25] w-full object-cover" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Weitere Formate */}
      <section aria-labelledby="formate-h" className="border-t border-line py-16 md:py-24">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionTitle id="formate-h" eyebrow="Mit Partnern" title="Weitere Formate" />
          <ul className="mt-10 md:mt-14">
            {specials.map((s) => (
              <li key={s.slug}>
                <Link href={`/archiv/${s.slug}`} className="group relative block aspect-[4/5] overflow-hidden no-underline sm:aspect-[21/9]">
                  <Image src={s.cover} alt="" fill sizes="(min-width: 1100px) 1052px, 100vw" className="photo-dim object-cover transition duration-700 group-hover:scale-[1.03]" />
                  <span className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                  <span className="absolute inset-y-0 left-0 flex flex-col justify-end p-6 md:justify-center md:p-12">
                    <span className="text-[11px] uppercase tracking-[0.26em] text-gold">{s.period} · {s.venue}</span>
                    <span className="mt-2 font-display text-[clamp(34px,5vw,64px)] font-bold uppercase leading-none text-white">{s.title}</span>
                    <span className="mt-3 text-xs uppercase tracking-[0.2em] text-white/80 group-hover:text-white">Rückblick →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
