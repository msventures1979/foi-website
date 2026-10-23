import type { Metadata } from "next";
import { PageShell } from "@/components/site";
import { Datenschutz } from "@/content/legal";

export const metadata: Metadata = { title: "Datenschutz", alternates: { canonical: "/datenschutz" } };

export default function DatenschutzPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-[760px] px-4 pb-24 pt-16 sm:px-6 md:pt-20">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Rechtliches</p>
        <h1 className="mt-4 font-display text-[clamp(44px,7vw,84px)] font-bold uppercase leading-none">Datenschutz</h1>
        <div className="mt-8 text-[17px] leading-relaxed text-[#d1d1d1]">
          <Datenschutz />
        </div>
      </article>
    </PageShell>
  );
}
