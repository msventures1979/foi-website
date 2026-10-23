import type { Metadata } from "next";
import Image from "next/image";
import { redeem } from "./actions";

export const metadata: Metadata = { title: "Anmelden", robots: { index: false, follow: false } };

export default async function AnmeldenPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t = "" } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <form action={redeem} className="w-full max-w-sm">
        <Image src="/images/foi-logo.png" alt="Frontline of Innovation" width={120} height={50} className="mb-10 h-12 w-auto" />
        <h1 className="font-display text-3xl font-bold uppercase">Anmelden</h1>
        <p className="mb-8 mt-2 text-sm text-muted">Ein Klick genügt.</p>
        <input type="hidden" name="t" value={t} />
        <button type="submit" className="btn-gold w-full">
          Jetzt anmelden
        </button>
      </form>
    </main>
  );
}
