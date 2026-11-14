import type { Metadata } from "next";
import Link from "next/link";
import { Figtree } from "next/font/google";
import { NavLinks } from "@/components/NavLinks";
import { StoryProgress } from "@/components/StoryProgress";
import { Mark } from "@/components/mithril/Mark";
import "./globals.css";

// One friendly, highly readable typeface for everything
const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Liwe: catch lung cancer sooner",
  description:
    "Change how lung cancer is found in a Finnish county and see how many weeks and lives it saves — every number sourced.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-rule bg-[#faf6f0]/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3.5">
            <Link href="/" className="flex items-center gap-2 text-ink" aria-label="liwe home">
              <Mark className="h-8 w-8" />
              <span className="text-[1.6rem] font-[750] leading-none tracking-[-0.035em]">liwe</span>
            </Link>
            <NavLinks />
            <span className="label ml-auto hidden text-ink-faint sm:block">
              Junction 2026 · NoTokens
            </span>
          </div>
          <StoryProgress />
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-rule bg-[#f6efe5]">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-3xl text-xs leading-relaxed text-ink-faint">
              Prototype, not a medical device. Aggregate public data only. No
              patient-level or personal data. Plans services for populations;
              does not assess, diagnose, or triage any individual, and makes no
              treatment or medicine recommendations. Every figure is labelled
              Sourced, Estimate, or Unknown.
            </p>
            <p className="label shrink-0 text-ink-faint">
              Liwe · catch lung cancer sooner
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
