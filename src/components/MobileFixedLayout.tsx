"use client";

import { useEffect } from "react";

/**
 * Locks body scroll on mobile (<1024px) for the home page. Body becomes a
 * 100dvh fixed surface; the map and drawer scroll independently within it.
 * Footer is hidden on this layout (CSS rule in globals.css). Cleans up on
 * unmount so navigating to /news etc. restores normal scrolling.
 */
export function MobileFixedLayout() {
  useEffect(() => {
    document.body.classList.add("mobile-fixed");
    return () => {
      document.body.classList.remove("mobile-fixed");
    };
  }, []);

  return null;
}
