interface LogoProps {
  /** Pixel size of the icon mark. Wordmark scales independently via className. */
  size?: number;
  /** Render the "HantaVirus Tracker" wordmark next to the mark. */
  withWordmark?: boolean;
  /** Tailwind class for the wordmark text size (text-h3 default for TopBar). */
  wordmarkClassName?: string;
  className?: string;
}

/**
 * Brand lockup: mouse mark + wordmark. The mark uses fixed hex values
 * (not theme tokens) so the brand identity reads identically in light
 * and dark mode. Wordmark text colors flip with theme via tokens.
 *
 * The mark geometry mirrors the /icon.svg favicon — three overlapping
 * circles for head + ears, two eyes, one red nose accent.
 */
export function Logo({
  size = 28,
  withWordmark = true,
  wordmarkClassName = "text-h3",
  className,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        role="img"
        aria-label={withWordmark ? undefined : "HantaVirus Tracker"}
        aria-hidden={withWordmark || undefined}
      >
        <rect width="32" height="32" rx="7" fill="#4A6FA5" />
        <g fill="#FAFAFA">
          <circle cx="9" cy="11" r="5" />
          <circle cx="23" cy="11" r="5" />
          <circle cx="16" cy="19" r="8.5" />
        </g>
        <circle cx="9" cy="11" r="2.2" fill="#4A6FA5" />
        <circle cx="23" cy="11" r="2.2" fill="#4A6FA5" />
        <circle cx="12.6" cy="18" r="1.3" fill="#1A2332" />
        <circle cx="19.4" cy="18" r="1.3" fill="#1A2332" />
        <ellipse cx="16" cy="22.4" rx="1.4" ry="1.05" fill="#E24B4A" />
      </svg>
      {withWordmark && (
        <span
          className={`font-display ${wordmarkClassName} font-semibold tracking-tight`}
        >
          <span className="text-text-primary">Hanta</span>
          <span className="text-brand-primary">Virus</span>
          <span className="ml-1 font-normal text-text-secondary">Tracker</span>
        </span>
      )}
    </span>
  );
}
