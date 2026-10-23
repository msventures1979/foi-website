import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro, PageShell } from "@/components/site";
import { editions, specials } from "@/content/editions";

export const metadata: Metadata = {
  title: "Archiv",
  description: "Alle bisherigen Abende von Frontline of Innovation – Orte, Programm und Bilder.",
  alternates: { canonical: "/archiv" },
};

export default function ArchivPage() {
  const list = [...editions].reverse();
  return (
    <PageShell>
      <PageIntro eyebrow="Archiv" title="Sieben Editionen, sieben Orte">
        Seit der ersten Edition im OBEN Restaurant findet jeder Abend an einem anderen Ort in Mannheim statt. Hier finden Sie Programm und Bilder der
        bisherigen Abende.
      </PageIntro>

      <section className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 md:py-20">
        <ol className="divide-y divide-line border-y border-line">
          {list.map((e) => {
            const body = (
              <div className="grid items-center gap-5 py-6 sm:grid-cols-[120px_1fr_auto] sm:gap-8">
                <Image src={e.cover} alt="" width={368} height={400} sizes="120px" className="photo hidden aspect-[23/25] w-[120px] object-cover sm:block" />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-dim">
                    {e.number}. Edition{e.period ? ` · ${e.period}` : ""}
                  </p>
                  <h2 className="mt-1 font-display text-3xl font-semibold uppercase leading-tight text-white">{e.venue}</h2>
                  <p className="text-muted">{e.city}</p>
                </div>
                <span className={`text-sm ${e.photos ? "text-gold" : "text-dim"}`}>
                  {e.photos ? `${e.photos.length} Bilder →` : "ohne Bildarchiv"}
                </span>
              </div>
            );
            return (
              <li key={e.slug}>
                {e.photos ? (
                  <Link href={`/archiv/${e.slug}`} className="block no-underline hover:bg-card">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ol>

        <h2 className="eyebrow mt-20">Weitere Formate</h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {specials.map((s) => (
            <li key={s.slug}>
              <Link href={`/archiv/${s.slug}`} className="grid items-center gap-5 py-6 no-underline hover:bg-card sm:grid-cols-[120px_1fr_auto] sm:gap-8">
                <Image src={s.cover} alt="" width={1600} height={1061} sizes="120px" className="photo hidden aspect-[23/25] w-[120px] object-cover sm:block" />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-dim">{s.period}</p>
                  <h3 className="mt-1 font-display text-3xl font-semibold uppercase leading-tight text-white">{s.title}</h3>
                  <p className="text-muted">{s.venue}</p>
                </div>
                <span className="text-sm text-gold">Rückblick →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
