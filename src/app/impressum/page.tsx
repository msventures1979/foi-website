import type { Metadata } from "next";
import { PageShell } from "@/components/site";
import { Impressum } from "@/content/legal";

export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum" } };

export default function ImpressumPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-[760px] px-4 pb-24 pt-16 sm:px-6 md:pt-20">
        <h1 className="font-display text-5xl font-bold uppercase leading-none">Impressum</h1>
        <div className="mt-8 text-[17px] leading-relaxed text-[#d1d1d1]">
          <Impressum />
        </div>
      </article>
    </PageShell>
  );
}
