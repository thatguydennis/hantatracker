"use client";

import { useEffect } from "react";

/**
 * Injects the official Buy Me a Coffee widget script directly into <body>.
 *
 * Why direct DOM injection (not next/script)? The BMC bootstrap reads its
 * config from the `data-*` attributes on the live <script> element. Using
 * document.createElement + setAttribute guarantees those attrs are present
 * on the actual DOM node, which we found is the only reliable way to get
 * the widget to render on first paint.
 */
export function BmcWidget() {
  useEffect(() => {
    // Don't double-inject on Fast Refresh / re-mount.
    if (
      document.querySelector(
        'script[data-name="BMC-Widget"][data-id="denniscomandante"]',
      )
    ) {
      return;
    }

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
  }, []);

  return null;
}
