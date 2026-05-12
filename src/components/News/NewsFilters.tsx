import Link from "next/link";
import { feeds } from "@/lib/feeds";
import { ChevronDown } from "lucide-react";

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

function buildHref(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v.length > 0) search.set(k, v);
  }
  const qs = search.toString();
  return qs ? `/news?${qs}` : "/news";
}

function chipClass(active: boolean): string {
  return `rounded-sm px-2 py-1 text-meta font-medium ${
    active
      ? "bg-brand-primary text-text-inverse"
      : "bg-surface-muted text-text-secondary hover:text-text-primary"
  }`;
}

function activeFilterCount(
  source?: string,
  since?: string,
  query?: string,
): number {
  let n = 0;
  if (source) n += 1;
  if (since) n += 1;
  if (query && query.trim().length > 0) n += 1;
  return n;
}

function ChipGroups({
  activeSource,
  activeSince,
  query,
}: NewsFiltersProps) {
  const sources = Array.from(new Set(feeds.map((f) => f.source))).sort();
  return (
    <div className="flex flex-col gap-3 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-meta text-text-tertiary">Source</span>
        <Link
          href={buildHref({ since: activeSince, q: query })}
          scroll={false}
          className={chipClass(!activeSource)}
        >
          All
        </Link>
        {sources.map((s) => {
          const active = activeSource === s;
          return (
            <Link
              key={s}
              href={buildHref({
                source: active ? undefined : s,
                since: activeSince,
                q: query,
              })}
              scroll={false}
              className={chipClass(active)}
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
              scroll={false}
              className={chipClass(active)}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function NewsFilters({
  activeSource,
  activeSince,
  query,
}: NewsFiltersProps) {
  const count = activeFilterCount(activeSource, activeSince, query);

  return (
    <section
      aria-label="Filter news"
      className="rounded-lg border border-border bg-surface p-3"
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
          className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-primary px-3 py-2 text-body-sm font-medium text-text-inverse hover:bg-brand-deep"
        >
          Search
        </button>
      </form>

      {/* Mobile: collapsible chip groups behind a <details> toggle */}
      <details className="group mt-2 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-1 py-1.5 text-body-sm font-medium text-text-secondary hover:text-text-primary [&::-webkit-details-marker]:hidden">
          <span>
            Filters
            {count > 0 && (
              <span className="ml-2 rounded-full bg-brand-primary px-1.5 py-0.5 text-meta text-text-inverse">
                {count}
              </span>
            )}
          </span>
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            className="transition-transform group-open:rotate-180"
          />
        </summary>
        <ChipGroups
          activeSource={activeSource}
          activeSince={activeSince}
          query={query}
        />
      </details>

      {/* Desktop: always-expanded chip groups */}
      <div className="hidden lg:block">
        <ChipGroups
          activeSource={activeSource}
          activeSince={activeSince}
          query={query}
        />
      </div>
    </section>
  );
}
