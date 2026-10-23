import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Unzer Open 2026",
  description: "Das Golfturnier von Unzer im Golf Club St. Leon-Rot am 10. Juni 2026 – mit Frontline of Innovation als Mitveranstalter.",
  alternates: { canonical: "/archiv/unzer-open-2026" },
};

const schedule = [
  { time: "10:00", text: "Ankunft und Frühstück im Restaurant ACE" },
  { time: "12:00", text: "Kanonenstart auf dem Platz St. Leon" },
  { time: "14:00", text: "Schnupperkurs für Einsteiger" },
  { time: "16:30", text: "Zusammenkommen am Halfway House" },
  { time: "18:00", text: "Empfang im Restaurant ACE" },
  { time: "18:30", text: "Abendveranstaltung und Siegerehrung" },
];

export default function UnzerOpenPage() {
  return (
    <PageShell>
      <PageHero
        image="/images/archiv/unzer-open-golfplatz.webp"
        imageAlt="Golf Club St. Leon-Rot"
        eyebrow={
          <>
            <Link href="/archiv" className="text-gold no-underline hover:text-gold-light">
              Archiv
            </Link>{" "}
            · 10. Juni 2026 · Golf Club St. Leon-Rot
          </>
        }
        title="Unzer"
        outline="Open 2026"
      />

      <section className="mx-auto grid max-w-[1100px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-dim">Rückblick</p>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-muted md:text-lg">
            <p>
              Ein Tag für Sport und Austausch: Zum Unzer Open hat Unzer am 10. Juni 2026 einen ausgewählten Kreis aus Digital- und Sportbranche in den
              Golf Club St. Leon-Rot eingeladen, mit SAP als strategischem Partner. Frontline of Innovation war als Mitveranstalter dabei.
            </p>
            <p>
              Gespielt wurde im Team: Gewertet wurde der beste Schlag der Gruppe. Wer noch nicht spielt, konnte einen Schnupperkurs besuchen. Den Abschluss
              bildeten Empfang, Abendveranstaltung und Siegerehrung.
            </p>
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold uppercase">Ablauf</h2>
          <ol className="mt-4 divide-y divide-line border-y border-line">
            {schedule.map((s) => (
              <li key={s.time} className="grid grid-cols-[68px_1fr] gap-4 py-3.5">
                <span className="font-display text-lg font-semibold">{s.time}h</span>
                <span className="font-semibold text-white">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="border-t border-line py-10 text-center">
        <Link href="/archiv" className="border-b border-dim pb-1 text-xs uppercase tracking-[0.24em] text-muted no-underline hover:text-white">
          Alle Editionen im Archiv →
        </Link>
      </div>
    </PageShell>
  );
}
