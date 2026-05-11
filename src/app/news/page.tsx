import { getArticles, timeAgo } from "@/lib/articles";
import { NewsFilters } from "@/components/News/NewsFilters";

export const revalidate = 300;

interface SearchParams {
  source?: string;
  since?: string;
  q?: string;
  location?: string;
}

function sinceToIso(since: string | undefined): string | undefined {
  if (!since) return undefined;
  const m = since.match(/^(\d+)d$/);
  if (!m) return undefined;
  const days = Number(m[1]);
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sinceIso = sinceToIso(params.since);

  const { articles, configured } = await getArticles({
    limit: 100,
    source: params.source,
    since: sinceIso,
  });

  const q = params.q?.trim().toLowerCase();
  const filtered = q
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.summary ?? "").toLowerCase().includes(q),
      )
    : articles;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-10">
      <h1 className="text-h1 font-semibold text-text-primary md:text-display">
        News
      </h1>
      <p className="mt-2 text-body text-text-secondary">
        Headlines from health authorities and major outlets, filtered to
        hantavirus coverage.
      </p>

      <div className="mt-6">
        <NewsFilters
          activeSource={params.source}
          activeSince={params.since}
          query={params.q}
        />
      </div>

      {!configured ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-body-sm text-text-secondary">
          The news feed is not yet connected to its data source. Once Supabase
          credentials are configured, headlines will appear here.
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-body-sm text-text-secondary">
          No articles matched your filters. Try widening the date range or
          clearing the search.
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {filtered.map((a) => (
            <li key={a.id}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-surface-muted"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-sm border border-border bg-surface-muted px-1.5 py-0.5 text-meta font-semibold text-text-secondary">
                    {a.source}
                  </span>
                  <span className="text-meta text-text-tertiary tabular-nums">
                    {timeAgo(a.published_at)} ago
                  </span>
                </div>
                <h2 className="mt-1 text-body font-medium text-text-primary leading-snug">
                  {a.title}
                </h2>
                {a.summary && (
                  <p className="mt-1 text-body-sm text-text-secondary leading-snug line-clamp-2">
                    {a.summary}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
