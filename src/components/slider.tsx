"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Bildwechsler mit Punkten, wechselt alle 5 Sekunden (pausiert bei reduzierter Bewegung). */
export function Slider({ images, caption }: { images: { src: string; alt: string }[]; caption?: React.ReactNode }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-card">
      {images.map((img, n) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width: 1024px) 980px, 100vw"
          className={`object-cover transition-opacity duration-1000 ${n === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
      {caption ? <div className="absolute bottom-0 left-0 p-5 sm:p-8">{caption}</div> : null}
      <div className="absolute bottom-5 right-5 flex gap-2 sm:bottom-8 sm:right-8">
        {images.map((img, n) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Bild ${n + 1} von ${images.length}`}
            aria-current={n === i}
            className={`h-2 w-2 rounded-full ${n === i ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
