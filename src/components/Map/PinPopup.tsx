import Link from "next/link";
import type { RouteStop } from "@/types";
import { formatStopDate, stopTypeLabel } from "@/data/cruise-data";

interface PinPopupProps {
  stop: RouteStop;
}

export function PinPopup({ stop }: PinPopupProps) {
  return (
    <div className="min-w-[200px] max-w-[260px]">
      <div className="text-meta uppercase tracking-wide text-text-tertiary">
        {stopTypeLabel(stop.stop_type)}
      </div>
      <h3 className="mt-1 text-h3 font-semibold text-text-primary">
        {stop.name}
      </h3>
      <div className="mt-1 text-body-sm text-text-secondary tabular-nums">
        {formatStopDate(stop)}
      </div>
      <p className="mt-2 text-body-sm text-text-secondary leading-snug">
        {stop.summary}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
        <span className="text-meta text-text-tertiary">
          News articles · —
        </span>
        <Link
          href={`/news?location=${stop.id}`}
          className="text-meta font-medium text-brand-primary hover:text-brand-deep"
        >
          See news →
        </Link>
      </div>
    </div>
  );
}
