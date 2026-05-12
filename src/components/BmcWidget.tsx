"use client";

import { useEffect } from "react";

/**
 * Injects the Buy Me a Coffee widget script directly into <body>.
 *
 * Why not next/script? The BMC bootstrap reads its config from the
 * `data-*` attributes on its own <script> element at parse time.
 * next/script wraps and serializes the tag through React's render path,
 * and the data-* attributes don't always make it onto the live DOM
 * node in time. A plain document.createElement('script') guarantees
 * the attributes are on the element BMC reads.
 */
export function BmcWidget() {
  useEffect(() => {
    if (document.querySelector('script[data-name="BMC-Widget"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.async = true;
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-id", "denniscomandante");
    script.setAttribute(
      "data-description",
      "Support me on Buy me a coffee!",
    );
    script.setAttribute(
      "data-message",
      "If you think my work helped you, a coffee goes a long way!",
    );
    script.setAttribute("data-color", "#FF5F5F");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");

    document.body.appendChild(script);
  }, []);

  return null;
}
