interface UpdateItemData {
  source: string;
  title: string;
  ago: string;
}

const placeholderUpdates: UpdateItemData[] = [
  {
    source: "WHO",
    title: "Disease Outbreak News bulletin updated for cruise ship cluster",
    ago: "2h",
  },
  {
    source: "CDC",
    title: "Agency issues update on hantavirus cruise ship situation",
    ago: "4h",
  },
  {
    source: "BBC",
    title: "17 Americans arrive in Nebraska for hantavirus monitoring",
    ago: "6h",
  },
  {
    source: "Reuters",
    title: "Spanish nationals flown to Madrid for medical observation",
    ago: "9h",
  },
  {
    source: "ECDC",
    title: "European Centre publishes risk assessment for general public",
    ago: "1d",
  },
];

function UpdateItem({ update }: { update: UpdateItemData }) {
  return (
    <article className="flex flex-col gap-1 border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="rounded-sm border border-border bg-surface-muted px-1.5 py-0.5 text-meta font-semibold text-text-secondary">
          {update.source}
        </span>
        <span className="text-meta text-text-tertiary tabular-nums">
          {update.ago} ago
        </span>
      </div>
      <h3 className="text-body-sm font-medium text-text-primary leading-snug">
        {update.title}
      </h3>
    </article>
  );
}

export function UpdatesList() {
  return (
    <section
      aria-label="Latest updates"
      className="overflow-hidden rounded-lg border border-border bg-surface"
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-h3 font-semibold text-text-primary">
          Latest updates
        </h2>
        <span className="text-meta text-text-tertiary">Placeholder</span>
      </header>
      <div>
        {placeholderUpdates.map((u, i) => (
          <UpdateItem key={i} update={u} />
        ))}
      </div>
    </section>
  );
}
