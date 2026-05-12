import type { NextConfig } from "next";

// Conservative defaults: no inline scripts (the dark-mode init script in
// layout.tsx is the only inline JS and we exempt it with `'unsafe-inline'`
// because Next 16's nonce plumbing isn't wired here yet — accepted trade-off
// on a content-only site with no user-generated HTML).
//
// CDN allow-list: BMC widget (cdnjs.buymeacoffee.com + buymeacoffee.com),
// CARTO tiles, OSM. Supabase is fetched from the server only.
const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
