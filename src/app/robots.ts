import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Vorschau-Umgebungen (z. B. *.vercel.app) nie indexieren
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return isProduction
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }], sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
