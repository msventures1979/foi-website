import { z } from "zod";

/** Gemeinsame Felder und Regeln aller Anfrageformulare (Browser und Server). */

export const INQUIRY_KINDS = ["kontakt", "sponsoring", "tickets"] as const;
export type InquiryKind = (typeof INQUIRY_KINDS)[number];

export const CONTACT_TOPICS = ["Empfehlung eines Gastes", "Bewerbung um einen Gründerplatz", "Presse", "Sonstiges"] as const;
export const SPONSOR_PACKAGES = ["Hauptpartner", "Premiumpartner", "Förderpartner", "Noch offen"] as const;
export const MAX_TICKETS = 2;

// Optionale Felder dürfen im jeweiligen Formular ganz fehlen (z. B. Telefon im Kontaktformular).
const text = (max: number) => z.string().trim().max(max, `Höchstens ${max} Zeichen.`).optional().default("");
const required = (max: number, msg = "Bitte ausfüllen.") =>
  z.string({ message: msg }).trim().min(1, msg).max(max, `Höchstens ${max} Zeichen.`);

const base = z.object({
  firstName: required(100),
  lastName: required(100),
  email: z.string().trim().toLowerCase().email("Bitte eine gültige E-Mail-Adresse angeben.").max(200),
  company: text(200),
  position: text(150),
  phone: text(40),
  message: text(3000),
  consent: z.literal("on", { message: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu." }),
});

export const schemas = {
  kontakt: base.extend({
    topic: z.enum(CONTACT_TOPICS, { message: "Bitte ein Anliegen wählen." }),
    linkedin: text(300),
    message: required(3000, "Bitte schreiben Sie uns ein paar Sätze."),
  }),
  sponsoring: base.extend({
    company: required(200),
    topic: z.enum(SPONSOR_PACKAGES, { message: "Bitte ein Paket wählen." }),
  }),
  tickets: base.extend({
    company: required(200),
    tickets: z.coerce.number().int().min(1).max(MAX_TICKETS),
    guests: required(1500, "Bitte nennen Sie uns kurz, wen Sie mitbringen möchten."),
    street: required(200),
    zip: required(10),
    city: required(100),
  }),
} as const;

export type FieldErrors = Partial<Record<string, string>>;

export type InquiryState = {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: FieldErrors;
  /** Eingaben zurückgeben, damit nach einem Fehler nichts verloren geht */
  values?: Record<string, string>;
};
