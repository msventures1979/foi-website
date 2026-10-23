"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { submitInquiry } from "@/app/actions";
import { CONTACT_TOPICS, MAX_TICKETS, SPONSOR_PACKAGES, type InquiryKind, type InquiryState } from "@/lib/inquiry";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea" | "select";
  options?: readonly string[];
  required?: boolean;
  autoComplete?: string;
  wide?: boolean;
  placeholder?: string;
};

const person: Field[] = [
  { name: "firstName", label: "Vorname", required: true, autoComplete: "given-name" },
  { name: "lastName", label: "Nachname", required: true, autoComplete: "family-name" },
  { name: "email", label: "E-Mail", type: "email", required: true, autoComplete: "email" },
];

const FIELDS: Record<InquiryKind, Field[]> = {
  kontakt: [
    { name: "topic", label: "Anliegen", type: "select", options: CONTACT_TOPICS, required: true, wide: true },
    ...person,
    { name: "company", label: "Unternehmen", autoComplete: "organization" },
    { name: "position", label: "Position", autoComplete: "organization-title" },
    { name: "linkedin", label: "LinkedIn-Profil", type: "url", placeholder: "https://www.linkedin.com/in/…" },
    {
      name: "message",
      label: "Ihre Nachricht",
      type: "textarea",
      required: true,
      wide: true,
      placeholder: "Wen möchten Sie empfehlen – oder wer sind Sie und was bringen Sie an den Tisch?",
    },
  ],
  sponsoring: [
    { name: "topic", label: "Paket", type: "select", options: SPONSOR_PACKAGES, required: true, wide: true },
    ...person,
    { name: "company", label: "Unternehmen", required: true, autoComplete: "organization" },
    { name: "position", label: "Position", autoComplete: "organization-title" },
    { name: "phone", label: "Telefon", type: "tel", autoComplete: "tel" },
    { name: "message", label: "Nachricht", type: "textarea", wide: true },
  ],
  tickets: [
    {
      name: "tickets",
      label: "Anzahl Tickets",
      type: "select",
      options: Array.from({ length: MAX_TICKETS }, (_, i) => String(i + 1)),
      required: true,
      wide: true,
    },
    ...person,
    { name: "company", label: "Unternehmen", required: true, autoComplete: "organization" },
    { name: "position", label: "Position", autoComplete: "organization-title" },
    { name: "phone", label: "Telefon", type: "tel", autoComplete: "tel" },
    { name: "street", label: "Straße und Hausnummer (Rechnungsadresse)", required: true, autoComplete: "street-address", wide: true },
    { name: "zip", label: "PLZ", required: true, autoComplete: "postal-code" },
    { name: "city", label: "Ort", required: true, autoComplete: "address-level2" },
    {
      name: "guests",
      label: "Ihre Gäste",
      type: "textarea",
      required: true,
      wide: true,
      placeholder: "Name, Funktion und Unternehmen je Gast",
    },
    { name: "message", label: "Anmerkungen", type: "textarea", wide: true },
  ],
};

const SUCCESS: Record<InquiryKind, string> = {
  kontakt: "Vielen Dank. Ihre Nachricht ist bei uns angekommen, wir melden uns persönlich.",
  sponsoring: "Vielen Dank für Ihr Interesse. Wir melden uns in den nächsten Tagen für ein persönliches Gespräch.",
  tickets: "Vielen Dank. Wir prüfen Ihre Anfrage und melden uns mit der Bestätigung und der Rechnung bei Ihnen.",
};

const initial: InquiryState = { status: "idle" };

export function InquiryForm({ kind, preset, submitLabel = "Absenden" }: { kind: InquiryKind; preset?: Record<string, string>; submitLabel?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [started, setStarted] = useState("");
  useEffect(() => setStarted(String(Date.now())), []);

  if (state.status === "ok") {
    return (
      <div role="status" className="border border-line-strong bg-card p-8">
        <p className="font-display text-2xl font-semibold uppercase">Danke</p>
        <p className="mt-3 text-muted">{SUCCESS[kind]}</p>
      </div>
    );
  }

  const v = (name: string) => state.values?.[name] ?? preset?.[name] ?? "";
  const err = (name: string) => state.errors?.[name];

  return (
    <form action={action} noValidate className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="started" value={started} />
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {FIELDS[kind].map((f) => {
        const id = `${kind}-${f.name}`;
        const e = err(f.name);
        const common = {
          id,
          name: f.name,
          required: f.required,
          "aria-invalid": e ? true : undefined,
          "aria-describedby": e ? `${id}-err` : undefined,
          defaultValue: v(f.name),
        };
        return (
          <div key={f.name} className={f.wide || f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="lbl">
              {f.label}
              {f.required ? <span className="text-gold"> *</span> : null}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} className="field" rows={4} placeholder={f.placeholder} />
            ) : f.type === "select" ? (
              <select {...common} className="field">
                {f.name === "topic" && !v("topic") ? <option value="">Bitte wählen</option> : null}
                {f.options!.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input {...common} type={f.type ?? "text"} autoComplete={f.autoComplete} placeholder={f.placeholder} className="field" />
            )}
            {e ? (
              <p id={`${id}-err`} className="mt-1.5 text-sm text-gold-light">
                {e}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="sm:col-span-2">
        <label className="chk">
          <input type="checkbox" name="consent" required aria-invalid={err("consent") ? true : undefined} defaultChecked={v("consent") === "on"} />
          <span>
            Ich bin einverstanden, dass Frontline of Innovation meine Angaben zur Bearbeitung dieser Anfrage speichert und mich dazu kontaktiert.
            Näheres in der{" "}
            <Link href="/datenschutz" target="_blank">
              Datenschutzerklärung
            </Link>
            .
          </span>
        </label>
        {err("consent") ? <p className="mt-1.5 text-sm text-gold-light">{err("consent")}</p> : null}
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-gold-light sm:col-span-2">
          {state.message}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button type="submit" className="btn-gold w-full sm:w-auto" disabled={pending}>
          {pending ? "Wird gesendet …" : submitLabel}
        </button>
      </div>
    </form>
  );
}
