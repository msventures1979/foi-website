import type { MetadataRoute } from "next";
import { editions } from "@/content/editions";
import { SITE_URL } from "@/lib/site";

/** Bewusst ohne /tickets – die Seite wird nur gezielt an Partner verschickt. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/archiv", "/archiv/unzer-open-2026", "/sponsoring", "/impressum", "/datenschutz"];
  const archive = editions.filter((e) => e.photos).map((e) => `/archiv/${e.slug}`);
  const lastModified = new Date("2026-10-23");
  return [...pages, ...archive].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified,
    priority: p === "" ? 1 : p.startsWith("/archiv/") ? 0.6 : p === "/impressum" || p === "/datenschutz" ? 0.2 : 0.8,
  }));
}
