import { MapClient } from "@/components/Map/MapClient";
import { Legend } from "@/components/Map/Legend";
import { StatsBar } from "@/components/Stats/StatsBar";
import { UpdatesList } from "@/components/Updates/UpdatesList";
import { placeholderUpdates } from "@/data/placeholder-updates";
import { getArticles, timeAgo } from "@/lib/articles";
import type { UpdateData } from "@/components/Drawer/UpdateItem";

export const revalidate = 300;

const HOME_UPDATES_LIMIT = 7;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default async function HomePage() {
  // Home only shows today's updates (last 24h), capped at 7. Full archive
  // lives at /news — UpdatesList renders a "See all news" footer link.
  const since = new Date(Date.now() - ONE_DAY_MS).toISOString();
  const { articles, configured } = await getArticles({
    limit: HOME_UPDATES_LIMIT,
    since,
  });

  const updates: UpdateData[] = configured
    ? articles.map((a) => ({
        id: a.id,
        source: a.source,
        title: a.title,
        ago: timeAgo(a.published_at),
        url: a.url,
      }))
    : placeholderUpdates.slice(0, HOME_UPDATES_LIMIT);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
      {/*
        Mobile: stats → map (55vh) → updates list, all in flow, page scrolls.
        Desktop (lg+): sidebar list | (stats + map). Both columns get the same
        explicit height so their bottoms align; sidebar list scrolls
        internally, map fills the remainder of the right column.
      */}
      <div className="flex flex-col gap-4 lg:grid lg:h-[calc(100vh-7rem)] lg:grid-cols-4 lg:gap-6">
        <aside className="order-3 lg:order-1 lg:col-span-1 lg:h-full lg:min-h-0">
          <UpdatesList
            updates={updates}
            showSeeAll
            emptyMessage="No new updates today."
            className="lg:h-full"
          />
        </aside>

        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:col-span-3 lg:h-full lg:min-h-0">
          <StatsBar />
          <div
            role="region"
            aria-label="Outbreak map"
            className="relative h-[55vh] min-h-[320px] w-full overflow-hidden rounded-lg border border-border bg-surface-muted lg:h-auto lg:min-h-0 lg:flex-1"
          >
            <MapClient />
            <Legend />
          </div>
        </div>
      </div>
    </div>
  );
}
