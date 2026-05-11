import { MapClient } from "@/components/Map/MapClient";
import { StatsBar } from "@/components/Stats/StatsBar";
import { UpdatesList } from "@/components/Updates/UpdatesList";
import { UpdatesDrawer } from "@/components/Drawer/UpdatesDrawer";
import { placeholderUpdates } from "@/data/placeholder-updates";

export default function HomePage() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-6">
          <aside className="hidden lg:order-1 lg:col-span-1 lg:block">
            <UpdatesList updates={placeholderUpdates} />
          </aside>

          <div className="flex flex-col gap-4 lg:order-2 lg:col-span-3">
            <StatsBar />
            <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden rounded-lg border border-border bg-surface-muted lg:h-[calc(100vh-9rem)]">
              <MapClient />
            </div>
          </div>
        </div>
        <div className="pb-[198px] lg:pb-0" aria-hidden />
      </div>

      <UpdatesDrawer updates={placeholderUpdates} />
    </>
  );
}
