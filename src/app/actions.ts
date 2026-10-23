"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { db } from "@/lib/supabase/admin";
import { INQUIRY_KINDS, schemas, type InquiryKind, type InquiryState } from "@/lib/inquiry";

const LABELS: Record<InquiryKind, string> = {
  kontakt: "Kontaktanfrage",
  sponsoring: "Sponsoring-Anfrage",
  tickets: "Ticket-Anfrage",
};

/** Mindestzeit zwischen Seitenaufruf und Absenden – Bots füllen schneller aus. */
const MIN_FILL_MS = 2500;

export async function submitInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""]));
  const kind = values.kind as InquiryKind;
  if (!INQUIRY_KINDS.includes(kind)) return { status: "error", message: "Unbekanntes Formular." };

  // Spam-Schutz: verstecktes Feld muss leer sein, Formular darf nicht in Sekundenbruchteilen abgeschickt werden.
  const started = Number(values.started ?? 0);
  if (values.website || !started || Date.now() - started < MIN_FILL_MS) {
    return { status: "ok" }; // Bots bekommen keine Fehlermeldung, aus der sie lernen könnten
  }

  const parsed = schemas[kind].safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    // Fehler zu Feldern, die es im Formular nicht gibt, als Klartext zeigen statt still zu scheitern
    const unknown = Object.keys(errors).filter((k) => !(k in values) && k !== "consent");
    const message = unknown.length ? `Bitte prüfen Sie Ihre Angaben (${unknown.join(", ")}).` : "Bitte prüfen Sie die markierten Felder.";
    if (unknown.length) console.error("inquiry: Fehler in nicht vorhandenen Feldern", kind, unknown);
    return { status: "error", message, errors, values };
  }
  const data = parsed.data as Record<string, unknown>;

  const h = await headers();
  const source = h.get("referer") ?? "";

  let stored = false;
  if (env.hasDb) {
    const supa = db();
    // höchstens drei Anfragen je Adresse in zehn Minuten
    const { count } = await supa
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email as string)
      .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());
    if ((count ?? 0) >= 3) {
      return { status: "error", message: "Wir haben bereits mehrere Anfragen von dieser Adresse erhalten. Bitte versuchen Sie es später erneut.", values };
    }
    const { firstName, lastName, email, company, position, phone, message, topic, consent: _consent, ...rest } = data;
    void _consent;
    const { error } = await supa.from("inquiries").insert({
      kind,
      topic: (topic as string) ?? null,
      first_name: firstName,
      last_name: lastName,
      email,
      company: company || null,
      position: position || null,
      phone: phone || null,
      message: message || null,
      details: rest,
      source_url: source.slice(0, 500) || null,
      consent_at: new Date().toISOString(),
    });
    if (error) {
      console.error("inquiries insert", error);
    } else {
      stored = true;
    }
  }

  let mailed = false;
  if (env.resendKey) {
    try {
      const resend = new Resend(env.resendKey);
      const { error } = await resend.emails.send({
        from: env.mailFrom,
        to: env.notifyTo,
        replyTo: data.email as string,
        subject: `${LABELS[kind]}: ${data.firstName} ${data.lastName}${data.company ? ` (${data.company})` : ""}`,
        text: renderNotification(kind, data),
      });
      if (error) console.error("resend", error);
      else mailed = true;
    } catch (e) {
      console.error("resend", e);
    }
  }

  if (!stored && !mailed) {
    return {
      status: "error",
      message: "Ihre Anfrage konnte gerade nicht übermittelt werden. Bitte schreiben Sie uns an info@frontlineofinnovation.de.",
      values,
    };
  }
  return { status: "ok" };
}

const FIELD_LABELS: Record<string, string> = {
  topic: "Anliegen / Paket",
  firstName: "Vorname",
  lastName: "Nachname",
  email: "E-Mail",
  company: "Unternehmen",
  position: "Position",
  phone: "Telefon",
  linkedin: "LinkedIn",
  tickets: "Anzahl Tickets",
  guests: "Gäste",
  street: "Straße",
  zip: "PLZ",
  city: "Ort",
  message: "Nachricht",
};

function renderNotification(kind: InquiryKind, data: Record<string, unknown>) {
  const lines = [`Neue ${LABELS[kind]} über frontlineofinnovation.de`, ""];
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    const v = data[key];
    if (v === undefined || v === null || v === "") continue;
    const s = String(v);
    lines.push(s.includes("\n") ? `${label}:\n${s}\n` : `${label}: ${s}`);
  }
  lines.push("", "Antworten Sie direkt auf diese Mail, um der anfragenden Person zu schreiben.");
  return lines.join("\n");
}
