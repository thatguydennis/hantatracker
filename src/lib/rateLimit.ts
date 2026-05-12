import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Tiny Supabase-backed rate limiter. Free, no Upstash / Redis dependency.
 *
 * - Keys are derived from request IP + an environment salt, then SHA-256'd.
 *   Raw IPs are never stored.
 * - Each call inserts one row and counts hits inside the window.
 * - Old rows older than 2× the longest window are pruned probabilistically
 *   (1-in-20 calls trigger a delete) so the table doesn't grow forever.
 */

const SALT = process.env.RATE_LIMIT_SALT ?? "hanta-rate-limit-default-salt";
const PRUNE_OLDER_THAN_HOURS = 24;

export function clientKey(req: Request): string {
  // Vercel sets x-forwarded-for; fall back to a remote-addr proxy header.
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const ip = xff.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return crypto.createHash("sha256").update(`${SALT}:${ip}`).digest("hex");
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Returns whether the request should be allowed and how many hits are left
 * in the current window. Side-effect: inserts a hit row when `allowed`.
 */
export async function rateLimit(
  supabase: SupabaseClient,
  key: string,
  route: string,
  options: { max: number; windowMs: number },
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - options.windowMs);

  const { count } = await supabase
    .from("rate_limits")
    .select("id", { head: true, count: "exact" })
    .eq("client_key", key)
    .eq("route", route)
    .gte("hit_at", windowStart.toISOString());

  const hits = count ?? 0;
  const allowed = hits < options.max;

  if (allowed) {
    await supabase.from("rate_limits").insert({ client_key: key, route });
  }

  // Probabilistic prune so the table doesn't grow forever.
  if (Math.random() < 0.05) {
    const cutoff = new Date(
      Date.now() - PRUNE_OLDER_THAN_HOURS * 60 * 60 * 1000,
    ).toISOString();
    void supabase.from("rate_limits").delete().lt("hit_at", cutoff);
  }

  return {
    allowed,
    remaining: Math.max(0, options.max - hits - (allowed ? 1 : 0)),
    resetAt: new Date(Date.now() + options.windowMs),
  };
}
