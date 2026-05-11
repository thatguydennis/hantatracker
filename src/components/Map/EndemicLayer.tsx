"use client";

import { GeoJSON } from "react-leaflet";
import { endemicRegions } from "./endemicRegions";
import { mapColors } from "./colors";

export function EndemicLayer() {
  return (
    <GeoJSON
      data={endemicRegions}
      style={() => ({
        fillColor: mapColors.brandSoft,
        fillOpacity: 0.15,
        weight: 0,
        stroke: false,
      })}
      interactive={false}
    />
  );
}
