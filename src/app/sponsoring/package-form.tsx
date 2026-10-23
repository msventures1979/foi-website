"use client";

import { useSearchParams } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { SPONSOR_PACKAGES } from "@/lib/inquiry";

/** Übernimmt das per „Anfragen“ gewählte Paket (?paket=…) ins Formular. */
export function PackageForm() {
  const p = useSearchParams().get("paket") ?? "";
  const preset = (SPONSOR_PACKAGES as readonly string[]).includes(p) ? { topic: p } : undefined;
  return <InquiryForm key={p} kind="sponsoring" preset={preset} submitLabel="Anfrage senden" />;
}
