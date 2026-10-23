import "server-only";
import { randomInt } from "node:crypto";

// Ohne leicht verwechselbare Zeichen (0/O, 1/I/L)
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Einladungscode im bisherigen Format FOI-XXXXXX */
export function newInvitationCode() {
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `FOI-${s}`;
}

export function normalizeCode(input: string) {
  const s = input.trim().toUpperCase().replace(/\s+/g, "");
  return s.startsWith("FOI-") ? s : s.startsWith("FOI") ? `FOI-${s.slice(3)}` : `FOI-${s}`;
}
