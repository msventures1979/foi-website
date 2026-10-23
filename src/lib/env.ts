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
  get hasDb() {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  },
};
