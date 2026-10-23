import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const oswald = localFont({
  variable: "--font-oswald",
  display: "swap",
  src: [
    { path: "../fonts/Oswald-Regular.ttf", weight: "400" },
    { path: "../fonts/Oswald-SemiBold.ttf", weight: "600" },
    { path: "../fonts/Oswald-Bold.ttf", weight: "700" },
  ],
});

const archivo = localFont({
  variable: "--font-archivo",
  display: "swap",
  src: [
    { path: "../fonts/Archivo-Regular.ttf", weight: "400" },
    { path: "../fonts/Archivo-Medium.ttf", weight: "500" },
    { path: "../fonts/Archivo-Medium.ttf", weight: "600" },
  ],
});

const description =
  "Frontline of Innovation bringt Entscheider aus Wirtschaft, Sport, Wissenschaft und Politik an einen Tisch – in Mannheim, an wechselnden Orten, auf persönliche Einladung.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} – Dinner in Mannheim`, template: `%s – ${SITE_NAME}` },
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "de_DE",
    title: `${SITE_NAME} – Dinner in Mannheim`,
    description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image" },
  // bis zum Umzug der Domain: NEXT_PUBLIC_NOINDEX=1 in Vercel
  ...(process.env.NEXT_PUBLIC_NOINDEX === "1" || (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production")
    ? { robots: { index: false, follow: false } }
    : {}),
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${oswald.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
