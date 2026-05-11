import { MapClient } from "@/components/Map/MapClient";
import { StatsBar } from "@/components/Stats/StatsBar";
import { UpdatesList } from "@/components/Updates/UpdatesList";
import { UpdatesDrawer } from "@/components/Drawer/UpdatesDrawer";
import { placeholderUpdates } from "@/data/placeholder-updates";
import { getArticles, timeAgo } from "@/lib/articles";
import type { UpdateData } from "@/components/Drawer/UpdateItem";

export const revalidate = 300;

export default async function HomePage() {
  const { articles, configured } = await getArticles({ limit: 20 });

  const updates: UpdateData[] = configured && articles.length > 0
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
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-6">
          <aside className="hidden lg:order-1 lg:col-span-1 lg:block">
            <UpdatesList updates={updates} />
          </aside>

          <div className="flex flex-col gap-4 lg:order-2 lg:col-span-3">
            <StatsBar />
            <div
              role="region"
              aria-label="Outbreak map"
              className="relative h-[55vh] min-h-[320px] w-full overflow-hidden rounded-lg border border-border bg-surface-muted lg:h-[calc(100vh-9rem)]"
            >
              <MapClient />
            </div>
          </div>
        </div>
        <div className="pb-[198px] lg:pb-0" aria-hidden />
      </div>

      <UpdatesDrawer updates={updates} />
    </>
  );
}
