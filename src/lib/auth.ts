import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { db } from "@/lib/supabase/admin";

/**
 * Admin-Anmeldung per Mail-Link, ohne Passwörter und ohne Supabase Auth:
 * 1. Adresse muss in admin_users stehen.
 * 2. Einmal-Link (15 Minuten gültig, Token nur als Hash gespeichert) geht per Resend raus.
 * 3. Nach Klick: signiertes, HTTP-only Cookie für 14 Tage.
 */

const COOKIE = "foi_admin";
const SESSION_DAYS = 14;
export const LOGIN_TOKEN_MINUTES = 15;

export type Admin = { email: string; name: string; role: "admin" | "assistenz" };

function secret() {
  // Eigener Wert, falls gesetzt – sonst aus dem Service-Key abgeleitet (der ist ohnehin geheim und nur serverseitig).
  const base = process.env.SESSION_SECRET || env.supabaseServiceKey;
  return createHash("sha256").update(`foi-admin-session:${base}`).digest();
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function newToken() {
  return randomBytes(32).toString("base64url");
}

export async function createSession(email: string) {
  const exp = Date.now() + SESSION_DAYS * 24 * 3600 * 1000;
  const payload = Buffer.from(JSON.stringify({ e: email.toLowerCase(), x: exp })).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(exp),
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

async function readSession(): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof e !== "string" || typeof x !== "number" || x < Date.now()) return null;
    return e;
  } catch {
    return null;
  }
}

/** Aktuelle Admin-Person oder null. Prüft bei jedem Aufruf gegen admin_users (Entzug wirkt sofort). */
export async function currentAdmin(): Promise<Admin | null> {
  if (!env.hasDb) return null;
  const email = await readSession();
  if (!email) return null;
  const { data } = await db().from("admin_users").select("email,name,role").eq("email", email).maybeSingle();
  return (data as Admin) ?? null;
}

/** In JEDER Admin-Seite und JEDER Admin-Aktion aufrufen – nicht nur im Layout. */
export async function requireAdmin(role?: "admin"): Promise<Admin> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  if (role === "admin" && admin.role !== "admin") redirect("/admin?fehler=rechte");
  return admin;
}
