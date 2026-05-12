"use client";

import { Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import { cruiseData } from "@/data/cruise-data";
import { mapColors } from "./colors";
import type { DispersalLocation, RouteStop } from "@/types";

const tenerifeStop = (): RouteStop | undefined =>
  cruiseData.route.find((s) => s.id === "tenerife");

function buildIcon(
  active: boolean,
  hasNewCases: boolean,
  index: number,
): L.DivIcon {
  const delay = (index * 0.3).toFixed(2);
  const fill = active ? mapColors.alert : mapColors.historical;

  // Active marker: pulse + solid center. If the location has new cases since
  // the last bulletin, an additional green ring sits between them so the
  // "new" signal reads at a glance.
  const newRing = hasNewCases
    ? `<circle cx="0" cy="0" r="13" fill="none" stroke="${mapColors.newCases}" stroke-width="2.5" />`
    : "";

  const html = active
    ? `<svg width="48" height="48" viewBox="-24 -24 48 48" aria-hidden="true">
         <circle class="pulse-ring" cx="0" cy="0" r="8" fill="${fill}" style="animation-delay: ${delay}s" />
         ${newRing}
         <circle cx="0" cy="0" r="8" fill="${fill}" />
       </svg>`
    : `<svg width="24" height="24" viewBox="-12 -12 24 24" aria-hidden="true">
         <circle cx="0" cy="0" r="6" fill="${fill}" stroke="${mapColors.surface}" stroke-width="1" />
       </svg>`;

  return L.divIcon({
    html,
    className: active ? "hanta-pulse" : "hanta-inactive",
    iconSize: active ? [48, 48] : [24, 24],
    iconAnchor: active ? [24, 24] : [12, 12],
    popupAnchor: [0, -10],
  });
}

function DispersalPopup({ location }: { location: DispersalLocation }) {
  const newCases = location.new_cases ?? 0;
  return (
    <div className="min-w-[220px] max-w-[280px]">
      <div className="flex items-center gap-2">
        <span className="text-meta uppercase tracking-wide text-text-tertiary">
          {location.active_cases ? "Active cases" : "Discharged"}
        </span>
        {newCases > 0 && (
          <span
            className="rounded-sm px-1.5 py-0.5 text-meta font-semibold"
            style={{
              backgroundColor: mapColors.newCasesSoft,
              color: mapColors.newCases,
            }}
          >
            +{newCases} new
          </span>
        )}
      </div>
      <h3 className="mt-1 text-h3 font-semibold text-text-primary">
        {location.name}
      </h3>
      <div className="mt-1 text-body-sm text-text-secondary">
        {location.facility}
      </div>
      <p className="mt-2 text-body-sm text-text-secondary leading-snug">
        {location.summary}
      </p>
      {location.evacuees !== null && (
        <div className="mt-3 border-t border-border pt-2 text-meta text-text-tertiary">
          Evacuees ·{" "}
          <span className="tabular-nums text-text-secondary">
            {location.evacuees}
          </span>
        </div>
      )}
    </div>
  );
}

export function DispersalLayer() {
  const tenerife = tenerifeStop();

  const lines = useMemo(() => {
    if (!tenerife) return [];
    return cruiseData.dispersal.map((d) => [tenerife.coords, d.coords]);
  }, [tenerife]);

  return (
    <>
      {lines.map((coords, i) => (
        <Polyline
          key={`disp-line-${i}`}
          positions={coords}
          pathOptions={{
            color: mapColors.brandPrimary,
            weight: 1.5,
            opacity: 0.5,
            dashArray: "3 4",
          }}
        />
      ))}
      {cruiseData.dispersal.map((d, i) => (
        <Marker
          key={d.id}
          position={d.coords}
          icon={buildIcon(d.active_cases, (d.new_cases ?? 0) > 0, i)}
        >
          <Popup maxWidth={300} minWidth={240} autoPan>
            <DispersalPopup location={d} />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
