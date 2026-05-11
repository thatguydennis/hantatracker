import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface lg:mt-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6 md:py-8">
        <div className="flex flex-col gap-1">
          <span className="text-body-sm font-semibold text-text-primary">
            Hantavirus tracker
          </span>
          <span className="text-meta text-text-tertiary">
            Independent. Not affiliated with any health agency or news outlet.
          </span>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm">
            <li>
              <Link
                href="/science"
                className="text-text-secondary hover:text-text-primary"
              >
                Science
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-text-secondary hover:text-text-primary"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-text-secondary hover:text-text-primary"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/legal"
                className="text-text-secondary hover:text-text-primary"
              >
                Legal
              </Link>
            </li>
            <li>
              <a
                href="mailto:contact@hantavirus.example"
                className="text-text-secondary hover:text-text-primary"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto w-full max-w-7xl border-t border-border px-4 py-3 text-meta text-text-tertiary md:px-6">
        Information on this site is not medical advice. If you have symptoms or
        believe you may have been exposed, contact a healthcare professional
        or your national public health authority.
      </div>
    </footer>
  );
}
