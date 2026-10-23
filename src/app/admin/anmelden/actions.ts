"use server";

import { redirect } from "next/navigation";
import { createSession, hashToken } from "@/lib/auth";
import { logActivity } from "@/lib/log";
import { db } from "@/lib/supabase/admin";

/** Einlösen des Mail-Links: Token einmalig, 15 Minuten gültig. Bewusst per Knopfdruck (POST), damit Link-Scanner ihn nicht verbrauchen. */
export async function redeem(form: FormData) {
  const token = String(form.get("t") ?? "");
  if (!token) redirect("/admin/login?fehler=abgelaufen");
  const { data } = await db()
    .from("login_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", hashToken(token))
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("email")
    .maybeSingle();
  if (!data) redirect("/admin/login?fehler=abgelaufen");
  await createSession(data.email as string);
  await logActivity(data.email as string, "admin.angemeldet");
  redirect("/admin");
}
