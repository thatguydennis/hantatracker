import { NextResponse } from "next/server";
import { serviceSupabase } from "@/lib/supabase";
import { fetchAllFeeds } from "@/lib/parser";

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
  });
}
