import { NextResponse } from "next/server";
import { serviceSupabase } from "@/lib/supabase";
import { fetchAllFeeds } from "@/lib/parser";
import { aggregateAcrossArticles, extractFromArticle } from "@/lib/extractStats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  if (auth !== `Bearer ${secret}`) return unauthorized();

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

  // Stats extraction pass: pull the most recent ~50 articles, regex out
  // cases / deaths / countries, store a snapshot if the totals changed.
  let statsUpdate: {
    cases_total: number | null;
    deaths: number | null;
    new_cases: number | null;
    countries: number | null;
    source_title?: string;
    source_url?: string;
  } | null = null;

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

    const agg = aggregateAcrossArticles(recentArticles);

    if (agg.cases_total !== null || agg.deaths !== null) {
      // Previous snapshot (if any) to compute new_cases delta.
      const { data: prev } = await supabase
        .from("outbreak_stats")
        .select("cases_total")
        .order("extracted_at", { ascending: false })
        .limit(1);
      const prevTotal =
        prev && prev.length > 0
          ? ((prev[0] as { cases_total: number | null }).cases_total ?? 0)
          : 0;
      const newCases =
        agg.cases_total !== null
          ? Math.max(0, agg.cases_total - prevTotal)
          : 0;

      // Find the article that yielded the highest cases number for attribution.
      let sourceArticleId: string | null = null;
      let sourceTitle: string | null = null;
      let sourceUrl: string | null = null;
      if (agg.cases_total !== null) {
        for (const a of recentArticles) {
          const s = extractFromArticle(a);
          if (s.cases_total === agg.cases_total) {
            sourceArticleId = a.id;
            sourceTitle = a.title;
            sourceUrl = a.url;
            break;
          }
        }
      }

      const { error: insErr } = await supabase
        .from("outbreak_stats")
        .insert({
          cases_total: agg.cases_total,
          deaths: agg.deaths,
          new_cases: newCases,
          countries: agg.countries,
          source_article_id: sourceArticleId,
          source_title: sourceTitle,
          source_url: sourceUrl,
        });

      if (insErr) {
        errors.push({
          source: "stats-extractor",
          url: "",
          message: insErr.message,
        });
      } else {
        statsUpdate = {
          cases_total: agg.cases_total,
          deaths: agg.deaths,
          new_cases: newCases,
          countries: agg.countries,
          source_title: sourceTitle ?? undefined,
          source_url: sourceUrl ?? undefined,
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
