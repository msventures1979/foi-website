import { STATUS, type InvitationStatus } from "@/lib/status";

export function Notice({ text }: { text?: string }) {
  if (!text) return null;
  const bad = text.startsWith("Fehler");
  return (
    <p role="status" className={`mb-6 border-l-2 px-4 py-3 text-sm ${bad ? "border-red-500 bg-red-950/30" : "border-gold bg-card"}`}>
      {text}
    </p>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = STATUS[status as InvitationStatus];
  return (
    <span className="pill" style={{ borderColor: s?.color ?? "#444", color: s?.color ?? "#ccc" }}>
      {s?.label ?? status}
    </span>
  );
}

export function H1({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-4xl font-bold uppercase leading-none">{children}</h1>
      {sub ? <p className="mt-2 text-sm text-muted">{sub}</p> : null}
    </div>
  );
}

export function fmtDateTime(iso: string | null | undefined) {
  if (!iso) return "–";
  return new Date(iso).toLocaleString("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}
