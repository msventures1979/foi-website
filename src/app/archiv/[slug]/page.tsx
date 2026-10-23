import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { PageShell } from "@/components/site";
import { PageHero, SectionTitle } from "@/components/ui";
import { editionBySlug, editions } from "@/content/editions";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return editions.filter((e) => e.photos).map((e) => ({ slug: e.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = editionBySlug((await params).slug);
  if (!e) return {};
  const title = `${e.number}. Edition: ${e.venue}${e.period ? `, ${e.period}` : ""}`;
  return {
    title,
    description: e.summary?.[0],
    alternates: { canonical: `/archiv/${e.slug}` },
    openGraph: { title, images: e.photos?.[0] ? [{ url: e.photos[0].src }] : undefined },
  };
}

export default async function EditionPage({ params }: Props) {
  const e = editionBySlug((await params).slug);
  if (!e || !e.photos) notFound();

  const idx = editions.indexOf(e);
  const prev = editions.slice(0, idx).reverse().find((x) => x.photos);
  const next = editions.slice(idx + 1).find((x) => x.photos);

  const jsonLd = e.date
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: `Frontline of Innovation – ${e.number}. Edition`,
        startDate: e.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", addressLocality: e.city, addressCountry: "DE" } },
        image: e.photos.slice(0, 3).map((p) => `${SITE_URL}${p.src}`),
        organizer: { "@type": "Organization", name: "Frontline of Innovation", url: SITE_URL },
      }
    : null;

  return (
    <PageShell>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}

      <PageHero
        image={e.photos[0].src}
        imageAlt={e.photos[0].alt}
        eyebrow={
          <>
            <Link href="/archiv" className="text-gold no-underline hover:text-gold-light">
              Archiv
            </Link>{" "}
            · {e.number}. Edition · {e.city}
          </>
        }
        title={e.venue}
        outline={e.period}
      />

      <section className="mx-auto grid max-w-[1100px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-dim">Rückblick</p>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-muted md:text-lg">{e.summary?.map((s) => <p key={s}>{s}</p>)}</div>
        </div>
        {e.program ? (
          <div>
            <h2 className="font-display text-2xl font-semibold uppercase">Programm</h2>
            <ol className="mt-4 divide-y divide-line border-y border-line">
              {e.program.map((p, i) => (
                <li key={i} className="grid grid-cols-[68px_1fr] gap-4 py-3.5">
                  <span className="font-display text-lg font-semibold">{p.time}h</span>
                  <span>
                    <span className="font-semibold text-white">{p.title}</span>
                    {p.detail ? <span className="block text-sm text-muted">{p.detail}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </section>

      <section aria-labelledby="bilder-h" className="border-t border-line py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <SectionTitle id="bilder-h" eyebrow={`${e.photos.length} Bilder · zum Vergrößern anklicken`} title="Impressionen" />
          <div className="mt-10 md:mt-14">
            <Gallery color photos={e.photos} credit={e.photoCredit} />
          </div>
        </div>
      </section>

      <nav aria-label="Weitere Editionen" className="border-t border-line">
        <div className="mx-auto grid max-w-[1240px] gap-1 sm:grid-cols-2">
          {[prev, next].map((x, i) =>
            x ? (
              <Link key={x.slug} href={`/archiv/${x.slug}`} className="group relative block h-44 overflow-hidden no-underline md:h-56">
                <Image src={x.photos![0].thumb} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="photo-dim object-cover transition duration-700 group-hover:scale-105" />
                <span className={`absolute inset-0 flex flex-col justify-center px-6 md:px-10 ${i === 1 ? "items-end text-right" : ""}`}>
                  <span className="text-[11px] uppercase tracking-[0.24em] text-white/70">
                    {i === 0 ? "← Vorherige" : "Nächste →"} · {x.number}. Edition
                  </span>
                  <span className="mt-2 font-display text-[clamp(26px,3vw,40px)] font-bold uppercase leading-none text-white">{x.venue}</span>
                </span>
              </Link>
            ) : (
              <Link key={i} href="/archiv" className="flex h-44 items-center justify-center border border-line text-xs uppercase tracking-[0.24em] text-muted no-underline hover:text-white md:h-56">
                Alle Editionen im Archiv →
              </Link>
            ),
          )}
        </div>
      </nav>
    </PageShell>
  );
}
