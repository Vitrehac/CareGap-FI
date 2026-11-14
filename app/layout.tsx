import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
import { NavLinks } from "@/components/NavLinks";
import { StoryProgress } from "@/components/StoryProgress";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-schibsted",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareGap FI: measure the CT handoff first",
  description:
    "County pilot configurator for Finland’s missing primary-care CT clock: pick a county, configure a 12-month experiment, get a pilot brief.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${schibsted.variable} ${newsreader.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center gap-5 px-6 py-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-ink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/caregap-mark.svg"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="font-display text-base tracking-[-0.02em]">
                CareGap<span className="text-accent"> FI</span>
              </span>
            </Link>
            <NavLinks />
            <span className="ml-auto hidden text-xs text-ink-faint sm:block">
              Junction 2026 · NoTokens
            </span>
          </div>
          <StoryProgress />
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-rule bg-paper-raised/80">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-3xl text-xs leading-relaxed text-ink-faint">
              Prototype, not a medical device. Aggregate public data only. No
              patient-level or personal data. Plans services for populations;
              does not assess, diagnose, or triage any individual, and makes no
              treatment or medicine recommendations. Every figure is labelled
              Sourced, Estimate, or Unknown.
            </p>
            <p className="shrink-0 text-xs text-ink-faint">
              CareGap FI · measure the CT handoff first
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
