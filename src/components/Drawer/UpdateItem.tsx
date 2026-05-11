export interface UpdateData {
  id: string;
  source: string;
  title: string;
  ago: string;
  url?: string;
}

export function UpdateItem({ update }: { update: UpdateData }) {
  const content = (
    <article className="flex flex-col gap-1 px-4 py-3">
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

  if (update.url) {
    return (
      <a
        href={update.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border-b border-border last:border-b-0 hover:bg-surface-muted"
      >
        {content}
      </a>
    );
  }
  return (
    <div className="border-b border-border last:border-b-0">{content}</div>
  );
}
