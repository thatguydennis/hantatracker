import { Coffee } from "lucide-react";

const BMC_URL = "https://www.buymeacoffee.com/denniscomandante";

/**
 * Custom floating Support button. Replaces the official BMC widget script —
 * easier to style, doesn't depend on a third-party bootstrap, and shows
 * reliably on both desktop and mobile. Tap → opens the BMC page in a new tab.
 *
 * Position is fixed bottom-right. On mobile it sits above the drawer's
 * 198px collapsed peek; on desktop it sits at 18px like the original widget.
 */
export function SupportButton() {
  return (
    <a
      href={BMC_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Support the site on Buy Me a Coffee"
      className="fixed bottom-[210px] right-4 z-30 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-body-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 lg:bottom-5 lg:right-5 lg:z-50"
      style={{
        backgroundColor: "#FF5F5F",
        color: "#ffffff",
        boxShadow: "0 6px 20px -4px rgba(255, 95, 95, 0.45)",
      }}
    >
      <Coffee size={18} strokeWidth={2} aria-hidden />
      <span>Buy me a coffee</span>
    </a>
  );
}
