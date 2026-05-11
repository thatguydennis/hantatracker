import type { FeatureCollection, MultiPolygon } from "geojson";

// Simplified bounding regions for hantavirus endemicity, intended as a
// barely-there context layer (0.15 opacity). Not epidemiologically precise.
// GeoJSON uses [lon, lat] order.

export const endemicRegions: FeatureCollection<MultiPolygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Americas", strain: "Sin Nombre / Andes / Choclo" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-75, -55],
              [-65, -55],
              [-58, -38],
              [-55, -22],
              [-65, -5],
              [-78, 5],
              [-92, 15],
              [-105, 25],
              [-118, 35],
              [-122, 49],
              [-114, 55],
              [-100, 50],
              [-95, 40],
              [-100, 30],
              [-105, 20],
              [-90, 12],
              [-75, 0],
              [-70, -15],
              [-68, -30],
              [-70, -45],
              [-75, -55],
            ],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "East Asia", strain: "Hantaan / Seoul" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [95, 20],
              [105, 18],
              [120, 22],
              [128, 33],
              [135, 42],
              [140, 50],
              [135, 55],
              [125, 53],
              [115, 48],
              [105, 42],
              [95, 35],
              [92, 28],
              [95, 20],
            ],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Europe", strain: "Puumala / Dobrava" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [5, 55],
              [12, 55],
              [25, 56],
              [30, 62],
              [30, 70],
              [20, 70],
              [10, 65],
              [5, 60],
              [5, 55],
            ],
          ],
          [
            [
              [13, 41],
              [22, 41],
              [28, 44],
              [26, 47],
              [18, 47],
              [13, 45],
              [13, 41],
            ],
          ],
        ],
      },
    },
  ],
};
