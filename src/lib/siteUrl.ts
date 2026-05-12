/**
 * Canonical site URL used by `metadataBase`, sitemap.xml, and robots.txt.
 *
 * Resolution order:
 *  1. `NEXT_PUBLIC_SITE_URL` — explicit override (set this in prod).
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — populated on Vercel production builds.
 *  3. `VERCEL_BRANCH_URL` / `VERCEL_URL` — preview deploys; better than
 *     publishing `localhost` to crawlers if a preview build is ever indexed.
 *  4. `http://localhost:3000` — local dev.
 *
 * Centralised because the same fallback chain is used in three places and
 * "localhost in the sitemap" is a foot-gun.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  const vercel = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel}`;
  }
  return "http://localhost:3000";
}
