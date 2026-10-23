import { env } from "@/lib/env";
import { processQueue } from "@/lib/mail/queue";

export const dynamic = "force-dynamic";

/** Versendet Mails, die wegen des Tageslimits liegen geblieben sind. Aufruf durch Vercel Cron mit CRON_SECRET. */
export async function GET(req: Request) {
  const secret = env.cronSecret;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Nicht erlaubt", { status: 401 });
  const r = await processQueue(80);
  return Response.json(r);
}
