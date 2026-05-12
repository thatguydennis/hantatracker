import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HantaVirus Tracker — map, news, and explainers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #1A2332 0%, #2E4A75 60%, #4A6FA5 100%)",
          color: "#FAFAF7",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Arial",
        }}
      >
        {/* Top row: mouse mark + name lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              background: "#FAFAF7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="64" height="64" viewBox="0 0 32 32">
              <circle cx="9" cy="11" r="5" fill="#4A6FA5" />
              <circle cx="23" cy="11" r="5" fill="#4A6FA5" />
              <circle cx="16" cy="19" r="8.5" fill="#4A6FA5" />
              <circle cx="9" cy="11" r="2.2" fill="#FAFAF7" />
              <circle cx="23" cy="11" r="2.2" fill="#FAFAF7" />
              <circle cx="12.6" cy="18" r="1.3" fill="#FAFAF7" />
              <circle cx="19.4" cy="18" r="1.3" fill="#FAFAF7" />
              <ellipse cx="16" cy="22.4" rx="1.4" ry="1.05" fill="#E24B4A" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 28,
                color: "#A8B4C2",
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Independent tracker
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: -2,
                marginTop: 6,
              }}
            >
              <span>Hanta</span>
              <span style={{ color: "#7BA0D4" }}>Virus</span>
              <span
                style={{
                  marginLeft: 16,
                  fontWeight: 400,
                  color: "#A8B4C2",
                }}
              >
                Tracker
              </span>
            </div>
          </div>
        </div>

        {/* Bottom row: tagline + status pill */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 38,
              lineHeight: 1.25,
              maxWidth: 950,
              color: "#FAFAF7",
            }}
          >
            Map, news, and explainers. The 2026 MV Hondius cluster, live.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(226, 75, 74, 0.18)",
                border: "2px solid #E24B4A",
                color: "#FFA8A7",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: "#E24B4A",
                }}
              />
              Active outbreak
            </div>
            <div style={{ fontSize: 22, color: "#A8B4C2" }}>
              hantavirustracker.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
