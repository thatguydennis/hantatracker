"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

function readDocTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// Subscribes to the `.dark` class on <html> so consumers re-render when the
// theme flips. Used by HantaMap to swap the tile basemap.
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(readDocTheme);

  useEffect(() => {
    // Initial sync from DOM — useState's lazy initialiser can't read the
    // class during SSR. Then subscribe to .dark class flips on <html>.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readDocTheme());
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(readDocTheme());
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
