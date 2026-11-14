"use client";

import type { ElementType, ReactNode } from "react";

// The friendly skin retires the DedSec text effects. These stay as plain wrappers so the
// components that use them don't need to change.
export function Decode({ as: Tag = "span", className, children }: { as?: ElementType; className?: string; children: ReactNode; duration?: number }) {
  return <Tag className={className}>{children}</Tag>;
}

export function Glitch({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}
