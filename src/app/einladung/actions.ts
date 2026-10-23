"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { logActivity } from "@/lib/log";
import { sendNow } from "@/lib/mail/queue";
import { canAccept, invitationByCode, invitationByToken, isOver } from "@/lib/rsvp";
import { DIETS } from "@/lib/rsvp-shared";
import { db } from "@/lib/supabase/admin";
import { normalizeCode } from "@/lib/codes";

export type RsvpState = { status: "idle" | "error"; message?: string; errors?: Record<string, string> };

export async function lookupCode(_prev: RsvpState, form: FormData): Promise<RsvpState> {
  const code = normalizeCode(String(form.get("code") ?? ""));
  if (!/^FOI-[A-Z0-9]{6}$/.test(code)) return { status: "error", message: "Bitte geben Sie Ihren Code im Format FOI-XXXXXX ein." };
  await new Promise((r) => setTimeout(r, 400)); // bremst systematisches Durchprobieren
  const inv = await invitationByCode(code);
  if (!inv) return { status: "error", message: "Diesen Code kennen wir nicht. Bitte prüfen Sie die Schreibweise oder schreiben Sie uns an info@frontlineofinnovation.de." };
  redirect(`/einladung?code=${encodeURIComponent(code)}`);
}

const acceptSchema = z.object({
  diet: z.enum(DIETS, { message: "Bitte wählen Sie Ihr Menü." }),
  allergies: z.string().trim().max(500).optional().default(""),
  allergiesConsent: z.string().optional(),
  phone: z.string().trim().max(40).optional().default(""),
  terms: z.literal("on", { message: "Bitte bestätigen Sie die Hinweise zum Datenschutz." }),
});

/** Zusage oder Absage – über Code (aus der Einladung) oder Token (aus „Teilnahme verwalten“). */
export async function respond(_prev: RsvpState, form: FormData): Promise<RsvpState> {
  const code = String(form.get("code") ?? "");
  const token = String(form.get("token") ?? "");
  const decision = String(form.get("decision") ?? "");
  const inv = token ? await invitationByToken(token) : await invitationByCode(code);
  if (!inv) return { status: "error", message: "Ihre Einladung wurde nicht gefunden." };
  if (isOver(inv.events)) return { status: "error", message: "Dieser Abend liegt bereits hinter uns." };
  const supa = db();
  const who = `${inv.contacts.first_name} ${inv.contacts.last_name}`;

  if (decision === "absage") {
    if (inv.status !== "abgesagt") {
      await supa.from("invitations").update({ status: "abgesagt", responded_at: new Date().toISOString(), allergies: "", allergies_consent_at: null }).eq("id", inv.id);
      await logActivity(who, "gast.abgesagt", "invitation", inv.id, { code: inv.code });
      await sendNow(inv.id, "absage");
    }
    redirect(`/meine-teilnahme/${inv.manage_token}?ok=absage`);
  }

  if (decision !== "zusage") return { status: "error", message: "Bitte wählen Sie Zusage oder Absage." };
  if (!canAccept(inv.events) && inv.status !== "zugesagt") return { status: "error", message: inv.events.closed_message || "Die Anmeldung ist geschlossen." };

  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  const parsed = acceptSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { status: "error", message: "Bitte prüfen Sie Ihre Angaben.", errors };
  }
  const d = parsed.data;
  if (d.allergies && d.allergiesConsent !== "on") {
    return { status: "error", message: "Bitte bestätigen Sie die Einwilligung zu Ihren Angaben über Allergien.", errors: { allergiesConsent: "Einwilligung erforderlich" } };
  }
  const first = inv.status !== "zugesagt";
  await supa
    .from("invitations")
    .update({
      status: "zugesagt",
      diet: d.diet,
      allergies: d.allergies,
      allergies_consent_at: d.allergies ? new Date().toISOString() : null,
      phone: d.phone,
      responded_at: new Date().toISOString(),
    })
    .eq("id", inv.id);
  await logActivity(who, first ? "gast.zugesagt" : "gast.angaben_geaendert", "invitation", inv.id, { code: inv.code });
  if (first) await sendNow(inv.id, "zusage");
  redirect(`/meine-teilnahme/${inv.manage_token}?ok=${first ? "zusage" : "gespeichert"}`);
}
