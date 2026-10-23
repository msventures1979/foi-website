import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/log";
import { CATEGORY, STATUS, type InvitationStatus } from "@/lib/status";
import { db } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** Zelle für Excel: Semikolon-CSV, Formel-Injektion verhindern */
function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const supa = db();
  const { data: ev } = await supa.from("events").select("slug").eq("id", id).maybeSingle();
  if (!ev) return new Response("Nicht gefunden", { status: 404 });
  const { data } = await supa
    .from("invitations")
    .select("code,status,category,diet,allergies,phone,table_no,note,responded_at,contacts(salutation,title,first_name,last_name,email,company,position,phone)")
    .eq("event_id", id)
    .order("created_at");

  const head = ["Anrede", "Titel", "Vorname", "Nachname", "E-Mail", "Unternehmen", "Position", "Telefon", "Status", "Kategorie", "Menü", "Allergien", "Tisch", "Code", "Rückmeldung", "Notiz"];
  const lines = [head.join(";")];
  for (const r of (data ?? []) as unknown as Record<string, string & Record<string, string>>[]) {
    const c = r.contacts as unknown as Record<string, string>;
    lines.push(
      [
        c.salutation,
        c.title,
        c.first_name,
        c.last_name,
        c.email,
        c.company,
        c.position,
        r.phone || c.phone,
        STATUS[r.status as InvitationStatus]?.label ?? r.status,
        r.category ? CATEGORY[r.category] : "",
        r.diet,
        r.allergies,
        r.table_no,
        r.code,
        r.responded_at ? new Date(r.responded_at).toLocaleString("de-DE", { timeZone: "Europe/Berlin" }) : "",
        r.note,
      ]
        .map(cell)
        .join(";"),
    );
  }
  await logActivity(admin.email, "export.gaesteliste", "event", id, { rows: lines.length - 1 });
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="gaeste-${ev.slug}.csv"`,
      "cache-control": "no-store",
    },
  });
}
