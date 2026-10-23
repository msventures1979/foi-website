import type { MetadataRoute } from "next";
import { editions } from "@/content/editions";
import { SITE_URL } from "@/lib/site";

/** Bewusst ohne /tickets – die Seite wird nur gezielt an Partner verschickt. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/archiv", "/archiv/unzer-open-2026", "/sponsoring", "/impressum", "/datenschutz"];
  const archive = editions.filter((e) => e.photos).map((e) => `/archiv/${e.slug}`);
  return [...pages, ...archive].map((p) => ({ url: `${SITE_URL}${p}` }));
}
