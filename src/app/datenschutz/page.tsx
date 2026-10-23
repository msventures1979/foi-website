import type { Metadata } from "next";
import { PageShell } from "@/components/site";
import { Datenschutz } from "@/content/legal";

export const metadata: Metadata = { title: "Datenschutz", alternates: { canonical: "/datenschutz" } };

export default function DatenschutzPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-[760px] px-4 pb-24 pt-16 sm:px-6 md:pt-20">
        <h1 className="font-display text-5xl font-bold uppercase leading-none">Datenschutz</h1>
        <div className="mt-8 text-[17px] leading-relaxed text-[#d1d1d1]">
          <Datenschutz />
        </div>
      </article>
    </PageShell>
  );
}
