import Link from "next/link";
import { feeds } from "@/lib/feeds";

interface NewsFiltersProps {
  activeSource?: string;
  activeSince?: string;
  query?: string;
}

const sinceOptions: Array<{ value: string; label: string }> = [
  { value: "", label: "All time" },
  { value: "1d", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

function buildHref(
  params: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v.length > 0) search.set(k, v);
  }
  const qs = search.toString();
  return qs ? `/news?${qs}` : "/news";
}

export function NewsFilters({
  activeSource,
  activeSince,
  query,
}: NewsFiltersProps) {
  const sources = Array.from(new Set(feeds.map((f) => f.source))).sort();

  return (
    <section
      aria-label="Filter news"
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3"
    >
      <form
        action="/news"
        method="get"
        className="flex flex-wrap items-center gap-2"
      >
        {activeSource && (
          <input type="hidden" name="source" value={activeSource} />
        )}
        {activeSince && (
          <input type="hidden" name="since" value={activeSince} />
        )}
        <label htmlFor="news-q" className="sr-only">
          Search news
        </label>
        <input
          id="news-q"
          type="search"
          name="q"
          defaultValue={query ?? ""}
          placeholder="Search headlines and summaries"
          className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:outline-none focus:shadow-[var(--shadow-focus)]"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-primary px-3 py-2 text-body-sm font-medium text-text-inverse hover:bg-brand-deep"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-meta text-text-tertiary">Source</span>
        <Link
          href={buildHref({ since: activeSince, q: query })}
          className={`rounded-sm px-2 py-1 text-meta font-medium ${
            !activeSource
              ? "bg-brand-primary text-text-inverse"
              : "bg-surface-muted text-text-secondary hover:text-text-primary"
          }`}
        >
          All
        </Link>
        {sources.map((s) => {
          const active = activeSource === s;
          return (
            <Link
              key={s}
              href={buildHref({ source: active ? undefined : s, since: activeSince, q: query })}
              className={`rounded-sm px-2 py-1 text-meta font-medium ${
                active
                  ? "bg-brand-primary text-text-inverse"
                  : "bg-surface-muted text-text-secondary hover:text-text-primary"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-meta text-text-tertiary">When</span>
        {sinceOptions.map((opt) => {
          const active = (activeSince ?? "") === opt.value;
          return (
            <Link
              key={opt.value}
              href={buildHref({
                source: activeSource,
                since: opt.value || undefined,
                q: query,
              })}
              className={`rounded-sm px-2 py-1 text-meta font-medium ${
                active
                  ? "bg-brand-primary text-text-inverse"
                  : "bg-surface-muted text-text-secondary hover:text-text-primary"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
