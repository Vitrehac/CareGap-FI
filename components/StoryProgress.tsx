"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STEPS = [
  { id: "gap", href: "/", label: "Gap", hash: null as string | null },
  {
    id: "county",
    href: "/pilot#county",
    label: "County",
    hash: "county",
  },
  {
    id: "experiment",
    href: "/pilot#configure",
    label: "Scenario",
    hash: "configure",
  },
  {
    id: "brief",
    href: "/pilot#brief",
    label: "Result",
    hash: "brief",
  },
] as const;

function stepIndex(pathname: string, hash: string): number {
  if (pathname === "/" || pathname === "") return 0;
  if (pathname.startsWith("/sources")) return 0;
  if (pathname.startsWith("/pilot")) {
    if (hash === "brief") return 3;
    if (hash === "configure") return 2;
    return 1;
  }
  return 0;
}

export function StoryProgress() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () => setHash(window.location.hash.replace(/^#/, ""));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);

  useEffect(() => {
    if (!pathname.startsWith("/pilot")) return;
    const ids = ["county", "configure", "brief"];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        const next = visible.target.id;
        setHash(next);
        if (window.location.hash.replace(/^#/, "") !== next) {
          window.history.replaceState(null, "", `#${next}`);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [pathname]);

  const active = stepIndex(pathname, hash);
  // /pilot runs its own step-by-step wizard with a stepper that shows the answers
  if (pathname.startsWith("/pilot")) return null;

  return (
    <div className="border-t border-rule/70 bg-paper/60">
      <nav
        aria-label="You are here"
        className="mx-auto flex max-w-5xl items-center gap-1 px-6 py-2 sm:gap-2"
      >
        <span className="label mr-1 hidden text-ink-faint sm:inline">
          You are here
        </span>
        {STEPS.map((step, i) => {
          const isActive = i === active;
          const isDone = i < active;
          return (
            <span key={step.id} className="flex items-center gap-1 sm:gap-2">
              {i > 0 && (
                <span aria-hidden className="text-ink-faint/50 select-none">
                  /
                </span>
              )}
              <Link
                href={step.href}
                aria-current={isActive ? "step" : undefined}
                className={`label px-2 py-1 transition-colors ${
                  isActive
                    ? "bg-accent-soft text-accent"
                    : isDone
                      ? "text-ink hover:text-accent"
                      : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                <span className="nums mr-1 opacity-70">{i + 1}</span>
                {step.label}
              </Link>
            </span>
          );
        })}
      </nav>
    </div>
  );
}
