import Link from "next/link";
import { PageShell } from "@/components/site";

export default function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[760px] px-4 py-28 sm:px-6">
        <p className="eyebrow">404</p>
        <h1 className="h-section mt-4">Diese Seite gibt es nicht</h1>
        <p className="lead mt-6">Vielleicht wurde sie verschoben. Auf der Startseite und im Archiv finden Sie alles Weitere.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="btn-gold">
            Zur Startseite
          </Link>
          <Link href="/archiv" className="btn-ghost">
            Zum Archiv
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
