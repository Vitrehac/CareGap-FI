"use client";

import Link from "next/link";
import { NordicClocks } from "@/components/NordicClocks";
import { Tag } from "@/components/Provenance";
import { DEFAULT_COUNTY, national } from "@/lib/data";

const NORDIC_MEN = [
  { country: "SE", value: 31.3 },
  { country: "NO", value: 30.8 },
  { country: "IS", value: 29.0 },
  { country: "DK", value: 28.1 },
  { country: "FI", value: 17.9 },
];

function HeroMark() {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-20 w-20 sm:h-24 sm:w-24"
      aria-hidden
    >
      <path
        className="motion-mark-ring"
        d="M186 54 A98 98 0 1 1 70 54"
        fill="none"
        stroke="currentColor"
        strokeWidth="22"
        strokeLinecap="butt"
      />
      <g className="motion-mark-hand">
        <path
          d="M128 128 L176 92"
          fill="none"
          stroke="#1E4D8C"
          strokeWidth="16"
          strokeLinecap="square"
        />
        <path
          d="M128 128 V60"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="square"
        />
        <circle cx="128" cy="128" r="10" fill="currentColor" />
        <circle cx="200" cy="70" r="12" fill="#A61C1C" />
      </g>
    </svg>
  );
}

export function HomeCockpit() {
  const maxBar = 32.7;

  return (
    <div>
      {/* First viewport: brand + one line + one CTA only */}
      <section className="flex min-h-[calc(100dvh-7.5rem)] flex-col justify-center border-b border-rule py-16 sm:py-20">
        <div className="max-w-2xl">
          <div className="text-ink">
            <HeroMark />
          </div>
          <p className="font-display mt-8 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            CareGap<span className="text-accent"> FI</span>
          </p>
          <p className="mt-3 text-base font-medium text-accent sm:text-lg">
            Measure the CT handoff first.
          </p>
          <h1 className="mt-6 max-w-xl text-xl leading-snug text-ink-soft sm:text-2xl">
            County pilot configurator for Finland’s missing primary-care CT
            clock.
          </h1>
          <div className="mt-10">
            <Link
              href={`/pilot?county=${DEFAULT_COUNTY}`}
              className="inline-flex rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Configure a 12-month experiment
            </Link>
            <p className="mt-3 text-sm text-ink-faint">
              Starts on Kainuu. Pick county → set clocks → screenshot the brief.
            </p>
          </div>
        </div>
      </section>

      {/* One job: the gap */}
      <section className="border-b border-rule py-14">
        <h2 className="font-display max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
          Finnish lung-cancer survival sits last in the Nordics. Peers time the
          CT handoff; Finland still gates it.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          Finnish health centres can usually order a chest X-ray, not a CT.
          SE/DK/NO build primary-care or filter CT into the pathway. Satakunta
          already runs a direct primary-care CT route (press only, unevaluated).
          CareGap FI packages that route as a measured county experiment:
          process endpoint, comparator, stop rule.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <p className="text-sm text-ink-soft">
            Men, 5-year relative survival (NORDCAN)
          </p>
          <Tag kind="sourced" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {NORDIC_MEN.map((c, i) => {
            const isFi = c.country === "FI";
            return (
              <div
                key={c.country}
                className="flex min-w-[4.5rem] flex-1 items-center gap-2"
              >
                <span
                  className={`w-6 text-xs ${
                    isFi ? "font-semibold text-alarm" : "text-ink-faint"
                  }`}
                >
                  {c.country}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-sm bg-paper-raised">
                  <div
                    className={`motion-bar h-full rounded-sm ${
                      isFi ? "bg-alarm" : "bg-accent/45"
                    }`}
                    style={{
                      width: `${(c.value / maxBar) * 100}%`,
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
                <span
                  className={`nums w-10 text-right text-xs ${
                    isFi ? "font-semibold text-alarm" : "text-ink-faint"
                  }`}
                >
                  {c.value.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-ink-faint">
          Sweden budgets {national.swedenReferralToCtResultDays} days from
          referral decision to a chest imaging answer in SVF filter design.
        </p>
      </section>

      {/* One job: the path */}
      <section className="border-b border-rule py-14">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
          Four steps. One Monday brief.
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "1",
              t: "Gap",
              d: "See why the CT handoff is the actionable system feature.",
            },
            {
              n: "2",
              t: "County",
              d: "Pick a wellbeing-services county. Demand is pre-sized.",
            },
            {
              n: "3",
              t: "Experiment",
              d: "Toggle the route, lock a 12-month window and process clock.",
            },
            {
              n: "4",
              t: "Brief",
              d: "Screenshot the pilot brief: comparator, endpoint, stop rule.",
            },
          ].map((s) => (
            <li key={s.n} className="border-t border-rule pt-4">
              <p className="nums text-sm font-semibold text-accent">{s.n}</p>
              <p className="mt-2 font-display text-lg font-semibold text-ink">
                {s.t}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Link
            href={`/pilot?county=${DEFAULT_COUNTY}`}
            className="inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start on Kainuu
          </Link>
        </div>
      </section>

      <section id="nordic-clocks" className="scroll-mt-28 py-14">
        <NordicClocks />
      </section>
    </div>
  );
}
