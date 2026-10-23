import Link from "next/link";
import { setInquiryStatus } from "@/app/admin/actions";
import { fmtDateTime, H1, Notice } from "@/components/admin";
import { requireAdmin } from "@/lib/auth";
import { INQUIRY_STATUS } from "@/lib/status";
import { db } from "@/lib/supabase/admin";

export const metadata = { title: "Anfragen" };

const KIND: Record<string, string> = { kontakt: "Kontakt", sponsoring: "Partner", tickets: "Tickets" };

export default async function AnfragenPage({ searchParams }: { searchParams: Promise<{ art?: string; status?: string; hinweis?: string }> }) {
  await requireAdmin();
  const { art = "", status = "", hinweis } = await searchParams;
  let query = db().from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
  if (art in KIND) query = query.eq("kind", art);
  if (status in INQUIRY_STATUS) query = query.eq("status", status);
  const { data } = await query;
  const link = (p: Record<string, string>) => {
    const u = new URLSearchParams({ ...(art ? { art } : {}), ...(status ? { status } : {}), ...p });
    for (const [k, v] of [...u.entries()]) if (!v) u.delete(k);
    return `/admin/anfragen${u.size ? `?${u}` : ""}`;
  };

  return (
    <>
      <H1 sub="Alles, was über die Formulare der Website hereinkommt. Eine Kopie geht jeweils an info@.">Anfragen</H1>
      <Notice text={hinweis} />
      <p className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link href={link({ art: "" })} className={!art ? "text-gold" : ""}>
          Alle
        </Link>
        {Object.entries(KIND).map(([k, v]) => (
          <Link key={k} href={link({ art: k })} className={art === k ? "text-gold" : ""}>
            {v}
          </Link>
        ))}
        <span className="text-dim">|</span>
        {Object.entries(INQUIRY_STATUS).map(([k, v]) => (
          <Link key={k} href={link({ status: status === k ? "" : k })} className={status === k ? "text-gold" : ""}>
            {v}
          </Link>
        ))}
      </p>
      <ul className="space-y-3">
        {(data ?? []).map((r) => {
          const d = (r.details ?? {}) as Record<string, unknown>;
          return (
            <li key={r.id} className="card-dark p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-gold">
                    {KIND[r.kind] ?? r.kind}
                    {r.topic ? ` · ${r.topic}` : ""} · <span className="text-dim">{fmtDateTime(r.created_at)}</span>
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold">
                    {r.first_name} {r.last_name}
                  </p>
                  <p className="text-sm text-muted">
                    {[r.position, r.company].filter(Boolean).join(" · ")}
                    {" · "}
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                    {r.phone ? ` · ${r.phone}` : ""}
                  </p>
                </div>
                <form action={setInquiryStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <select name="status" defaultValue={r.status} className="field !min-h-9 !w-44 !text-sm">
                    {Object.entries(INQUIRY_STATUS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn-sm">
                    Speichern
                  </button>
                </form>
              </div>
              {Object.keys(d).length ? (
                <p className="mt-3 text-sm text-[#ccc]">
                  {Object.entries(d)
                    .filter(([, v]) => v !== "" && v != null)
                    .map(([k, v]) => `${k}: ${String(v)}`)
                    .join(" · ")}
                </p>
              ) : null}
              {r.message ? <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#ddd]">{r.message}</p> : null}
            </li>
          );
        })}
        {!data?.length ? <li className="text-muted">Keine Anfragen.</li> : null}
      </ul>
    </>
  );
}
