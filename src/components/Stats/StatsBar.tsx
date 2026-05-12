import { cruiseData } from "@/data/cruise-data";

interface StatProps {
  value: number;
  label: string;
  emphasis?: boolean;
}

function Stat({ value, label, emphasis }: StatProps) {
  const formatted = Intl.NumberFormat("en-US").format(value);
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-md border border-border bg-surface px-3 py-2 md:py-3"
      role="group"
      aria-label={`${formatted} ${label.toLowerCase()}`}
    >
      <span
        aria-hidden
        className={`text-stat tabular-nums leading-none ${
          emphasis ? "text-alert" : "text-text-primary"
        }`}
      >
        {formatted}
      </span>
      <span aria-hidden className="mt-1 text-meta text-text-tertiary">
        {label}
      </span>
    </div>
  );
}

export function StatsBar() {
  const { stats } = cruiseData.outbreak;

  return (
    <section
      aria-label="Outbreak statistics"
      className="grid grid-cols-4 gap-2 md:gap-3"
    >
      <Stat value={stats.cases_total} label="Total cases" emphasis />
      <Stat value={stats.deaths} label="Deaths" emphasis />
      <Stat value={stats.new_cases} label="New cases" emphasis />
      <Stat value={stats.countries_affected} label="Countries" />
    </section>
  );
}
