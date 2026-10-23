/** Öffentliche Basisadresse – auch im Browser nutzbar. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://frontlineofinnovation.de").replace(/\/$/, "");
export const SITE_NAME = "Frontline of Innovation";
export const CONTACT_MAIL = "info@frontlineofinnovation.de";

/** Google-Analytics-Property (dieselbe wie auf der bisherigen Seite) – lädt nur nach Einwilligung */
export const GA_ID = "G-H3TRD9TZB6";
