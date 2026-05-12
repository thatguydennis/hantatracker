import { MapClient } from "@/components/Map/MapClient";
import { StatsBar } from "@/components/Stats/StatsBar";
import { UpdatesList } from "@/components/Updates/UpdatesList";
import { UpdatesDrawer } from "@/components/Drawer/UpdatesDrawer";
import { MobileFixedLayout } from "@/components/MobileFixedLayout";
import { placeholderUpdates } from "@/data/placeholder-updates";
import { getArticles, timeAgo } from "@/lib/articles";
import type { UpdateData } from "@/components/Drawer/UpdateItem";

export const revalidate = 300;

export default async function HomePage() {
  const { articles, configured } = await getArticles({ limit: 20 });

  const updates: UpdateData[] =
    configured && articles.length > 0
      ? articles.map((a) => ({
          id: a.id,
          source: a.source,
          title: a.title,
          ago: timeAgo(a.published_at),
          url: a.url,
        }))
      : placeholderUpdates;

  return (
    <>
      <MobileFixedLayout />

      {/* Mobile: viewport-locked column. Desktop: regular grid layout. */}
      <div className="flex h-[calc(100dvh-3.5rem)] flex-col gap-3 px-4 py-3 lg:mx-auto lg:h-auto lg:max-w-7xl lg:grid lg:grid-cols-4 lg:gap-6 lg:px-6 lg:py-6">
        <aside className="hidden lg:order-1 lg:col-span-1 lg:block">
          <UpdatesList updates={updates} />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:order-2 lg:col-span-3 lg:gap-4">
          <StatsBar />
          <div
            role="region"
            aria-label="Outbreak map"
            className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-surface-muted lg:h-[calc(100vh-9rem)] lg:flex-none"
          >
            <MapClient />
          </div>
        </div>
      </div>

      <UpdatesDrawer updates={updates} />
    </>
  );
}
