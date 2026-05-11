"use client";

import "leaflet/dist/leaflet.css";
import "./map.css";

import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import { cruiseData, routeCoords } from "@/data/cruise-data";
import { useTheme } from "@/lib/useTheme";
import { RouteLayer } from "./RouteLayer";
import { DispersalLayer } from "./DispersalLayer";
import { EndemicLayer } from "./EndemicLayer";

const TILES = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    opacity: 0.85,
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    opacity: 0.9,
  },
} as const;

export function HantaMap() {
  const theme = useTheme();
  const tiles = TILES[theme];

  const bounds = useMemo(() => {
    const dispersalCoords = cruiseData.dispersal.map((d) => d.coords);
    const all = [...routeCoords, ...dispersalCoords];
    return L.latLngBounds(all).pad(0.15);
  }, []);

  return (
    <MapContainer
      bounds={bounds}
      scrollWheelZoom={false}
      zoomSnap={0}
      zoomDelta={0.5}
      zoomControl={false}
      worldCopyJump
      className="h-full w-full rounded-lg"
      attributionControl
    >
      <TileLayer
        key={theme}
        url={tiles.url}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        opacity={tiles.opacity}
        subdomains={["a", "b", "c", "d"]}
        maxZoom={18}
      />
      <EndemicLayer />
      <RouteLayer />
      <DispersalLayer />
      <ZoomControl position="topright" />
    </MapContainer>
  );
}
