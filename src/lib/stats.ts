import { publicSupabase } from "./supabase";
import { cruiseData } from "@/data/cruise-data";

export interface OutbreakStats {
  cases_total: number;
  deaths: number;
  new_cases: number;
  countries: number;
  extracted_at: string | null;
  source_title: string | null;
  source_url: string | null;
  /** True when the values came from the auto-extractor; false when from JSON fallback. */
  from_auto: boolean;
}

/** Reads the most recent auto-extracted outbreak stats, falling back to the
 * hand-edited cruise-data.json defaults if Supabase isn't configured or no
 * row exists yet. */
export async function getOutbreakStats(): Promise<OutbreakStats> {
  const fallback: OutbreakStats = {
    cases_total: cruiseData.outbreak.stats.cases_total,
    deaths: cruiseData.outbreak.stats.deaths,
    new_cases: cruiseData.outbreak.stats.new_cases,
    countries: cruiseData.outbreak.stats.countries_affected,
    extracted_at: null,
    source_title: null,
    source_url: null,
    from_auto: false,
  };

  const supabase = publicSupabase();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("outbreak_stats")
    .select(
      "cases_total, deaths, new_cases, countries, source_title, source_url, extracted_at",
    )
    .order("extracted_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return fallback;

  const row = data[0] as {
    cases_total: number | null;
    deaths: number | null;
    new_cases: number | null;
    countries: number | null;
    source_title: string | null;
    source_url: string | null;
    extracted_at: string;
  };

  return {
    cases_total: row.cases_total ?? fallback.cases_total,
    deaths: row.deaths ?? fallback.deaths,
    new_cases: row.new_cases ?? fallback.new_cases,
    countries: row.countries ?? fallback.countries,
    extracted_at: row.extracted_at,
    source_title: row.source_title,
    source_url: row.source_url,
    from_auto: true,
  };
}
