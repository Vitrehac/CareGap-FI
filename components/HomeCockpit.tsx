"use client";

import Link from "next/link";
import { NordicClocks } from "@/components/NordicClocks";
import { Tag } from "@/components/Provenance";
import { DEFAULT_COUNTY, national } from "@/lib/data";
import { People } from "@/components/People";
import { Tip } from "@/components/mithril/Tip";
import { Decode, Glitch } from "@/components/mithril/Effects";

const NORDIC_MEN = [
  { country: "SE", value: 31.3 },
  { country: "NO", value: 30.8 },
  { country: "IS", value: 29.0 },
  { country: "DK", value: 28.1 },
  { country: "FI", value: 17.9 },
];

export function HomeCockpit() {
  const maxBar = 32.7;

  return (
    <div>
      {/* First viewport: brand + one line + one CTA only */}
      <section className="relative flex min-h-[calc(100dvh-7.5rem)] flex-col justify-center border-b border-rule py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-y-0 right-[-1rem] hidden w-[46%] items-center lg:flex" aria-hidden>
          <People className="w-full" />
        </div>
        <div className="relative max-w-2xl">
          <p className="label inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-accent">
            Wellbeing services · lung-cancer pathway
          </p>
          <Decode as="h1" className="font-display mt-6 block max-w-xl text-[clamp(2.6rem,6vw,4.75rem)] text-ink">
            Measure the CT handoff <span className="text-accent">before you copy it.</span>
          </Decode>
          <p className="mt-6 max-w-xl text-xl leading-snug text-ink-soft sm:text-2xl">
            Satakunta let health centres order chest CT. Nobody has published whether the wait got shorter. Design a 12-month measurement, not a survival claim.
          </p>
          <People className="mt-8 w-full max-w-sm lg:hidden" />
          <div className="mt-10">
            <Link
              href={`/pilot?county=${DEFAULT_COUNTY}`}
              className="cta inline-flex items-center gap-3 bg-accent px-6 py-3.5 font-mono text-[0.78rem] tracking-[0.1em] text-paper uppercase"
            >
              <span className="cta-dot" />
              <Glitch>Build your scenario</Glitch>
            </Link>
            <p className="terminal mt-5 text-ink-faint">
              <span className="prompt">&gt;liwe:/</span> 5 quick choices. Every number is sourced.
              <span className="caret" />
            </p>
          </div>
        </div>
      </section>

      {/* One job: the gap */}
      <section className="border-b border-rule py-14">
        <Decode as="h2" className="font-display block max-w-3xl text-[clamp(1.9rem,3.6vw,3.2rem)] text-ink">
          Finland has the lowest lung-cancer survival in the Nordics. One big
          reason: patients wait months for the key scan.
        </Decode>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <p className="text-sm text-ink-soft">
            <Tip
              align="left"
              title="5-year relative survival"
              body="Out of 100 men diagnosed with lung cancer (2020–2024), how many are still alive 5 years later, after removing deaths from other causes (NORDCAN). Higher is better. Finland is last in the Nordics."
            >
              Of 100 men diagnosed with lung cancer, how many are alive 5 years later
            </Tip>
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
                  <Tip
                    align="left"
                    underline={false}
                    title={c.country === "FI" ? "Finland" : c.country === "SE" ? "Sweden" : c.country === "NO" ? "Norway" : c.country === "DK" ? "Denmark" : "Iceland"}
                    body={`${c.value.toFixed(1)} of 100 men alive 5 years after a lung-cancer diagnosis.${isFi ? " The lowest in the Nordics — about 13 fewer per 100 than Sweden." : ""} Source: NORDCAN, diagnosed 2020–2024.`}
                  >
                    {c.country}
                  </Tip>
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
          Sweden aims to get a chest scan result to the patient within{" "}
          {national.swedenReferralToCtResultDays} days of the referral.
        </p>
      </section>

      {/* One job: the path */}
      <section className="border-b border-rule py-14">
        <Decode as="h2" className="font-display block text-[clamp(1.9rem,3.6vw,3.2rem)] text-ink">
          Three steps. One clear answer.
        </Decode>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Pick a county",
            },
            {
              n: "2",
              t: "Choose the changes",
            },
            {
              n: "3",
              t: "See the difference",
            },
          ].map((s) => (
            <li key={s.n} className="border-t border-rule pt-4">
              <p className="nums text-sm font-semibold text-accent">{s.n}</p>
              <p className="mt-3 font-display text-3xl text-ink">
                {s.t}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Link
            href={`/pilot?county=${DEFAULT_COUNTY}`}
            className="cta inline-flex items-center gap-3 bg-accent px-5 py-3 font-mono text-[0.75rem] tracking-[0.1em] text-paper uppercase"
          >
            <span className="cta-dot" />
            <Glitch>Start</Glitch>
          </Link>
        </div>
      </section>

      <section id="nordic-clocks" className="scroll-mt-28 py-14">
        <details className="group">
          <summary className="label flex cursor-pointer list-none items-center justify-between border border-rule px-5 py-4 text-ink-soft hover:text-accent [&::-webkit-details-marker]:hidden">
            What Nordic managers can open today
            <span className="nums text-ink-faint group-open:rotate-45 transition-transform">+</span>
          </summary>
          <div className="pt-8">
            <NordicClocks />
          </div>
        </details>
      </section>
    </div>
  );
}
