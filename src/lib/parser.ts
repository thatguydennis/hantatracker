import Parser from "rss-parser";
import {
  feeds,
  matchesKeywords,
  type FeedCategory,
  type FeedSource,
} from "./feeds";

const parser = new Parser({
  timeout: 12_000,
  headers: { "User-Agent": "HantavirusTracker/1.0 (+vercel)" },
});

export interface NormalizedArticle {
  source: string;
  category: FeedCategory;
  title: string;
  url: string;
  summary: string;
  published_at: string | null;
}

export interface FeedError {
  source: string;
  url: string;
  message: string;
}

function normalizeArticle(
  feed: FeedSource,
  item: Parser.Item,
): NormalizedArticle | null {
  const title = item.title?.trim();
  const url = item.link?.trim();
  if (!title || !url) return null;

  const summary = (
    item.contentSnippet ??
    item.content ??
    item.summary ??
    ""
  )
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);

  const published = item.isoDate ?? item.pubDate ?? null;
  const published_at = published ? new Date(published).toISOString() : null;

  return {
    source: feed.source,
    category: feed.category,
    title,
    url,
    summary,
    published_at,
  };
}

export async function fetchFeed(feed: FeedSource): Promise<{
  articles: NormalizedArticle[];
  error: FeedError | null;
}> {
  try {
    const result = await parser.parseURL(feed.url);
    const items = (result.items ?? [])
      .map((item) => normalizeArticle(feed, item))
      .filter((a): a is NormalizedArticle => a !== null)
      .filter((a) =>
        feed.filter ? matchesKeywords(`${a.title} ${a.summary}`) : true,
      );
    return { articles: items, error: null };
  } catch (err) {
    return {
      articles: [],
      error: {
        source: feed.source,
        url: feed.url,
        message: err instanceof Error ? err.message : String(err),
      },
    };
  }
}

export async function fetchAllFeeds(): Promise<{
  articles: NormalizedArticle[];
  errors: FeedError[];
}> {
  const results = await Promise.all(feeds.map(fetchFeed));
  const articles: NormalizedArticle[] = [];
  const errors: FeedError[] = [];
  const seenUrls = new Set<string>();

  for (const r of results) {
    if (r.error) errors.push(r.error);
    for (const a of r.articles) {
      if (seenUrls.has(a.url)) continue;
      seenUrls.add(a.url);
      articles.push(a);
    }
  }

  return { articles, errors };
}
