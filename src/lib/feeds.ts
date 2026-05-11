export type FeedCategory = "official" | "news" | "research";

export interface FeedSource {
  source: string;
  url: string;
  category: FeedCategory;
  // If true, apply the keyword filter. Health-authority feeds covering many
  // diseases need filtering; a hantavirus-only feed (rare) would not.
  filter: boolean;
}

// From prep/data-sources.md.
export const feeds: FeedSource[] = [
  // Tier 1 — health authorities (filtered, hantavirus-relevant only)
  {
    source: "WHO",
    url: "https://www.who.int/feeds/entity/csr/don/en/rss.xml",
    category: "official",
    filter: true,
  },
  {
    source: "CDC",
    url: "https://tools.cdc.gov/api/v2/resources/media/132608.rss",
    category: "official",
    filter: true,
  },
  {
    source: "ECDC",
    url: "https://www.ecdc.europa.eu/en/news-events/rss",
    category: "official",
    filter: true,
  },
  {
    source: "PAHO",
    url: "https://www3.paho.org/hq/index.php?option=com_content&view=newsfeed&Itemid=180&lang=en",
    category: "official",
    filter: true,
  },

  // Tier 2 — major news outlets (all filtered to hantavirus keywords)
  {
    source: "Reuters",
    url: "https://www.reutersagency.com/feed/?best-sectors=health&post_type=best",
    category: "news",
    filter: true,
  },
  {
    source: "BBC",
    url: "https://feeds.bbci.co.uk/news/health/rss.xml",
    category: "news",
    filter: true,
  },
  {
    source: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    category: "news",
    filter: true,
  },
  {
    source: "ABC",
    url: "https://abcnews.go.com/abcnews/healthheadlines",
    category: "news",
    filter: true,
  },
  {
    source: "CBS",
    url: "https://www.cbsnews.com/latest/rss/health",
    category: "news",
    filter: true,
  },
  {
    source: "NPR",
    url: "https://feeds.npr.org/103/rss.xml",
    category: "news",
    filter: true,
  },
  {
    source: "PBS",
    url: "https://www.pbs.org/newshour/feeds/rss/topic/health",
    category: "news",
    filter: true,
  },
  {
    source: "CNN",
    url: "http://rss.cnn.com/rss/edition_health.rss",
    category: "news",
    filter: true,
  },
  {
    source: "CNBC",
    url: "https://www.cnbc.com/id/10000108/device/rss/rss.html",
    category: "news",
    filter: true,
  },
];

// Case-insensitive partial match. From prep/data-sources.md keyword filter.
export const keywordPatterns = [
  /hantavirus/i,
  /andes\s*virus/i,
  /andes\s*orthohantavirus/i,
  /mv\s*hondius/i,
  /\bhondius\b/i,
  /hantavirus\s*pulmonary\s*syndrome/i,
  /hps\s*outbreak/i,
];

export function matchesKeywords(text: string): boolean {
  return keywordPatterns.some((re) => re.test(text));
}
