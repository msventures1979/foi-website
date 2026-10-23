import Image from "next/image";
import Link from "next/link";
import { CONTACT_MAIL } from "@/lib/site";

const nav = [
  { href: "/#format", label: "Der Abend" },
  { href: "/archiv", label: "Archiv" },
  { href: "/#gastgeber", label: "Gastgeber" },
  { href: "/sponsoring", label: "Partner werden" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-black/90 backdrop-blur">
      <nav aria-label="Hauptnavigation" className="mx-auto flex max-w-[1240px] items-center justify-between gap-x-6 px-4 py-2.5 sm:px-6 md:py-3.5">
        <Link href="/" className="shrink-0 no-underline" aria-label="Frontline of Innovation – Startseite">
          <Image src="/images/foi-logo.png" alt="Frontline of Innovation" width={97} height={40} className="h-8 w-auto sm:h-10" priority />
        </Link>
        <div className="flex items-center gap-x-5 text-sm sm:gap-x-7">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`py-3 text-[#ccc] no-underline hover:text-white ${n.href === "/archiv" ? "" : "hidden md:inline"}`}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/#kontakt" className="btn-ghost !min-h-10 !px-4 text-sm">
            Kontakt
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 text-sm text-dim sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/images/foi-logo.png" alt="Frontline of Innovation" width={78} height={32} className="h-8 w-auto" />
          <p className="mt-4 max-w-sm leading-relaxed">
            Ein Abend für Entscheider aus Wirtschaft, Sport, Wissenschaft und Politik. Mannheim, auf persönliche Einladung.
          </p>
        </div>
        <div>
          <p className="eyebrow !text-[12px] !text-dim">Kontakt</p>
          <p className="mt-3">
            <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>
          </p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            <a href="https://www.linkedin.com/company/frontline-of-innovation/" target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 text-dim hover:text-white">
              LinkedIn
            </a>
            <a href="https://www.youtube.com/@FOI-FrontlineOfInnovation" target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 text-dim hover:text-white">
              YouTube
            </a>
          </p>
        </div>
        <div>
          <p className="eyebrow !text-[12px] !text-dim">Rechtliches</p>
          <p className="mt-3 flex flex-col">
            <Link href="/impressum" className="inline-block py-1.5 text-dim hover:text-white">Impressum</Link>
            <Link href="/datenschutz" className="inline-block py-1.5 text-dim hover:text-white">Datenschutz</Link>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-[1240px] px-4 pb-10 text-xs text-[#777] sm:px-6">© {new Date().getFullYear()} Frontline of Innovation</div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-black focus:p-3">
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt">{children}</main>
      <Footer />
    </div>
  );
}

/** Kopfbereich für Unterseiten */
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-4 pb-14 pt-16 sm:px-6 md:pb-20 md:pt-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-section mt-4 max-w-4xl">{title}</h1>
        {children ? <div className="lead mt-6 max-w-2xl">{children}</div> : null}
      </div>
    </section>
  );
}
