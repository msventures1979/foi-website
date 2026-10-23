import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { LoginForm } from "./form";

export const metadata: Metadata = { title: "Anmeldung", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ERR: Record<string, string> = {
  abgelaufen: "Der Link ist abgelaufen oder wurde schon benutzt. Bitte fordern Sie einen neuen an.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ fehler?: string }> }) {
  if (await currentAdmin()) redirect("/admin");
  const { fehler } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <Image src="/images/foi-logo.png" alt="Frontline of Innovation" width={120} height={50} className="mb-10 h-12 w-auto" />
        <h1 className="font-display text-3xl font-bold uppercase">Verwaltung</h1>
        <p className="mb-8 mt-2 text-sm text-muted">Wir schicken Ihnen einen Anmeldelink per Mail. Ein Passwort gibt es nicht.</p>
        {fehler && ERR[fehler] ? (
          <p role="alert" className="mb-6 text-sm text-gold-light">
            {ERR[fehler]}
          </p>
        ) : null}
        <LoginForm />
      </div>
    </main>
  );
}
