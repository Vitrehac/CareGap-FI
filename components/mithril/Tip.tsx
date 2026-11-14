import type { ReactNode } from "react";

/**
 * Hover / focus explainer for a number or a unit: what it is, how to read it, how it compares.
 * Pure CSS (group-hover / focus-within), so it works in server and client components alike.
 * The dotted underline on `label`-style triggers tells people there is more to read.
 */
export function Tip({
  children,
  title,
  body,
  align = "center",
  className = "",
  underline = true,
}: {
  children: ReactNode;
  title?: string;
  body: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  underline?: boolean;
}) {
  const pos =
    align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span tabIndex={0} className={`tip group/tip relative inline-block cursor-help outline-none ${className}`}>
      <span className={underline ? "decoration-ink-faint/60 underline decoration-dotted underline-offset-4" : ""}>
        {children}
      </span>
      <span
        role="tooltip"
        className={`pointer-events-none invisible absolute bottom-full z-50 mb-2 w-[min(19rem,80vw)] translate-y-1 border border-rule bg-paper-raised p-3.5 text-left text-[0.8rem] leading-relaxed font-normal tracking-normal normal-case text-ink-soft opacity-0 shadow-[0_8px_30px_rgb(0_0_0/0.6)] transition-[opacity,transform] duration-150 group-hover/tip:visible group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus/tip:visible group-focus/tip:translate-y-0 group-focus/tip:opacity-100 ${pos}`}
      >
        <span className="absolute inset-x-0 top-0 h-[2px] bg-accent" />
        {title && <span className="label mb-1.5 block text-accent">{title}</span>}
        <span className="block font-sans">{body}</span>
      </span>
    </span>
  );
}
