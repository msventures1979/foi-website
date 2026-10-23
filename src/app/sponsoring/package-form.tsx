"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { SPONSOR_PACKAGES } from "@/lib/inquiry";

/** Übernimmt das per „Anfragen“ gewählte Paket (?paket=…) ins Formular und springt dorthin. */
export function PackageForm() {
  const p = useSearchParams().get("paket") ?? "";
  const valid = (SPONSOR_PACKAGES as readonly string[]).includes(p);
  useEffect(() => {
    if (!valid) return;
    const el = document.getElementById("anfrage");
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    // Fokus ins erste Feld, damit Tastatur- und Screenreader-Nutzer direkt weiterschreiben können
    el.querySelector<HTMLInputElement>("input:not([type=hidden]):not([tabindex='-1'])")?.focus({ preventScroll: true });
  }, [p, valid]);
  return <InquiryForm key={p} kind="sponsoring" preset={valid ? { topic: p } : undefined} submitLabel="Anfrage senden" />;
}
