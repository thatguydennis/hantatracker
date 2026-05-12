"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "hanta-theme";

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Reads localStorage + matchMedia, both client-only. Lazy useState
    // initialisers can't see them during SSR, so we sync on mount.
    const stored = localStorage.getItem(STORAGE_KEY);
    const systemDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : systemDark;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(dark);
    applyTheme(dark ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next ? "dark" : "light");
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md text-text-primary hover:bg-surface-muted md:h-9 md:w-9"
    >
      {/* Render both icons but show one — avoids hydration mismatch */}
      <span aria-hidden className="md:size-5">
        {mounted && isDark ? (
          <Sun size={20} strokeWidth={1.5} />
        ) : (
          <Moon size={20} strokeWidth={1.5} />
        )}
      </span>
    </button>
  );
}
