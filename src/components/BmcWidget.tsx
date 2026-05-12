"use client";

import { useEffect, useState } from "react";
import { Coffee } from "lucide-react";

/**
 * Buy Me a Coffee widget with a guaranteed-visible fallback.
 *
 * Why:
 *   - Many ad-blockers (uBlock, AdGuard, Brave Shields) strip
 *     `cdnjs.buymeacoffee.com` and the official BMC widget never injects.
 *   - The BMC bootstrap also fails silently when the profile slug isn't
 *     fully published, so the script "loads" but never paints anything.
 *
 * Strategy:
 *   1. Inject the official BMC script (data-* attributes on the live
 *      <script> tag — that's what the BMC bootstrap reads at runtime).
 *   2. Render our own fallback pill anchored bottom-right. If the BMC
 *      script has injected its own button within 2.5s of mount, we hide
 *      our fallback. Otherwise the fallback stays — users always have a
 *      working support CTA.
 *
 * The mobile drawer was removed in Round 7, so 18px bottom margin works on
 * both viewports without further offset.
 */
export function BmcWidget() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Don't double-inject on Fast Refresh / re-mount.
    const existing = document.querySelector(
      'script[data-name="BMC-Widget"][data-id="denniscomandante"]',
    );

    if (!existing) {
      const script = document.createElement("script");
      script.setAttribute("data-name", "BMC-Widget");
      script.setAttribute("data-cfasync", "false");
      script.setAttribute("data-id", "denniscomandante");
      script.setAttribute(
        "data-description",
        "Support me on Buy me a coffee!",
      );
      script.setAttribute(
        "data-message",
        "If you think this app helped you, a coffee goes a long way! Thanks!",
      );
      script.setAttribute("data-color", "#40DCA5");
      script.setAttribute("data-position", "Right");
      script.setAttribute("data-x_margin", "18");
      script.setAttribute("data-y_margin", "18");
      // src is set last so the browser has all data-* set before fetching starts
      script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Detect whether the official widget injected. BMC's bootstrap creates
    // an element with id `bmc-wbtn`. We check after a delay; if it's not
    // there, show our fallback. We re-check periodically so the fallback
    // disappears the moment the official widget appears (e.g. on a slow
    // connection).
    let cancelled = false;
    let attempts = 0;

    function check() {
      if (cancelled) return;
      const injected =
        document.getElementById("bmc-wbtn") ||
        document.querySelector("[id^='bmc-wbtn']");
      if (injected) {
        setShowFallback(false);
        return;
      }
      attempts += 1;
      // First decision at ~2.5s, then keep watching for 12s in case the
      // CDN is slow but not blocked.
      if (attempts >= 5) setShowFallback(true);
      if (attempts < 24) setTimeout(check, 500);
    }

    const initial = setTimeout(check, 500);

    return () => {
      cancelled = true;
      clearTimeout(initial);
    };
  }, []);

  if (!showFallback) return null;

  return (
    <a
      href="https://www.buymeacoffee.com/denniscomandante"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      // BMC official mint #40DCA5. Inline so it survives even if Tailwind
      // purges an unused class name. This is the one approved exception
      // to the "tokens only" rule because it's the third-party brand color.
      style={{ backgroundColor: "#40DCA5", color: "#0E1F1A" }}
      className="fixed bottom-[18px] right-[18px] z-[9999] inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5"
    >
      <Coffee size={18} strokeWidth={2} aria-hidden />
      <span>Buy me a coffee</span>
    </a>
  );
}
