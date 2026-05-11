// Raw hex values mirroring design-system.md tokens, for Leaflet pathOptions.
// Leaflet sets SVG stroke/fill via attributes, so CSS variables can't resolve there.

export const mapColors = {
  brandPrimary: "#4A6FA5",
  brandDeep: "#2E4A75",
  brandSoft: "#D4E4F7",
  alert: "#E24B4A",
  alertSoft: "#FCE5E5",
  historical: "#8A95A4",
  surface: "#FFFFFF",
} as const;
