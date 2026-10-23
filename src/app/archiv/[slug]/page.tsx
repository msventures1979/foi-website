import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { PageShell } from "@/components/site";
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

      <section className="relative isolate overflow-hidden border-b border-line">
        <Image src={e.photos[0].src} alt="" fill priority sizes="100vw" className="photo-dim -z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="mx-auto flex min-h-[52vh] max-w-[1240px] flex-col justify-end px-4 pb-14 pt-24 sm:px-6">
          <p className="eyebrow">
            <Link href="/archiv" className="text-gold no-underline">
              Archiv
            </Link>{" "}
            · {e.number}. Edition{e.period ? ` · ${e.period}` : ""}
          </p>
          <h1 className="h-section mt-4 !text-[clamp(44px,7vw,96px)]">{e.venue}</h1>
          <p className="lead mt-3">{e.city}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr] md:py-20">
        <div className="space-y-4 text-[17px] leading-relaxed text-muted">{e.summary?.map((s) => <p key={s}>{s}</p>)}</div>
        {e.program ? (
          <div>
            <h2 className="eyebrow">Programm</h2>
            <ol className="mt-5 divide-y divide-line border-y border-line">
              {e.program.map((p, i) => (
                <li key={i} className="grid grid-cols-[64px_1fr] gap-4 py-3.5">
                  <span className="font-display text-gold">{p.time}</span>
                  <span>
                    <span className="text-white">{p.title}</span>
                    {p.detail ? <span className="block text-sm text-muted">{p.detail}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </section>

      <section aria-label="Bilder" className="mx-auto max-w-[1240px] px-4 pb-20 sm:px-6">
        <Gallery photos={e.photos} credit={e.photoCredit} />
      </section>

      <nav aria-label="Weitere Editionen" className="border-t border-line">
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 px-4 py-10 sm:px-6">
          {prev ? (
            <Link href={`/archiv/${prev.slug}`} className="no-underline">
              ← {prev.number}. Edition: {prev.venue}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/archiv/${next.slug}`} className="no-underline">
              {next.number}. Edition: {next.venue} →
            </Link>
          ) : (
            <Link href="/archiv" className="no-underline">
              Zum Archiv →
            </Link>
          )}
        </div>
      </nav>
    </PageShell>
  );
}
