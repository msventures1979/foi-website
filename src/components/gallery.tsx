"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/editions";

/** Bildraster mit Vollbildansicht (Pfeiltasten, Esc, Wischen auf dem Handy). */
export function Gallery({ photos, credit, color = false }: { photos: Photo[]; credit?: string; color?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const show = useCallback((i: number) => {
    setOpen(i);
    dialogRef.current?.showModal();
  }, []);
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setOpen(null);
    dlg.addEventListener("keydown", onKey);
    dlg.addEventListener("close", onClose);
    return () => {
      dlg.removeEventListener("keydown", onKey);
      dlg.removeEventListener("close", onClose);
    };
  }, [step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="grid grid-cols-3 gap-1 sm:gap-2 lg:grid-cols-4">
        {photos.map((p, i) => (
          // unvollständige letzte Reihe im 3er-Raster ausblenden (Vollbildansicht zeigt trotzdem alle)
          <li key={p.src} className={i >= Math.floor(photos.length / 3) * 3 ? "hidden lg:block" : undefined}>
            <button
              type="button"
              onClick={() => show(i)}
              className="group block w-full cursor-zoom-in overflow-hidden bg-card"
              aria-label={`${p.alt} vergrößern`}
            >
              <Image
                src={p.thumb}
                alt={p.alt}
                width={640}
                height={427}
                sizes="(min-width: 1024px) 300px, 33vw"
                className={`${color ? "" : "photo group-hover:[filter:none]"} aspect-[3/2] w-full object-cover transition duration-500 group-hover:scale-[1.03]`}
              />
            </button>
          </li>
        ))}
      </ul>
      {credit ? <p className="mt-3 text-xs text-dim">{credit}</p> : null}

      <dialog
        ref={dialogRef}
        aria-label="Bildansicht"
        className="m-0 h-full max-h-none w-full max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current ? (
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 text-sm text-muted sm:px-6">
              <span className="tabular-nums">
                {open! + 1} / {photos.length}
              </span>
              <button type="button" onClick={close} className="inline-flex h-11 items-center gap-2 px-2 text-sm uppercase tracking-[0.16em] text-white hover:text-gold" autoFocus>
                Schließen <span aria-hidden className="text-2xl leading-none">×</span>
              </button>
            </div>
            <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && close()}>
              <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Vorheriges Bild"
                className="absolute left-2 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/70 text-4xl leading-none text-white hover:bg-white hover:text-black sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Nächstes Bild"
                className="absolute right-2 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/70 text-4xl leading-none text-white hover:bg-white hover:text-black sm:right-6"
              >
                ›
              </button>
            </div>
            <ul className="hidden gap-1.5 overflow-x-auto px-4 py-4 sm:flex lg:justify-center">
              {photos.map((p, i) => (
                <li key={p.src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-label={`Bild ${i + 1}`}
                    aria-current={i === open}
                    className={`block h-12 w-[72px] overflow-hidden ${i === open ? "outline outline-2 outline-white" : "opacity-50 hover:opacity-100"}`}
                  >
                    <Image src={p.thumb} alt="" width={144} height={96} className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
