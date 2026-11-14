// The Liwe mark: the "w" drawn as one soft breath (in, out, in). Green by default.
export function Mark({ className = "h-7 w-7", color = "var(--color-accent)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M7 24c7 0 8 18 13 18s6-18 12-18 7 18 12 18 6-18 13-18"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
