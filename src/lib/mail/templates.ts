/**
 * Mailvorlagen für Einladungen. Ton laut FOI-Markenregeln: „Sie“, gehoben, knapp, keine Ausrufezeichen,
 * pro Mail genau eine Handlung. Mails mit offenen Platzhaltern wie „[Treffpunkt]“ werden nie verschickt.
 */

export type MailType = "einladung" | "erinnerung" | "zusage" | "absage";

export const MAIL_LABEL: Record<MailType, string> = {
  einladung: "Einladung mit Code",
  erinnerung: "Erinnerung an offene Einladung",
  zusage: "Bestätigung der Zusage",
  absage: "Bestätigung der Absage",
};

/** Massenmails, die der Admin bewusst auslöst – die übrigen gehen automatisch raus */
export const BULK_TYPES: MailType[] = ["einladung", "erinnerung"];

export type MailPerson = {
  salutation: string;
  title: string;
  first_name: string;
  last_name: string;
};

export type MailEvent = {
  name: string;
  edition: number | null;
  starts_at: string | null;
  venue: string;
  address: string;
  details: string;
  rsvp_deadline: string | null;
};

export interface MailContext {
  person: MailPerson;
  event: MailEvent;
  code: string;
  manageToken: string;
  siteUrl: string;
}

export interface RenderedMail {
  subject: string;
  html: string;
  text: string;
}

const GRUSS = "Herzliche Grüße aus Mannheim\nMatthias Storch und Süleyman Acar";

type Block = { p: string } | { facts: string } | { code: string } | { button: { label: string; href: string } } | { small: string };

export function briefanrede(p: MailPerson): string {
  const n = (...x: (string | null | undefined)[]) => x.map((s) => s?.trim()).filter(Boolean).join(" ");
  if (p.salutation === "Herr") return `Sehr geehrter ${n("Herr", p.title, p.last_name)},`;
  if (p.salutation === "Frau") return `Sehr geehrte ${n("Frau", p.title, p.last_name)},`;
  return `Guten Tag ${n(p.title, p.first_name, p.last_name)},`;
}

export function fmtEventDate(iso: string | null, withTime = true): string {
  if (!iso) return "[Datum]";
  const d = new Date(iso);
  const date = d.toLocaleDateString("de-DE", { timeZone: "Europe/Berlin", weekday: "long", day: "numeric", month: "long", year: "numeric" });
  if (!withTime) return date;
  const time = d.toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time} Uhr`;
}

function fmtDeadline(d: string | null) {
  if (!d) return "";
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("de-DE", { day: "numeric", month: "long" });
}

function shortDate(iso: string | null) {
  if (!iso) return "[Datum]";
  return new Date(iso).toLocaleDateString("de-DE", { timeZone: "Europe/Berlin", day: "numeric", month: "long" });
}

export function renderMail(type: MailType, ctx: MailContext): RenderedMail {
  const { event: e, code } = ctx;
  const link = `${ctx.siteUrl}/einladung?code=${encodeURIComponent(code)}`;
  const verwalten = `${ctx.siteUrl}/meine-teilnahme/${ctx.manageToken}`;
  const fakten = [fmtEventDate(e.starts_at), [e.venue || "[Ort]", e.address].filter(Boolean).join(", ")].join("\n");
  const frist = e.rsvp_deadline ? ` Bitte geben Sie uns bis zum ${fmtDeadline(e.rsvp_deadline)} Bescheid.` : "";
  const titel = e.edition ? `${e.edition}. Edition` : e.name;

  let subject = "";
  let blocks: Block[] = [];

  switch (type) {
    case "einladung":
      subject = `Frontline of Innovation – Ihre Einladung zum Dinner am ${shortDate(e.starts_at)}`;
      blocks = [
        { p: `wir laden Sie herzlich zur ${titel} von Frontline of Innovation ein – einem Abend mit Impuls, Podium und Dinner, zu dem wir Entscheider aus Wirtschaft, Sport, Wissenschaft und Politik an einen Tisch holen.` },
        { facts: fakten },
        { p: `Die Teilnahme ist für Sie kostenfrei. Mit Ihrem persönlichen Code können Sie sich anmelden.${frist}` },
        { code },
        { button: { label: "Teilnahme bestätigen", href: link } },
      ];
      break;
    case "erinnerung":
      subject = "Erinnerung: Ihr Platz beim FOI-Dinner";
      blocks = [
        { p: `Ihre Einladung zur ${titel} am ${shortDate(e.starts_at)} ist noch offen.${frist}` },
        { code },
        { button: { label: "Zu- oder absagen", href: link } },
      ];
      break;
    case "zusage":
      subject = `Bestätigt: Frontline of Innovation am ${shortDate(e.starts_at)}`;
      blocks = [
        { p: "vielen Dank für Ihre Zusage – wir freuen uns auf Sie." },
        { facts: fakten + (e.details ? `\n${e.details}` : "") },
        { p: "Falls sich Ihre Pläne ändern, sagen Sie bitte über diesen Link ab, damit wir den Platz weitergeben können." },
        { button: { label: "Teilnahme verwalten", href: verwalten } },
      ];
      break;
    case "absage":
      subject = `Ihre Absage: Frontline of Innovation am ${shortDate(e.starts_at)}`;
      blocks = [
        { p: "schade, dass Sie diesmal nicht dabei sein können. Ihre Absage ist bei uns angekommen." },
        { p: "Wir freuen uns, Sie bei einer der nächsten Runden zu sehen." },
        { small: `Falls Sie es sich anders überlegen: ${verwalten}` },
      ];
      break;
  }

  const anrede = briefanrede(ctx.person);
  const text = toText(anrede, blocks);
  const open = text.match(/\[[^\]\n]{2,}\]/g);
  if (open) throw new MailPlaceholderError(`„${MAIL_LABEL[type]}“ enthält noch Platzhalter: ${[...new Set(open)].join(", ")}`);
  return { subject, text, html: toHtml(anrede, blocks, ctx.siteUrl) };
}

export class MailPlaceholderError extends Error {}

/** Leere Vorschau-Daten für die Admin-Ansicht */
export function previewContext(event: MailEvent, siteUrl: string): MailContext {
  return {
    person: { salutation: "Frau", title: "Dr.", first_name: "Erika", last_name: "Musterfrau" },
    event,
    code: "FOI-ABC234",
    manageToken: "beispiel",
    siteUrl,
  };
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function toText(anrede: string, blocks: Block[]) {
  const parts = [anrede];
  for (const b of blocks) {
    if ("p" in b) parts.push(b.p);
    if ("facts" in b) parts.push(b.facts);
    if ("code" in b) parts.push(`Ihr persönlicher Code: ${b.code}`);
    if ("button" in b) parts.push(`${b.button.label}: ${b.button.href}`);
    if ("small" in b) parts.push(b.small);
  }
  parts.push(GRUSS, "—\nFrontline of Innovation · info@frontlineofinnovation.de");
  return parts.join("\n\n");
}

function toHtml(anrede: string, blocks: Block[], siteUrl: string) {
  const body = blocks
    .map((b) => {
      if ("p" in b) return `<p style="margin:0 0 16px">${esc(b.p)}</p>`;
      if ("facts" in b)
        return `<p style="margin:0 0 16px;padding:14px 16px;border-left:3px solid #E6941A;background:#f6f6f4;font-size:15px">${esc(b.facts).replace(/\n/g, "<br>")}</p>`;
      if ("code" in b)
        return `<p style="margin:0 0 16px">Ihr persönlicher Code:<br><span style="display:inline-block;margin-top:6px;padding:8px 14px;background:#000;color:#fff;font-family:'Courier New',monospace;font-size:20px;letter-spacing:3px">${esc(b.code)}</span></p>`;
      if ("button" in b)
        return `<p style="margin:8px 0 20px"><a href="${esc(b.button.href)}" style="display:inline-block;padding:13px 24px;background:#E6941A;color:#000;font-weight:bold;text-decoration:none;border-radius:2px">${esc(b.button.label)}</a></p>`;
      if ("small" in b) return `<p style="margin:0 0 16px;font-size:13px;color:#666">${esc(b.small)}</p>`;
      return "";
    })
    .join("\n");

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#efefed">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efefed"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff">
<tr><td style="background:#000;padding:22px 28px"><img src="${siteUrl}/images/foi-logo.png" alt="Frontline of Innovation" height="36" style="display:block;height:36px"></td></tr>
<tr><td style="height:4px;background:#E6941A;line-height:4px;font-size:0">&nbsp;</td></tr>
<tr><td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#1a1a1a">
<p style="margin:0 0 16px">${esc(anrede)}</p>
${body}
<p style="margin:24px 0 0">${esc(GRUSS).replace(/\n/g, "<br>")}</p>
</td></tr>
<tr><td style="padding:24px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888">Frontline of Innovation · <a href="mailto:info@frontlineofinnovation.de" style="color:#888">info@frontlineofinnovation.de</a></td></tr>
</table></td></tr></table></body></html>`;
}
