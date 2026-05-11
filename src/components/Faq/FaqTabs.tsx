"use client";

import { useState } from "react";
import { Prose } from "@/components/Prose";

interface FaqSection {
  title: string;
  body: string;
}

interface FaqTabsProps {
  sections: FaqSection[];
}

export function FaqTabs({ sections }: FaqTabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        role="tablist"
        aria-label="FAQ sections"
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1"
      >
        {sections.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={`flex-1 rounded-md px-3 py-2 text-body-sm font-medium transition-colors ${
                selected
                  ? "bg-brand-primary text-text-inverse"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
              }`}
            >
              {s.title}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-6">
        <Prose markdown={sections[active]?.body ?? ""} />
      </div>
    </div>
  );
}
