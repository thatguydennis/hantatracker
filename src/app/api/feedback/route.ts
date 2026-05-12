import { NextResponse } from "next/server";
import { serviceSupabase } from "@/lib/supabase";
import { clientKey, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FeedbackInput {
  name?: string;
  email?: string;
  message?: string;
  source?: string;
  hp?: string;
}

const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5_000;
const MAX_SOURCE = 200;

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(request: Request) {
  let body: FeedbackInput;
  try {
    body = (await request.json()) as FeedbackInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Silent honeypot — bots that fill `hp` get a fake 200 and we never
  // count the hit against the rate limit or store the message.
  if (typeof body.hp === "string" && body.hp.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const message = clean(body.message, MAX_MESSAGE);
  if (!message) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 },
    );
  }

  const supabase = serviceSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Feedback storage is not configured" },
      { status: 503 },
    );
  }

  // Per-IP rate limit: 10 submissions per hour. IP is hashed, never stored.
  const key = clientKey(request);
  const rate = await rateLimit(supabase, key, "feedback", {
    max: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error:
          "Too many submissions from this network. Try again in an hour.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
        },
      },
    );
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  const { error } = await supabase.from("feedback").insert({
    name: clean(body.name, MAX_NAME),
    email: clean(body.email, MAX_EMAIL),
    message,
    source: clean(body.source, MAX_SOURCE),
    user_agent: userAgent,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not save feedback right now" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, remaining: rate.remaining });
}
