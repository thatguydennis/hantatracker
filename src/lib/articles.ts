import { publicSupabase } from "./supabase";

export interface ArticleSummary {
  id: string;
  source: string;
  title: string;
  url: string;
  summary: string | null;
  published_at: string | null;
  category: string;
}

export interface GetArticlesOptions {
  limit?: number;
  source?: string;
  since?: string;
}

export interface GetArticlesResult {
  articles: ArticleSummary[];
  configured: boolean;
  error?: string;
}

export async function getArticles(
  opts: GetArticlesOptions = {},
): Promise<GetArticlesResult> {
  const { limit = 50, source, since } = opts;
  const supabase = publicSupabase();
  if (!supabase) return { articles: [], configured: false };

  let query = supabase
    .from("articles")
    .select("id, source, title, url, summary, published_at, category")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(Math.min(limit, 200));

  if (source) query = query.eq("source", source);
  if (since) query = query.gte("published_at", since);

  const { data, error } = await query;
  if (error) return { articles: [], configured: true, error: error.message };
  return {
    articles: (data ?? []) as ArticleSummary[],
    configured: true,
  };
}

export function timeAgo(iso: string | null, now: Date = new Date()): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  if (diffMs < 0) return "now";
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) {
    const m = Math.max(1, Math.floor(diffMs / minute));
    return `${m}m`;
  }
  if (diffMs < day) {
    return `${Math.floor(diffMs / hour)}h`;
  }
  const days = Math.floor(diffMs / day);
  if (days <= 30) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
