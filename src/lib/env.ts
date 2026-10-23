import "server-only";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Umgebungsvariable ${name} fehlt`);
  return v;
}

export const env = {
  get supabaseUrl() {
    return req("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseServiceKey() {
    return req("SUPABASE_SERVICE_ROLE_KEY");
  },
  get resendKey() {
    return process.env.RESEND_API_KEY ?? "";
  },
  get mailFrom() {
    return process.env.MAIL_FROM ?? "Frontline of Innovation <info@frontlineofinnovation.de>";
  },
  get notifyTo() {
    return (process.env.NOTIFY_TO ?? "info@frontlineofinnovation.de")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  },
  get siteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://frontlineofinnovation.de").replace(/\/$/, "");
  },
  /** Öffentliche Adresse für Links in Mails – auf der Vorschau die Vercel-Adresse */
  get publicUrl() {
    if (process.env.MAIL_LINK_BASE) return process.env.MAIL_LINK_BASE.replace(/\/$/, "");
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL && process.env.NEXT_PUBLIC_NOINDEX === "1") return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    return this.siteUrl;
  },
  get mailDailyLimit() {
    return Number(process.env.MAIL_DAILY_LIMIT ?? "100");
  },
  get cronSecret() {
    return process.env.CRON_SECRET ?? "";
  },
  get hasDb() {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  },
};
