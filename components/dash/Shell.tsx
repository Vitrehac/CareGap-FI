"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/mithril/Mark";

const NAV = [
  { href: "/dashboard", label: "Plans", icon: "M4 5h7v6H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 13h7v6H4z" },
  { href: "/dashboard/new", label: "New plan", icon: "M12 5v14M5 12h14" },
  { href: "/dashboard/compare", label: "Compare plans", icon: "M5 19V9M12 19V5M19 19v-7" },
  { href: "/dashboard/data", label: "Data sources", icon: "M12 4c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" },
];

function Nav({ path }: { path: string }) {
  const active = (href: string) => (href === "/dashboard" ? path === "/dashboard" || path.startsWith("/dashboard/plan") : path.startsWith(href));
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto lg:mx-0 lg:mt-8 lg:flex-col" aria-label="Dashboard">
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={active(n.href) ? "page" : undefined}
          className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            active(n.href) ? "bg-accent-soft text-accent" : "text-ink-soft hover:bg-sand-soft hover:text-ink"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={n.icon} />
          </svg>
          <span className="hidden sm:inline">{n.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function ActiveNav() {
  return <Nav path={usePathname()} />;
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 z-20 border-b border-rule bg-paper lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center gap-4 px-4 py-3 lg:flex-col lg:items-stretch lg:px-4 lg:py-6">
          <Link href="/" className="flex items-center gap-2 text-ink lg:px-2" aria-label="liwe home">
            <Mark className="h-7 w-7" />
            <span className="text-[1.45rem] font-[750] leading-none tracking-[-0.035em]">liwe</span>
          </Link>
          <Suspense fallback={<Nav path="" />}>
            <ActiveNav />
          </Suspense>
          <div className="mt-auto hidden lg:block">
            <p className="rounded-xl bg-sand-soft px-3 py-3 text-xs leading-relaxed text-ink-faint">
              Prototype · plans are saved in this browser. Pathway data is a demo feed until a county connects its records.
            </p>
          </div>
        </div>
      </aside>
      <div className="min-w-0 bg-sand-soft">{children}</div>
    </div>
  );
}
