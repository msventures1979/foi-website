import type { NextConfig } from "next";

/**
 * Sicherheits-Header für alle Seiten. Die Seite lädt nichts von Drittanbietern
 * (Schriften, Bilder, Skripte liegen alle hier) – deshalb kann die CSP streng sein.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Vercel-Adressen (*.vercel.app) nie indexieren – nur frontlineofinnovation.de
      { source: "/:path*", has: [{ type: "host", value: ".*\\.vercel\\.app" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async redirects() {
    return [
      // Alte Adressen der Lovable-Seite
      { source: "/unzer-open-2026", destination: "/archiv/unzer-open-2026", permanent: true },
      { source: "/archive", destination: "/archiv", permanent: true },
      // Einladungslinks der alten Seite
      { source: "/inviteonly", destination: "/einladung", permanent: true },
      { source: "/rsvp", destination: "/einladung", permanent: true },
      // Verwaltungsbereiche der alten Seite
      { source: "/signin", destination: "/admin/login", permanent: true },
      { source: "/dashboard", destination: "/admin", permanent: true },
      { source: "/rsvp/dashboard", destination: "/admin", permanent: true },
      { source: "/sponsoren/dashboard/:path*", destination: "/admin", permanent: true },
      // Vertrags- und Tour-Links der alten Seite: bis Etappe 3 auf die Partnerseite
      { source: "/sponsor/vertrag", destination: "/sponsoring#anfrage", permanent: false },
      { source: "/tour/:slug", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
