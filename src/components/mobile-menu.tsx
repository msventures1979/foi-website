"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Menü für Handy und Tablet: Vollbild, schließt bei Klick auf einen Eintrag, bei Esc und bei Seitenwechsel. */
export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="menu-mobil"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[6px]"
      >
        <span className={`block h-[2px] w-6 bg-white transition ${open ? "translate-y-[8px] rotate-45" : ""}`} />
        <span className={`block h-[2px] w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
        <span className={`block h-[2px] w-6 bg-white transition ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
      </button>
      <nav
        id="menu-mobil"
        aria-label="Menü"
        className={`fixed inset-0 z-40 flex flex-col bg-black px-6 pb-10 pt-24 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ul className="flex-1 space-y-1">
          {items.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="block py-2.5 font-display text-[34px] font-semibold uppercase leading-tight text-white no-underline hover:text-gold"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/#kontakt"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="flex min-h-14 items-center justify-center bg-white text-sm font-semibold uppercase tracking-[0.18em] text-black no-underline"
        >
          Kontakt aufnehmen
        </Link>
        <p className="mt-6 text-center text-sm text-dim">info@frontlineofinnovation.de</p>
      </nav>
    </div>
  );
}
