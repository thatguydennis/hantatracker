/**
 * Best-effort stats extraction from RSS article titles + summaries.
 *
 * Approach:
 *   - For each article, run regex passes for cases / deaths / countries.
 *   - Patterns require the number to be within a short window of the keyword
 *     so dates and ages don't false-match (e.g. "17-year-old", "May 11").
 *   - Outbreaks only grow: when comparing across articles, keep the maximum
 *     reported value rather than the latest one (which might be a partial
 *     count or quoting an older bulletin).
 *
 * This is intentionally conservative. Misses are preferable to false
 * positives. If a value can't be extracted with confidence we leave the
 * previous stored value in place.
 */

export interface ExtractedStats {
  cases_total: number | null;
  deaths: number | null;
  countries: number | null;
}

export interface ExtractionInput {
  title: string;
  summary: string | null;
}

// Plausible outbreak ranges. Anything outside is rejected as noise.
const RANGE = {
  cases: { min: 1, max: 5_000 },
  deaths: { min: 1, max: 500 },
  countries: { min: 1, max: 60 },
} as const;

interface PatternConfig {
  // The full match must include both a number and a keyword. We use
  // capture-or-look-ahead patterns to allow the number to come before or
  // after the keyword as long as they're within ~30 chars of each other.
  patterns: RegExp[];
  range: { min: number; max: number };
}

// Compile time check: keywords near numbers, with a small word-distance gap.
const numberClose = (kw: string) =>
  new RegExp(`(\\d{1,5})[^\\d\\n]{0,30}${kw}`, "gi");
const numberCloseRev = (kw: string) =>
  new RegExp(`${kw}[^\\d\\n]{0,30}(\\d{1,5})`, "gi");

const configs: Record<keyof ExtractedStats, PatternConfig> = {
  cases_total: {
    patterns: [
      numberClose(
        "(?:confirmed|probable|reported|suspected|total|hantavirus)?\\s*cases?\\b",
      ),
      numberCloseRev(
        "(?:cases?\\s+(?:of\\s+)?hantavirus|cases?\\s+confirmed)",
      ),
      numberClose("infected"),
      numberClose("(?:patients?|people)\\s+(?:infected|hospitali[sz]ed)"),
    ],
    range: RANGE.cases,
  },
  deaths: {
    patterns: [
      numberClose("(?:deaths?|dead|fatalities|died|killed|fatal)\\b"),
      numberCloseRev("(?:dead|deaths?|fatalities)"),
    ],
    range: RANGE.deaths,
  },
  countries: {
    patterns: [
      numberClose("countries?\\b"),
      numberClose("nations?\\b"),
    ],
    range: RANGE.countries,
  },
};

function extractField(
  text: string,
  field: keyof ExtractedStats,
): number | null {
  const cfg = configs[field];
  let best: number | null = null;
  for (const re of cfg.patterns) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const n = Number(m[1]);
      if (!Number.isFinite(n)) continue;
      if (n < cfg.range.min || n > cfg.range.max) continue;
      // Reject "11-year-old" style — number immediately followed by hyphen + year/old
      const tail = text.slice(m.index, m.index + m[0].length + 12);
      if (/^\d+\s*[-–]\s*year/i.test(tail)) continue;
      if (best === null || n > best) best = n;
    }
  }
  return best;
}

export function extractFromArticle(
  article: ExtractionInput,
): ExtractedStats {
  const text = `${article.title}. ${article.summary ?? ""}`;
  return {
    cases_total: extractField(text, "cases_total"),
    deaths: extractField(text, "deaths"),
    countries: extractField(text, "countries"),
  };
}

/** Reduce across many articles — take the highest value per field. */
export function aggregateAcrossArticles(
  articles: ExtractionInput[],
): ExtractedStats & { hits: number } {
  let cases_total: number | null = null;
  let deaths: number | null = null;
  let countries: number | null = null;
  let hits = 0;

  for (const a of articles) {
    const s = extractFromArticle(a);
    if (s.cases_total !== null) {
      cases_total =
        cases_total === null ? s.cases_total : Math.max(cases_total, s.cases_total);
      hits += 1;
    }
    if (s.deaths !== null) {
      deaths = deaths === null ? s.deaths : Math.max(deaths, s.deaths);
    }
    if (s.countries !== null) {
      countries =
        countries === null ? s.countries : Math.max(countries, s.countries);
    }
  }

  return { cases_total, deaths, countries, hits };
}
