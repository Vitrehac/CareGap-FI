"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Glitch } from "@/components/mithril/Effects";

const NAV = [
  { href: "/", label: "Gap" },
  { href: "/pilot", label: "Scenario" },
  { href: "/sources", label: "Sources" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 sm:gap-5" aria-label="Primary">
      {NAV.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`label transition-colors ${
              active ? "text-ink" : "text-ink-faint hover:text-accent"
            }`}
          >
            <Glitch>{item.label}</Glitch>
          </Link>
        );
      })}
    </nav>
  );
}
