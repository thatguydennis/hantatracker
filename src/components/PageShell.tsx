interface PageShellProps {
  title?: string;
  subtitle?: string;
  /** Override the default max-w-4xl when a page needs more room. */
  width?: "default" | "wide";
  children: React.ReactNode;
}

const widthClass = {
  default: "max-w-4xl",
  wide: "max-w-7xl",
} as const;

/** Wraps a standalone content page so every route shares the same container,
 * heading, and spacing rhythm. Skip the header by omitting `title`. */
export function PageShell({
  title,
  subtitle,
  width = "default",
  children,
}: PageShellProps) {
  return (
    <div
      className={`mx-auto w-full ${widthClass[width]} px-4 py-6 md:px-6 md:py-10`}
    >
      {title && (
        <header className="mb-8">
          <h1 className="text-h1 font-semibold text-text-primary md:text-display">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-body text-text-secondary">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </div>
  );
}
