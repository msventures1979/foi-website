import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Vorschau-Umgebungen nie indexieren – und bis zum Umzug der Domain auch die Produktion nicht (NEXT_PUBLIC_NOINDEX=1)
  const isProduction = (process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true) && process.env.NEXT_PUBLIC_NOINDEX !== "1";
  return isProduction
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }], sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
