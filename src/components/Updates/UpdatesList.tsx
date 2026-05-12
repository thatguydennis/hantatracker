import { UpdateItem, type UpdateData } from "@/components/Drawer/UpdateItem";

interface UpdatesListProps {
  updates: UpdateData[];
  loading?: boolean;
  className?: string;
}

export function UpdatesList({ updates, loading, className }: UpdatesListProps) {
  return (
    <section
      aria-label="Latest updates"
      className={`flex flex-col overflow-hidden rounded-lg border border-border bg-surface ${className ?? ""}`}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-h3 font-semibold text-text-primary">
          Latest updates
        </h2>
      </header>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-6 text-body-sm text-text-tertiary">
            Loading updates…
          </div>
        ) : updates.length === 0 ? (
          <div className="px-4 py-6 text-body-sm text-text-tertiary">
            No updates yet. Check back soon.
          </div>
        ) : (
          updates.map((u) => <UpdateItem key={u.id} update={u} />)
        )}
      </div>
    </section>
  );
}
