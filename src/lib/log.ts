import "server-only";
import { db } from "@/lib/supabase/admin";

export async function logActivity(actor: string, action: string, entity = "", entityId = "", payload: Record<string, unknown> = {}) {
  const { error } = await db().from("activity_log").insert({ actor, action, entity, entity_id: entityId, payload });
  if (error) console.error("activity_log", error);
}
