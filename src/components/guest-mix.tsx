import { branchen, INVITE_LIST_SIZE } from "@/content/branchen";

/** Große Zahl der Einladungsliste plus Branchenverteilung als Balken */
export function GuestMix({ headingId, title = "Wer am Tisch sitzt" }: { headingId: string; title?: string }) {
  // Skala bis 20 %, damit die Balken untereinander vergleichbar bleiben
  const max = 20;
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-16">
      <div>
        <p className="eyebrow">{title}</p>
        <p className="mt-4 font-display text-[clamp(72px,11vw,140px)] font-bold leading-[0.85]">{INVITE_LIST_SIZE}</p>
        <h2 id={headingId} className="mt-4 font-display text-[clamp(22px,2.6vw,30px)] font-semibold uppercase leading-tight">
          Entscheider auf unserer Einladungsliste
        </h2>
        <p className="mt-4 max-w-md leading-relaxed text-muted">
          Gründer, Unternehmer, Investoren und Verantwortliche aus Politik und Sport – aus der Metropolregion Rhein-Neckar und darüber hinaus. Je
          Abend sitzen bis zu 200 von ihnen an einem Tisch.
        </p>
      </div>
      <figure>
        <figcaption className="text-[11px] uppercase tracking-[0.24em] text-dim">Verteilung nach Branchen</figcaption>
        <ul className="mt-5 space-y-4">
          {branchen.map((b, i) => {
            const rest = i === branchen.length - 1;
            return (
              <li key={b.label}>
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className={rest ? "text-muted" : "text-white"}>{b.label}</span>
                  <span className="shrink-0 whitespace-nowrap font-display text-lg font-semibold tabular-nums text-white">{b.share} %</span>
                </div>
                <div className="mt-1.5 h-1.5 bg-[#1c1c1c]" aria-hidden>
                  <div className={`h-full ${rest ? "bg-[#555]" : "bg-gold"}`} style={{ width: `${Math.min(100, (b.share / max) * 100)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </figure>
    </div>
  );
}
