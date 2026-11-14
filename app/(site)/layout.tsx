import Link from "next/link";
import { Suspense } from "react";
import { NavLinks } from "@/components/NavLinks";
import { Mark } from "@/components/mithril/Mark";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-rule bg-[#faf6f0]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2 text-ink" aria-label="liwe home">
            <Mark className="h-8 w-8" />
            <span className="text-[1.6rem] font-[750] leading-none tracking-[-0.035em]">liwe</span>
          </Link>
          <Suspense fallback={null}>
            <NavLinks />
          </Suspense>
          <Link href="/dashboard" className="cta label ml-auto bg-accent px-4 py-2 text-paper">
            Open dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-rule bg-[#f6efe5]">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed text-ink-faint">
            Prototype, not a medical device. Plans services for populations; does not assess, diagnose or triage any
            individual. Charts on the demo feed are mock weekly totals, not patient records.
          </p>
          <p className="label shrink-0 text-ink-faint">Liwe · Junction 2026 · NoTokens</p>
        </div>
      </footer>
    </div>
  );
}
