"use client";

import Link from "next/link";
import { Menu, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/science", label: "Science" },
  { href: "/faq", label: "FAQ" },
];

const secondaryItems = [
  { href: "/privacy", label: "Privacy" },
  { href: "/legal", label: "Legal" },
];

export function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 md:h-16 md:px-6">
        <Link
          href="/"
          className="text-h3 font-semibold text-text-primary tracking-tight"
        >
          Hantavirus tracker
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
          <span
            className="text-meta text-text-tertiary tabular-nums"
            aria-label="Last updated"
          >
            Updated just now
          </span>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/feedback"
            aria-label="Send feedback"
            title="Send feedback"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-text-primary hover:bg-surface-muted md:h-9 md:w-9"
          >
            <MessageSquare size={20} strokeWidth={1.5} aria-hidden />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-text-primary hover:bg-surface-muted md:hidden"
          >
            {open ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-border bg-surface md:hidden"
        >
          <ul className="flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center text-body font-medium text-text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {secondaryItems.map((item) => (
              <li key={item.href} className="border-t border-border">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center text-body-sm text-text-secondary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-border pt-2 mt-1">
              <span className="text-meta text-text-tertiary tabular-nums">
                Updated just now
              </span>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
