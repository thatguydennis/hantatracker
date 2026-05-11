import { UpdateItem, type UpdateData } from "@/components/Drawer/UpdateItem";

interface UpdatesListProps {
  updates: UpdateData[];
  loading?: boolean;
}

export function UpdatesList({ updates, loading }: UpdatesListProps) {
  return (
    <section
      aria-label="Latest updates"
      className="overflow-hidden rounded-lg border border-border bg-surface"
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-h3 font-semibold text-text-primary">
          Latest updates
        </h2>
      </header>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
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
