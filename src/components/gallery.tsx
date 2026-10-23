"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/editions";

/** Bildraster mit Vollbildansicht (Pfeiltasten, Esc, Wischen auf dem Handy). */
export function Gallery({ photos, credit }: { photos: Photo[]; credit?: string }) {
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
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.src}>
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
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                className="photo aspect-[3/2] w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:[filter:none]"
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
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 text-sm text-dim">
              <span>
                {open! + 1} / {photos.length}
              </span>
              <button type="button" onClick={close} className="btn-ghost !min-h-10 !px-4" autoFocus>
                Schließen
              </button>
            </div>
            <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && close()}>
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex justify-center gap-3 px-4 py-4">
              <button type="button" onClick={() => step(-1)} className="btn-ghost" aria-label="Vorheriges Bild">
                ←
              </button>
              <button type="button" onClick={() => step(1)} className="btn-ghost" aria-label="Nächstes Bild">
                →
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
