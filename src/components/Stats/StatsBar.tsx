import { cruiseData, portStops } from "@/data/cruise-data";

interface StatProps {
  value: number;
  label: string;
  emphasis?: boolean;
}

function Stat({ value, label, emphasis }: StatProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-md border border-border bg-surface px-3 py-2 md:py-3">
      <span
        className={`text-stat tabular-nums leading-none ${
          emphasis ? "text-alert" : "text-text-primary"
        }`}
      >
        {Intl.NumberFormat("en-US").format(value)}
      </span>
      <span className="mt-1 text-meta text-text-tertiary">{label}</span>
    </div>
  );
}

export function StatsBar() {
  const { stats } = cruiseData.outbreak;
  const stops = portStops.length;
  const countries = stats.countries_affected;

  return (
    <section
      aria-label="Outbreak statistics"
      className="grid grid-cols-4 gap-2 md:gap-3"
    >
      <Stat value={stats.cases_total} label="Cases" emphasis />
      <Stat value={stats.deaths} label="Deaths" emphasis />
      <Stat value={stops} label="Stops" />
      <Stat value={countries} label="Countries" />
    </section>
  );
}
