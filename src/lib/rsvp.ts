import "server-only";
import { db } from "@/lib/supabase/admin";
import { normalizeCode } from "@/lib/codes";

export type RsvpEvent = {
  id: string;
  name: string;
  edition: number | null;
  starts_at: string | null;
  venue: string;
  address: string;
  details: string;
  rsvp_deadline: string | null;
  registration_open: boolean;
  closed_message: string;
  status: string;
};

export type RsvpInvitation = {
  id: string;
  code: string;
  manage_token: string;
  status: string;
  diet: string;
  allergies: string;
  phone: string;
  contacts: { salutation: string; title: string; first_name: string; last_name: string; email: string | null; company: string; linkedin: string };
  events: RsvpEvent;
};

const SELECT =
  "id, code, manage_token, status, diet, allergies, phone, contacts(salutation,title,first_name,last_name,email,company,linkedin), events(id,name,edition,starts_at,venue,address,details,rsvp_deadline,registration_open,closed_message,status)";

export async function invitationByCode(code: string): Promise<RsvpInvitation | null> {
  const { data } = await db().from("invitations").select(SELECT).eq("code", normalizeCode(code)).maybeSingle();
  return (data as unknown as RsvpInvitation) ?? null;
}

export async function invitationByToken(token: string): Promise<RsvpInvitation | null> {
  if (!/^[a-f0-9]{36}$/.test(token)) return null;
  const { data } = await db().from("invitations").select(SELECT).eq("manage_token", token).maybeSingle();
  return (data as unknown as RsvpInvitation) ?? null;
}

/** Kann man (noch) zusagen? Absagen geht immer, solange das Event nicht vorbei ist. */
export function canAccept(e: RsvpEvent) {
  if (e.status !== "aktiv" || !e.registration_open) return false;
  if (e.starts_at && new Date(e.starts_at).getTime() < Date.now()) return false;
  return true;
}

export function isOver(e: RsvpEvent) {
  return e.status === "abgeschlossen" || (e.starts_at ? new Date(e.starts_at).getTime() < Date.now() - 6 * 3600 * 1000 : false);
}

export { DIETS } from "@/lib/rsvp-shared";
