import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: { default: "Verwaltung", template: "%s – Verwaltung FOI" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/events", label: "Events & Gäste" },
  { href: "/admin/kontakte", label: "Kontakte" },
  { href: "/admin/anfragen", label: "Anfragen" },
  { href: "/admin/mails", label: "Mails" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/admin" className="shrink-0">
            <Image src="/images/foi-logo.png" alt="Frontline of Innovation" width={80} height={33} className="h-8 w-auto" />
          </Link>
          <nav aria-label="Verwaltung" className="flex flex-1 flex-wrap gap-x-5 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="py-2 text-[#ccc] no-underline hover:text-white">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-sm text-dim">
            <span className="hidden sm:inline">{admin.name || admin.email}</span>
            <Link href="/" className="text-dim no-underline hover:text-white">
              Zur Website
            </Link>
            <form action={logout}>
              <button type="submit" className="btn-sm">
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
