import Link from "next/link";
import { H1, Notice } from "@/components/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

export const metadata = { title: "Kontakte" };

const PAGE = 100;

export default async function KontaktePage({ searchParams }: { searchParams: Promise<{ q?: string; seite?: string; hinweis?: string }> }) {
  await requireAdmin();
  const { q = "", seite = "1", hinweis } = await searchParams;
  const page = Math.max(1, Number(seite) || 1);
  let query = db()
    .from("contacts")
    .select("id,title,first_name,last_name,email,company,position,opted_out_at,invitations(status)", { count: "exact" })
    .order("last_name")
    .order("first_name")
    .range((page - 1) * PAGE, page * PAGE - 1);
  const needle = q.trim().replace(/[%,()]/g, " ");
  if (needle) query = query.or(["first_name", "last_name", "email", "company"].map((c) => `${c}.ilike.%${needle}%`).join(","));
  const { data, count } = await query;
  const rows = (data ?? []) as unknown as {
    id: string;
    title: string;
    first_name: string;
    last_name: string;
    email: string | null;
    company: string;
    position: string;
    opted_out_at: string | null;
    invitations: { status: string }[];
  }[];
  const pages = Math.ceil((count ?? 0) / PAGE);

  return (
    <>
      <H1 sub="Jede Person einmal – über alle Events hinweg. Neue Kontakte entstehen beim Hinzufügen eines Gastes.">Kontakte ({count ?? 0})</H1>
      <Notice text={hinweis} />
      <form className="mb-6 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Name, Firma oder Mail" className="field !min-h-9 !w-72 !text-sm" />
        <button className="btn-sm" type="submit">
          Suchen
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Unternehmen</th>
              <th>Mail</th>
              <th>Events</th>
              <th>Zusagen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/admin/kontakte/${c.id}`} className="text-white">
                    {[c.title, c.first_name, c.last_name].filter(Boolean).join(" ")}
                  </Link>
                  {c.opted_out_at ? <span className="ml-2 text-xs text-gold">abgemeldet</span> : null}
                </td>
                <td>
                  {c.company}
                  {c.position ? <span className="block text-xs text-dim">{c.position}</span> : null}
                </td>
                <td className="text-xs">{c.email ?? "–"}</td>
                <td>{c.invitations.length}</td>
                <td>{c.invitations.filter((i) => i.status === "zugesagt" || i.status === "teilgenommen").length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 ? (
        <p className="mt-6 flex gap-3 text-sm">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={`/admin/kontakte?${new URLSearchParams({ ...(q ? { q } : {}), seite: String(n) })}`} className={n === page ? "text-gold" : ""}>
              {n}
            </Link>
          ))}
        </p>
      ) : null}
    </>
  );
}
