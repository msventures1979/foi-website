/**
 * Alle bisherigen Abende. Reihenfolge = Reihenfolge der Editionen.
 * Daten nur dort, wo sie belegt sind – fehlende Daten bewusst leer lassen statt raten.
 */

export type Photo = { src: string; thumb: string; alt: string };

export type Edition = {
  slug: string;
  number: number;
  venue: string;
  city: string;
  /** Anzeige wie „Mai 2026“ – nur wenn belegt */
  period?: string;
  /** ISO-Datum für strukturierte Daten – nur wenn belegt */
  date?: string;
  cover: string;
  /** Kurzer Rückblick, eigener Absatz pro Eintrag */
  summary?: string[];
  program?: { time?: string; title: string; detail?: string }[];
  photos?: Photo[];
  photoCredit?: string;
};

function photos(folder: string, count: number, alt: string): Photo[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      src: `/images/archiv/${folder}/${n}.webp`,
      thumb: `/images/archiv/${folder}/${n}-klein.webp`,
      alt: `${alt}, Bild ${i + 1}`,
    };
  });
}

export const editions: Edition[] = [
  {
    slug: "oben-restaurant",
    number: 1,
    venue: "OBEN Restaurant",
    city: "Mannheim",
    cover: "/images/editions/1_oben-restaurant.webp",
  },
  {
    slug: "opus-v",
    number: 2,
    venue: "OPUS V",
    city: "Mannheim",
    cover: "/images/editions/2_opus-v.webp",
  },
  {
    slug: "koros",
    number: 3,
    venue: "KOROS",
    city: "Mannheim",
    cover: "/images/editions/3_koros.webp",
  },
  {
    slug: "sap-arena",
    number: 4,
    venue: "SAP Arena",
    city: "Mannheim",
    cover: "/images/editions/4_sap-arena.webp",
  },
  {
    slug: "christuskirche-2025",
    number: 5,
    venue: "Christuskirche",
    city: "Mannheim",
    period: "Mai 2025",
    cover: "/images/editions/5_christuskirche.webp",
    summary: [
      "Die fünfte Edition fand in der Christuskirche statt, einem der markantesten Bauten der Stadt.",
    ],
    photos: photos("2025-05", 16, "Frontline of Innovation in der Christuskirche Mannheim"),
  },
  {
    slug: "fernmeldeturm-2025",
    number: 6,
    venue: "Fernmeldeturm",
    city: "Mannheim",
    period: "November 2025",
    date: "2025-11-20",
    cover: "/images/editions/6_fernmeldeturm.webp",
    summary: [
      "Die sechste Edition führte auf den Fernmeldeturm: Bühne, Podium und Dinner hoch über der Stadt.",
    ],
    photos: photos("2025-11", 16, "Frontline of Innovation auf dem Fernmeldeturm Mannheim"),
  },
  {
    slug: "alte-schildkroetfabrik-2026",
    number: 7,
    venue: "Alte Schildkrötfabrik",
    city: "Mannheim",
    period: "Mai 2026",
    date: "2026-05-20",
    cover: "/images/editions/7_alte-schildkroetfabrik.webp",
    summary: [
      "Die siebte Edition fand am 20. Mai 2026 in der Alten Schildkrötfabrik statt, unter der Schirmherrschaft von Oberbürgermeister Christian Specht.",
      "Finanzminister Dr. Danyal Bayaz sprach zu den Gästen, Oliver Bierhoff stand im Gespräch mit den Gastgebern Rede und Antwort. Auf dem Podium diskutierten Melanie Fichtner (TSG 1899 Hoffenheim), Holger Siegmund-Schultze (Karlsruher SC) und Denni Strich (SV Waldhof Mannheim).",
    ],
    program: [
      { time: "17:30", title: "Empfang" },
      { time: "18:00", title: "Begrüßung", detail: "Matthias Storch und Süleyman Acar" },
      { time: "18:15", title: "Grußwort", detail: "Oberbürgermeister Christian Specht, Schirmherr" },
      { time: "18:30", title: "Grußwort", detail: "Dr. Danyal Bayaz, Finanzminister des Landes Baden-Württemberg" },
      { time: "18:45", title: "Im Gespräch", detail: "Oliver Bierhoff" },
      { time: "19:30", title: "Podium", detail: "Melanie Fichtner, Holger Siegmund-Schultze, Denni Strich" },
      { time: "20:00", title: "Dinner" },
    ],
    photos: photos("2026-05", 20, "Frontline of Innovation in der Alten Schildkrötfabrik Mannheim"),
  },
];

/** Formate außerhalb der Dinner-Reihe, die im Archiv stehen. */
export const specials = [
  {
    slug: "unzer-open-2026",
    title: "Unzer Open 2026",
    venue: "Golf Club St. Leon-Rot",
    period: "Juni 2026",
    date: "2026-06-10",
    cover: "/images/archiv/unzer-open-golfplatz.webp",
  },
];

export const latestEdition = editions[editions.length - 1];

export function editionBySlug(slug: string) {
  return editions.find((e) => e.slug === slug);
}
