import { mapColors } from "./colors";

interface LegendItemProps {
  swatch: React.ReactNode;
  label: string;
  hint?: string;
}

function LegendItem({ swatch, label, hint }: LegendItemProps) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="flex h-4 w-6 shrink-0 items-center justify-center"
      >
        {swatch}
      </span>
      <span className="text-meta text-text-primary">
        {label}
        {hint && <span className="ml-1 text-text-tertiary"> · {hint}</span>}
      </span>
    </li>
  );
}

/**
 * Static, see-through map legend. Sits over the bottom-left of the map.
 * Background uses surface at low opacity + backdrop-blur so map tiles
 * remain visible underneath while the text stays legible.
 */
export function Legend() {
  return (
    <aside
      aria-label="Map legend"
      className="pointer-events-none absolute bottom-3 left-3 z-[1000] max-w-[80%] rounded-md border border-border/60 bg-surface/60 px-3 py-2 backdrop-blur"
    >
      <div className="mb-1.5 text-meta font-semibold uppercase tracking-wide text-text-secondary">
        Legend
      </div>
      <ul className="flex flex-col gap-1.5">
        <LegendItem
          label="Active cases"
          hint="patients under care"
          swatch={
            <svg width="20" height="14" viewBox="-10 -7 20 14" aria-hidden>
              <circle cx="0" cy="0" r="6" fill={mapColors.alert} opacity="0.3" />
              <circle cx="0" cy="0" r="3.5" fill={mapColors.alert} />
            </svg>
          }
        />
        <LegendItem
          label="New cases"
          hint="green ring = reported this update"
          swatch={
            <svg width="20" height="14" viewBox="-10 -7 20 14" aria-hidden>
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="none"
                stroke={mapColors.newCases}
                strokeWidth="1.6"
              />
              <circle cx="0" cy="0" r="3.5" fill={mapColors.alert} />
            </svg>
          }
        />
        <LegendItem
          label="Discharged"
          hint="no current cases"
          swatch={
            <svg width="20" height="14" viewBox="-10 -7 20 14" aria-hidden>
              <circle
                cx="0"
                cy="0"
                r="3.5"
                fill={mapColors.historical}
                stroke={mapColors.surface}
                strokeWidth="1"
              />
            </svg>
          }
        />
        <LegendItem
          label="Cruise stop"
          hint="MV Hondius port"
          swatch={
            <svg width="20" height="14" viewBox="-10 -7 20 14" aria-hidden>
              <circle
                cx="0"
                cy="0"
                r="4"
                fill={mapColors.surface}
                stroke={mapColors.brandPrimary}
                strokeWidth="1.8"
              />
            </svg>
          }
        />
        <LegendItem
          label="Cruise route"
          swatch={
            <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden>
              <line
                x1="1"
                y1="7"
                x2="21"
                y2="7"
                stroke={mapColors.brandPrimary}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            </svg>
          }
        />
        <LegendItem
          label="Dispersal path"
          hint="Tenerife to receiving city"
          swatch={
            <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden>
              <line
                x1="1"
                y1="7"
                x2="21"
                y2="7"
                stroke={mapColors.brandPrimary}
                strokeWidth="1.4"
                strokeDasharray="2 3"
                opacity="0.55"
              />
            </svg>
          }
        />
        <LegendItem
          label="Endemic regions"
          hint="where hantavirus is found"
          swatch={
            <span
              className="block h-3.5 w-5 rounded-sm"
              style={{ background: mapColors.brandSoft, opacity: 0.55 }}
            />
          }
        />
      </ul>
    </aside>
  );
}
