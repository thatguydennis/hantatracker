"use client";

import dynamic from "next/dynamic";

const HantaMap = dynamic(
  () => import("./HantaMap").then((m) => m.HantaMap),
  {
    ssr: false,
    loading: () => (
      <div
        aria-label="Map loading"
        className="h-full w-full animate-pulse rounded-lg bg-surface-muted"
      />
    ),
  },
);

export function MapClient() {
  return <HantaMap />;
}
