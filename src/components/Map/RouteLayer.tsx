"use client";

import { Polyline } from "react-leaflet";
import { routeCoords, portStops } from "@/data/cruise-data";
import { mapColors } from "./colors";
import { Pin } from "./Pin";

export function RouteLayer() {
  return (
    <>
      <Polyline
        positions={routeCoords}
        pathOptions={{
          color: mapColors.brandPrimary,
          weight: 3,
          dashArray: "8 6",
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      {portStops.map((stop) => (
        <Pin key={stop.id} stop={stop} />
      ))}
    </>
  );
}
