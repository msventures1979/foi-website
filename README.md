# frontlineofinnovation.de

Website von Frontline of Innovation – Next.js 15 (App Router), Tailwind 4, Supabase, Resend, Vercel.
Neubau der bisherigen Lovable-Seite, gleicher Stack wie `racing.frontlineofinnovation.de`.

## Etappen
- **0 – Sicherung** ✓ Daten, Rechnungs-PDFs und extern gehostete Bilder der Lovable-Seite liegen in Dropbox `FOI/_Lovable-Export_2026-10-23/`.
- **1 – Öffentliche Seiten** ✓ Startseite, Archiv mit Editionsseiten, Unzer Open, Partner werden, Tickets (noindex), Impressum, Datenschutz, Formulare.
- **2 – Gäste** Einladungscodes, Anmeldung/Absage, Admin-Login per Magic Link, Mailversand.
- **3 – Sponsoren** Verträge, Bestätigung per Link, Ticket-Sponsoren, Rechnungen (Nummernkreise fortführen).
- **4 – Umzug** DNS `@`/`www` bei IONOS auf Vercel, Lovable abschalten, Wix kündigen, Resend Pro.

## Grundsätze
- Kein Supabase-Zugriff aus dem Browser. RLS überall an, keine Policies, Zugriff nur serverseitig mit Service-Key.
- Keine Drittanbieter-Einbindungen (Schriften lokal, keine Videos/Karten/Tracker) → kein Cookie-Banner nötig.
- `/tickets` ist bewusst nicht verlinkt, nicht in der Sitemap und `noindex`.
- Inhalte der Editionen: `src/content/editions.ts`, Partner: `src/content/partners.ts`, Rechtstexte: `src/content/legal.tsx`.

## Einrichtung
1. Supabase: Projekt „foi-website“ in der Organisation „msventures1979“ (Ref `vipuxnjvgbyegrmqhvyw`, Region Irland), Migrationen aus `supabase/migrations/` im SQL-Editor ausführen.
2. Vercel: Projekt aus diesem Repo, Region `fra1`, Variablen wie in `.env.example` (Schlüssel als „Secret“).
3. Lokal: `.env.local` nach `.env.example`, dann `npm install` und `npm run dev`.
