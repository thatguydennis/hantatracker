import raw from "@/content/cruise-data.json";
import type { CruiseData, RouteStop, StopType } from "@/types";

export const cruiseData = raw as CruiseData;

const portTypes: StopType[] = [
  "departure",
  "shore-excursion",
  "port-stop",
  "arrival",
];

function stopStart(stop: RouteStop): string {
  return stop.date ?? stop.date_range?.[0] ?? "";
}

export const portStops: RouteStop[] = cruiseData.route
  .filter((s) => portTypes.includes(s.stop_type))
  .slice()
  .sort((a, b) => stopStart(a).localeCompare(stopStart(b)));

export const routeCoords = portStops.map((s) => s.coords);

export function formatStopDate(stop: RouteStop): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  if (stop.date) return formatter.format(new Date(stop.date));
  if (stop.date_range) {
    const [start, end] = stop.date_range;
    return `${formatter.format(new Date(start))}–${formatter.format(
      new Date(end),
    )}`;
  }
  return "";
}

export function stopTypeLabel(type: StopType): string {
  switch (type) {
    case "departure":
      return "Departure";
    case "arrival":
      return "Arrival";
    case "port-stop":
      return "Port stop";
    case "shore-excursion":
      return "Shore excursion";
    case "medical-event":
      return "Medical event";
    case "milestone":
      return "Milestone";
  }
}
