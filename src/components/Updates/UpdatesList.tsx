import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UpdateItem, type UpdateData } from "@/components/Drawer/UpdateItem";

interface UpdatesListProps {
  updates: UpdateData[];
  loading?: boolean;
  className?: string;
  /** Render a "See all news →" link at the bottom that routes to /news. */
  showSeeAll?: boolean;
  /** Copy shown when there are no updates and we're not loading. */
  emptyMessage?: string;
}

export function UpdatesList({
  updates,
  loading,
  className,
  showSeeAll,
  emptyMessage = "No updates yet. Check back soon.",
}: UpdatesListProps) {
  return (
    <section
      aria-label="Latest updates"
      className={`flex flex-col overflow-hidden rounded-lg border border-border bg-surface ${className ?? ""}`}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-h3 font-semibold text-text-primary">
          Latest updates
        </h2>
        <span className="text-meta text-text-tertiary">Today</span>
      </header>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-6 text-body-sm text-text-tertiary">
            Loading updates…
          </div>
        ) : updates.length === 0 ? (
          <div className="px-4 py-6 text-body-sm text-text-tertiary">
            {emptyMessage}
          </div>
        ) : (
          updates.map((u) => <UpdateItem key={u.id} update={u} />)
        )}
      </div>

      {showSeeAll && (
        <Link
          href="/news"
          className="flex shrink-0 items-center justify-between border-t border-border px-4 py-3 text-body-sm font-medium text-brand-primary hover:bg-surface-muted hover:text-brand-deep"
        >
          See all news
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      )}
    </section>
  );
}
