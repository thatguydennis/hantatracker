import { NextResponse } from "next/server";
import { serviceSupabase } from "@/lib/supabase";
import { fetchAllFeeds } from "@/lib/parser";
import { pickAnchorSnapshot } from "@/lib/extractStats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Length-prefixed constant-time string compare — neutralises the timing
// side-channel on the bearer secret check. Edge runtimes don't always ship
// `crypto.timingSafeEqual`, so we roll a tiny version here.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }
  const auth = request.headers.get("authorization") ?? "";
  if (!safeEqual(auth, `Bearer ${secret}`)) return unauthorized();

  const supabase = serviceSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  const { articles, errors } = await fetchAllFeeds();

  let added = 0;
  let skipped = 0;

  for (const a of articles) {
    const { error, data } = await supabase
      .from("articles")
      .upsert(
        {
          source: a.source,
          title: a.title,
          url: a.url,
          summary: a.summary,
          published_at: a.published_at,
          category: a.category,
        },
        { onConflict: "url", ignoreDuplicates: true },
      )
      .select("id");

    if (error) {
      errors.push({
        source: a.source,
        url: a.url,
        message: error.message,
      });
      continue;
    }
    if (data && data.length > 0) added += 1;
    else skipped += 1;
  }

  // Stats extraction: pick a single anchor article (highest cases_total) and
  // use its deaths/countries from the same text — no cross-article averaging.
  let statsUpdate: Record<string, unknown> | null = null;

  try {
    const { data: recent } = await supabase
      .from("articles")
      .select("id, title, summary, url")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(50);

    const recentArticles = (recent ?? []) as Array<{
      id: string;
      title: string;
      summary: string | null;
      url: string;
    }>;

    const anchor = pickAnchorSnapshot(recentArticles);

    if (anchor) {
      const { data: prev } = await supabase
        .from("outbreak_stats")
        .select("cases_total")
        .order("extracted_at", { ascending: false })
        .limit(1);
      const prevTotal =
        prev && prev.length > 0
          ? ((prev[0] as { cases_total: number | null }).cases_total ?? 0)
          : 0;
      const newCases = Math.max(0, (anchor.cases_total ?? 0) - prevTotal);

      // Sanity guard: never insert a snapshot whose deaths exceed cases.
      const deathsClean =
        anchor.deaths !== null && anchor.cases_total !== null &&
        anchor.deaths <= anchor.cases_total
          ? anchor.deaths
          : null;

      const { error: insErr } = await supabase
        .from("outbreak_stats")
        .insert({
          cases_total: anchor.cases_total,
          deaths: deathsClean,
          new_cases: newCases,
          countries: anchor.countries,
          source_article_id: anchor.source_article_id,
          source_title: anchor.source_title,
          source_url: anchor.source_url,
        });

      if (insErr) {
        errors.push({
          source: "stats-extractor",
          url: "",
          message: insErr.message,
        });
      } else {
        statsUpdate = {
          cases_total: anchor.cases_total,
          deaths: deathsClean,
          new_cases: newCases,
          countries: anchor.countries,
          source_title: anchor.source_title,
          source_url: anchor.source_url,
        };
      }
    }
  } catch (err) {
    errors.push({
      source: "stats-extractor",
      url: "",
      message: err instanceof Error ? err.message : String(err),
    });
  }

  await supabase.from("refresh_log").insert({
    articles_added: added,
    articles_skipped: skipped,
    errors: errors.length ? errors : null,
  });

  return NextResponse.json({
    ok: true,
    added,
    skipped,
    errorCount: errors.length,
    statsUpdate,
  });
}
