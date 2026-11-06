"use client";

import { Analytics } from "@vercel/analytics/next";

/**
 * Vercel Web Analytics: ohne Cookies, ohne Einwilligung.
 * Persönliche Einladungsseiten und die Verwaltung werden nicht gemessen,
 * Abfrageparameter (z. B. Einladungscodes) werden entfernt – nur utm_* bleiben.
 */
const SKIP = [/^\/admin/, /^\/einladung/, /^\/meine-teilnahme/];

export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = new URL(event.url);
        if (SKIP.some((re) => re.test(url.pathname))) return null;
        const keep = new URLSearchParams();
        url.searchParams.forEach((v, k) => {
          if (k.startsWith("utm_")) keep.set(k, v);
        });
        url.search = keep.toString();
        return { ...event, url: url.toString() };
      }}
    />
  );
}
