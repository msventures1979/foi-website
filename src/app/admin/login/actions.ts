"use server";

import { Resend } from "resend";
import { hashToken, LOGIN_TOKEN_MINUTES, newToken } from "@/lib/auth";
import { env } from "@/lib/env";
import { logActivity } from "@/lib/log";
import { db } from "@/lib/supabase/admin";

export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

export async function requestLogin(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { status: "error", message: "Bitte eine gültige Adresse eingeben." };
  if (!env.hasDb || !env.resendKey) return { status: "error", message: "Der Admin-Bereich ist noch nicht eingerichtet." };
  const supa = db();
  const { data: admin } = await supa.from("admin_users").select("email,name").eq("email", email).maybeSingle();
  // Immer dieselbe Antwort – verrät nicht, welche Adressen Zugang haben
  const answer: LoginState = { status: "sent", message: `Falls ${email} freigeschaltet ist, ist ein Anmeldelink unterwegs. Er gilt ${LOGIN_TOKEN_MINUTES} Minuten.` };
  if (!admin) {
    await logActivity(email, "admin.login_unbekannt");
    return answer;
  }
  // höchstens 5 Links in 15 Minuten
  const { count } = await supa
    .from("login_tokens")
    .select("token_hash", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString());
  if ((count ?? 0) >= 5) return answer;

  const token = newToken();
  await supa.from("login_tokens").insert({ token_hash: hashToken(token), email, expires_at: new Date(Date.now() + LOGIN_TOKEN_MINUTES * 60 * 1000).toISOString() });
  const link = `${env.publicUrl}/admin/anmelden?t=${encodeURIComponent(token)}`;
  const resend = new Resend(env.resendKey);
  const { error } = await resend.emails.send({
    from: env.mailFrom,
    to: email,
    subject: "Ihr Anmeldelink für frontlineofinnovation.de",
    text: `Hallo ${admin.name || ""},\n\nmit diesem Link melden Sie sich im Verwaltungsbereich an (gültig ${LOGIN_TOKEN_MINUTES} Minuten, nur einmal nutzbar):\n\n${link}\n\nFalls Sie das nicht angefordert haben, können Sie diese Mail ignorieren.`,
  });
  if (error) {
    console.error("login mail", error);
    return { status: "error", message: "Der Link konnte nicht verschickt werden. Bitte später erneut versuchen." };
  }
  return answer;
}
