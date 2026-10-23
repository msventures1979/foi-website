"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { DIETS } from "@/lib/rsvp-shared";
import { lookupCode, respond, type RsvpState } from "./actions";

const idle: RsvpState = { status: "idle" };

export function CodeForm({ initial = "" }: { initial?: string }) {
  const [state, action, pending] = useActionState(lookupCode, idle);
  return (
    <form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="code" className="sr-only">
        Ihr Einladungscode
      </label>
      <input
        id="code"
        name="code"
        defaultValue={initial}
        placeholder="FOI-XXXXXX"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        className="field flex-1 text-center font-mono text-lg uppercase tracking-[0.2em] sm:text-left"
        aria-invalid={state.status === "error" || undefined}
        aria-describedby={state.message ? "code-msg" : undefined}
      />
      <button type="submit" className="btn-gold" disabled={pending}>
        {pending ? "Prüfe …" : "Weiter"}
      </button>
      {state.message ? (
        <p id="code-msg" role="alert" className="text-sm text-gold-light sm:basis-full">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function RsvpForm({
  code,
  token,
  canAccept,
  current,
}: {
  code?: string;
  token?: string;
  canAccept: boolean;
  current: { status: string; diet: string; allergies: string; phone: string };
}) {
  const [state, action, pending] = useActionState(respond, idle);
  const [decision, setDecision] = useState<"zusage" | "absage" | "">(current.status === "zugesagt" ? "zusage" : "");
  const err = (k: string) => state.errors?.[k];

  return (
    <form action={action} className="space-y-8">
      {code ? <input type="hidden" name="code" value={code} /> : null}
      {token ? <input type="hidden" name="token" value={token} /> : null}

      <fieldset>
        <legend className="lbl !text-sm">Ihre Antwort</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {canAccept || current.status === "zugesagt" ? (
            <label className={`flex cursor-pointer items-center gap-3 border p-5 ${decision === "zusage" ? "border-gold bg-[#141414]" : "border-line-strong"}`}>
              <input type="radio" name="decision" value="zusage" checked={decision === "zusage"} onChange={() => setDecision("zusage")} className="h-5 w-5 accent-[var(--color-gold)]" />
              <span>
                <span className="block font-display text-xl font-semibold uppercase">Ich bin dabei</span>
                <span className="text-sm text-muted">{current.status === "zugesagt" ? "Angaben ändern" : "Zusage"}</span>
              </span>
            </label>
          ) : null}
          <label className={`flex cursor-pointer items-center gap-3 border p-5 ${decision === "absage" ? "border-white bg-[#141414]" : "border-line-strong"}`}>
            <input type="radio" name="decision" value="absage" checked={decision === "absage"} onChange={() => setDecision("absage")} className="h-5 w-5 accent-white" />
            <span>
              <span className="block font-display text-xl font-semibold uppercase">Leider nicht</span>
              <span className="text-sm text-muted">Absage</span>
            </span>
          </label>
        </div>
      </fieldset>

      {decision === "zusage" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <span className="lbl">
              Menü <span className="text-gold">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <label key={d} className="chk border border-line-strong px-4 py-2.5">
                  <input type="radio" name="diet" value={d} defaultChecked={current.diet === d} />
                  <span>{d}</span>
                </label>
              ))}
            </div>
            {err("diet") ? <p className="mt-1.5 text-sm text-gold-light">{err("diet")}</p> : null}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="allergies" className="lbl">
              Allergien oder Unverträglichkeiten (freiwillig)
            </label>
            <input id="allergies" name="allergies" defaultValue={current.allergies} className="field" maxLength={500} />
            <label className="chk mt-3 text-sm">
              <input type="checkbox" name="allergiesConsent" defaultChecked={Boolean(current.allergies)} />
              <span>
                Ich willige ein, dass diese Angaben zu Allergien ausschließlich für die Planung des Menüs verarbeitet und nach dem Abend gelöscht werden.
              </span>
            </label>
            {err("allergiesConsent") ? <p className="mt-1.5 text-sm text-gold-light">{err("allergiesConsent")}</p> : null}
          </div>
          <div>
            <label htmlFor="phone" className="lbl">
              Mobilnummer für kurzfristige Hinweise (freiwillig)
            </label>
            <input id="phone" name="phone" type="tel" defaultValue={current.phone} className="field" autoComplete="tel" maxLength={40} />
          </div>
          <div className="sm:col-span-2">
            <label className="chk">
              <input type="checkbox" name="terms" defaultChecked={current.status === "zugesagt"} />
              <span>
                Ich habe die <Link href="/datenschutz" target="_blank">Hinweise zum Datenschutz</Link> gelesen. Beim Abend wird fotografiert.
              </span>
            </label>
            {err("terms") ? <p className="mt-1.5 text-sm text-gold-light">{err("terms")}</p> : null}
          </div>
        </div>
      ) : null}

      {state.message ? (
        <p role="alert" className="text-sm text-gold-light">
          {state.message}
        </p>
      ) : null}

      {decision ? (
        <button type="submit" className={decision === "zusage" ? "btn-gold w-full sm:w-auto" : "btn-ghost w-full sm:w-auto"} disabled={pending}>
          {pending ? "Wird gespeichert …" : decision === "zusage" ? (current.status === "zugesagt" ? "Angaben speichern" : "Verbindlich zusagen") : "Absagen"}
        </button>
      ) : null}
    </form>
  );
}
