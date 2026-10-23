"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GA_ID } from "@/lib/site";

/**
 * Einwilligung für Google Analytics.
 * - GA lädt erst nach „Akzeptieren“, vorher werden weder Skript noch Cookies geladen.
 * - Auf internen Seiten (Verwaltung, persönliche Einladungen) wird nie gemessen – dort stehen Codes in der Adresse.
 * - Seitenaufrufe werden nur mit utm-Kampagnenparametern gemeldet, alle anderen Suchparameter bleiben bei uns.
 */

type Choice = "granted" | "denied";
const KEY = "foi_consent_v1";
const OPEN_EVENT = "foi:consent-open";
const PRIVATE = /^\/(admin|einladung|meine-teilnahme|api)(\/|$)/;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): Choice | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function saveChoice(c: Choice) {
  try {
    window.localStorage.setItem(KEY, c);
  } catch {
    /* privater Modus – die Wahl gilt dann nur für diesen Besuch */
  }
}

function loadGa() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag erwartet das arguments-Objekt, kein Array
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Bei Widerruf: Messung stoppen und die GA-Cookies entfernen */
function stopGa() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!name.startsWith("_ga")) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

/** Nur Kampagnen-Parameter (utm_…) weitergeben – alles andere bleibt bei uns */
function campaignParams() {
  const out = new URLSearchParams();
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (/^utm_(source|medium|campaign|term|content)$/.test(k)) out.set(k, v);
  });
  const q = out.toString();
  return q ? `?${q}` : "";
}

function pageView(pathname: string) {
  if (!window.gtag || PRIVATE.test(pathname)) return;
  // Titel ist nach einer Navigation erst einen Tick später gesetzt
  setTimeout(() => {
    window.gtag?.("event", "page_view", {
      page_location: `${window.location.origin}${pathname}${campaignParams()}`,
      page_path: pathname,
      page_title: document.title,
    });
  }, 0);
}

export function Consent() {
  const pathname = usePathname() || "/";
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);
  const isPrivate = PRIVATE.test(pathname);

  useEffect(() => {
    const c = readChoice();
    setChoice(c);
    if (c === null) setOpen(true);
    if (c === "granted") loadGa();
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (choice === "granted") pageView(pathname);
  }, [choice, pathname]);

  const decide = useCallback(
    (c: Choice) => {
      saveChoice(c);
      setOpen(false);
      if (c === "granted") {
        (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = false;
        loadGa();
        window.gtag?.("consent", "update", { analytics_storage: "granted" });
      } else if (choice === "granted") {
        stopGa();
      }
      setChoice(c);
    },
    [choice],
  );

  if (!open || isPrivate) return null;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-h" className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5">
      <div className="mx-auto max-w-[760px] border border-line border-t-gold bg-[#0d0d0d]/95 p-5 shadow-2xl backdrop-blur sm:p-6">
        <p id="consent-h" className="font-display text-lg font-semibold uppercase tracking-[0.02em] text-white">
          Darf Google Analytics mitzählen?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Wir möchten verstehen, welche Inhalte gelesen werden. Dafür setzt Google Analytics Cookies und überträgt Nutzungsdaten an Google, auch in die
          USA – nur mit Ihrer Einwilligung. Widerruf jederzeit über „Cookie-Einstellungen“ unten auf jeder Seite. Mehr in der{" "}
          <Link href="/datenschutz" className="underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <button type="button" onClick={() => decide("denied")} className="min-h-11 border border-white px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-black">
            Ablehnen
          </button>
          <button type="button" onClick={() => decide("granted")} className="min-h-11 border border-white bg-white px-6 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-gold hover:border-gold">
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}

/** Link im Footer und in der Datenschutzerklärung, um die Wahl zu ändern */
export function ConsentSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
