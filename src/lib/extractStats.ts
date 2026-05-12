/**
 * Best-effort stats extraction from RSS article titles + summaries.
 *
 * Guarded by:
 *  - Each candidate number must sit within ~30 chars of its keyword.
 *  - Numbers must fall inside realistic outbreak ranges (a hantavirus cluster
 *    of 5,000 cases is implausible; 150 deaths even more so).
 *  - "11-year-old" / "May 11" patterns are rejected.
 *  - Snapshots are only saved when `cases_total` is found. Deaths and
 *    countries are then pulled from the SAME article — never aggregated
 *    across feeds — so a snapshot stays internally consistent. Mixing
 *    cases from one outlet with deaths from another causes runaway counts
 *    when one outlet quotes historical context.
 *  - When comparing multiple bulletins, we keep the one with the highest
 *    case count (outbreaks only grow); never max separately by field.
 */

export interface ExtractedStats {
  cases_total: number | null;
  deaths: number | null;
  countries: number | null;
}

export interface ExtractionInput {
  id?: string;
  title: string;
  summary: string | null;
  url?: string;
}

const RANGE = {
  cases: { min: 1, max: 1_000 },
  deaths: { min: 1, max: 50 },
  countries: { min: 1, max: 30 },
} as const;

const numberClose = (kw: string) =>
  new RegExp(`(\\d{1,5})[^\\d\\n]{0,30}${kw}`, "gi");
const numberCloseRev = (kw: string) =>
  new RegExp(`${kw}[^\\d\\n]{0,30}(\\d{1,5})`, "gi");

interface PatternConfig {
  patterns: RegExp[];
  range: { min: number; max: number };
}

const configs: Record<keyof ExtractedStats, PatternConfig> = {
  cases_total: {
    patterns: [
      numberClose(
        "(?:confirmed|probable|reported|suspected|total|hantavirus)?\\s*cases?\\b",
      ),
      numberCloseRev(
        "(?:cases?\\s+(?:of\\s+)?hantavirus|cases?\\s+confirmed)",
      ),
      numberClose("infected\\b"),
      numberClose("(?:patients?|people)\\s+(?:infected|hospitali[sz]ed)"),
    ],
    range: RANGE.cases,
  },
  deaths: {
    patterns: [
      numberClose("(?:deaths?|dead|fatalities|died|killed)\\b"),
      numberCloseRev("(?:dead|deaths?|fatalities)\\b"),
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

// Reject text that looks like historical context — "since 1993", "estimated
// total", "annually", etc. Those numbers are cumulative, not current.
const HISTORICAL_CONTEXT = /(since\s+19|since\s+20\d\d|historical|annually|every year|estimated total|cumulative|to date|all time)/i;

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
      // Reject ages like "17-year-old"
      const tail = text.slice(m.index, m.index + m[0].length + 12);
      if (/^\d+\s*[-–]\s*year/i.test(tail)) continue;
      // Reject when the match is inside historical context (within ±40 chars)
      const ctx = text.slice(
        Math.max(0, m.index - 40),
        m.index + m[0].length + 40,
      );
      if (HISTORICAL_CONTEXT.test(ctx)) continue;
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

export interface AnchoredSnapshot extends ExtractedStats {
  source_article_id: string | null;
  source_title: string | null;
  source_url: string | null;
}

/**
 * Pick the most credible single article: the one reporting the highest
 * `cases_total`. Use that article's own deaths/countries too. If no article
 * has a cases number, return null — no snapshot is written.
 */
export function pickAnchorSnapshot(
  articles: ExtractionInput[],
): AnchoredSnapshot | null {
  let bestArticle: ExtractionInput | null = null;
  let bestStats: ExtractedStats | null = null;

  for (const a of articles) {
    const s = extractFromArticle(a);
    if (s.cases_total === null) continue;
    if (bestStats === null || s.cases_total > (bestStats.cases_total ?? 0)) {
      bestArticle = a;
      bestStats = s;
    }
  }

  if (!bestArticle || !bestStats) return null;

  return {
    cases_total: bestStats.cases_total,
    deaths: bestStats.deaths,
    countries: bestStats.countries,
    source_article_id: bestArticle.id ?? null,
    source_title: bestArticle.title,
    source_url: bestArticle.url ?? null,
  };
}
