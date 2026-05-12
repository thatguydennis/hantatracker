export type StopType =
  | "departure"
  | "shore-excursion"
  | "port-stop"
  | "arrival"
  | "medical-event"
  | "milestone";

export type LatLon = [number, number];

export interface RouteStop {
  id: string;
  name: string;
  stop_type: StopType;
  date?: string;
  date_range?: [string, string];
  coords: LatLon;
  summary: string;
}

export interface DispersalLocation {
  id: string;
  name: string;
  facility: string;
  date: string;
  coords: LatLon;
  evacuees: number | null;
  active_cases: boolean;
  summary: string;
}

export interface OutbreakMeta {
  name: string;
  year: number;
  virus_strain: string;
  disease: string;
  ship: string;
  operator: string;
  ship_flag: string;
  departure_date: string;
  departure_port: string;
  arrival_date: string;
  arrival_port: string;
  guests_boarded_ushuaia: number;
  guests_boarded_tristan: number;
  stats_as_of: string;
  stats: {
    cases_confirmed: number;
    cases_probable: number;
    cases_total: number;
    deaths: number;
    new_cases: number;
    countries_affected: number;
  };
}

export interface CruiseData {
  outbreak: OutbreakMeta;
  route: RouteStop[];
  dispersal: DispersalLocation[];
}
