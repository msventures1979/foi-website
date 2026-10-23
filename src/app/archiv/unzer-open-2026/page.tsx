import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/site";

export const metadata: Metadata = {
  title: "Unzer Open 2026",
  description: "Golfturnier, Schnupperkurs und Abendveranstaltung im Golf Club St. Leon-Rot am 10. Juni 2026 – gemeinsam mit Unzer.",
  alternates: { canonical: "/archiv/unzer-open-2026" },
};

const schedule = [
  { time: "10:00", text: "Check-in und Frühstück im Restaurant ACE" },
  { time: "12:00", text: "Kanonenstart auf dem Platz St. Leon" },
  { time: "14:00", text: "Schnupperkurs für Einsteiger" },
  { time: "16:30", text: "Get-together im Halfway House" },
  { time: "18:00", text: "Empfang im Restaurant ACE" },
  { time: "18:30", text: "Abendveranstaltung und Siegerehrung" },
];

export default function UnzerOpenPage() {
  return (
    <PageShell>
      <section className="relative isolate overflow-hidden border-b border-line">
        <Image src="/images/archiv/unzer-open-golfplatz.webp" alt="" fill priority sizes="100vw" className="photo-dim -z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="mx-auto flex min-h-[52vh] max-w-[1240px] flex-col justify-end px-4 pb-14 pt-24 sm:px-6">
          <p className="eyebrow">
            <Link href="/archiv" className="text-gold no-underline">
              Archiv
            </Link>{" "}
            · 10. Juni 2026
          </p>
          <h1 className="h-section mt-4 !text-[clamp(44px,7vw,96px)]">Unzer Open 2026</h1>
          <p className="lead mt-3">Golf Club St. Leon-Rot</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr] md:py-20">
        <div className="space-y-4 text-[17px] leading-relaxed text-muted">
          <p>
            Ein Tag für Sport und Austausch: Gemeinsam mit Unzer hat Frontline of Innovation am 10. Juni 2026 einen ausgewählten Kreis aus Digital- und
            Sportbranche in den Golf Club St. Leon-Rot eingeladen, mit SAP als strategischem Partner.
          </p>
          <p>
            Gespielt wurde ein Scramble, bei dem das Team zählt. Wer noch nicht spielt, konnte einen Schnupperkurs besuchen. Den Abschluss bildeten
            Empfang, Abendveranstaltung und Siegerehrung.
          </p>
        </div>
        <div>
          <h2 className="eyebrow">Ablauf</h2>
          <ol className="mt-5 divide-y divide-line border-y border-line">
            {schedule.map((s) => (
              <li key={s.time} className="grid grid-cols-[64px_1fr] gap-4 py-3.5">
                <span className="font-display text-gold">{s.time}</span>
                <span className="text-white">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
