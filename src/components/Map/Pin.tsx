"use client";

import { CircleMarker, Popup, Tooltip } from "react-leaflet";
import { useState } from "react";
import type { RouteStop } from "@/types";
import { formatStopDate } from "@/data/cruise-data";
import { PinPopup } from "./PinPopup";
import { mapColors } from "./colors";

interface PinProps {
  stop: RouteStop;
}

const baseRadius = 10;
const selectedRadius = 14;

export function Pin({ stop }: PinProps) {
  const [selected, setSelected] = useState(false);

  return (
    <CircleMarker
      center={stop.coords}
      radius={selected ? selectedRadius : baseRadius}
      pathOptions={{
        color: mapColors.brandPrimary,
        weight: 2,
        fillColor: selected ? mapColors.brandPrimary : mapColors.surface,
        fillOpacity: 1,
      }}
      eventHandlers={{
        popupopen: () => setSelected(true),
        popupclose: () => setSelected(false),
      }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={1}>
        <span className="text-meta font-medium">
          {stop.name.split(",")[0]} · {formatStopDate(stop)}
        </span>
      </Tooltip>
      <Popup maxWidth={280} minWidth={220} autoPan>
        <PinPopup stop={stop} />
      </Popup>
    </CircleMarker>
  );
}
