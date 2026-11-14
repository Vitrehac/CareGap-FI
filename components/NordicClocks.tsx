"use client";

import { useState } from "react";
import { Tag } from "@/components/Provenance";

type Country = "SE" | "DK" | "NO" | "FI";

const CLOCKS: Record<
  Country,
  {
    name: string;
    canOpen: string;
    example: string;
    gpToCt: string;
    tone: "peer" | "gap";
  }
> = {
  SE: {
    name: "Sweden",
    canOpen:
      "NLCR + SVF ledtider: remiss / suspicion → treatment start (40/44 day targets, hospital views).",
    example:
      "2024: 36% started drug treatment within 40 days; 10% surgery/RT within 44 days (NLCR).",
    gpToCt:
      "No routine county KPI for GP order → CT report. Filter design times exist (5+1 days).",
    tone: "peer",
  },
  DK: {
    name: "Denmark",
    canOpen:
      "SST forløbstider by region: % of lung pathways from referral to treatment within 41–45 days.",
    example:
      "2025 lung: surgery 77% / drug 86% / RT 70% within standard time (SST årsopgørelse).",
    gpToCt: "No published GP → CT report day clock. Regional pathway attainment: yes.",
    tone: "peer",
  },
  NO: {
    name: "Norway",
    canOpen:
      "OF1–OF4 pathway clocks by design (70% target). National live lung tables currently suspended (NPR).",
    example:
      "Helse Vest 2024 lung OF4: Bergen/Stavanger 57%, Førde 68%, Fonna 54% (none at 70%).",
    gpToCt: "No published GP → CT report KPI. Specialist pathway OF clocks: yes by design.",
    tone: "peer",
  },
  FI: {
    name: "Finland",
    canOpen:
      "FCR + FICAN quality-registry pilot: stage completeness, curative-intent share, regional treatment mix.",
    example:
      "2019–2023: stage missing 47.7%; curative-intent first treatment 27%. No referral→CT→treatment day clocks by county.",
    gpToCt:
      "A wellbeing-services manager cannot open days from GP referral to CT report. Missing clocks ≠ no register.",
    tone: "gap",
  },
};

const ORDER: Country[] = ["SE", "DK", "NO", "FI"];

export function NordicClocks() {
  const [active, setActive] = useState<Country>("FI");
  const card = CLOCKS[active];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
            What a manager can open today
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Secondary detail for mentors. Peers publish cancer-specific day
            clocks. Finland’s newest lung quality report still does not.
          </p>
        </div>
        <Tag kind="sourced" />
      </div>

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Nordic registers"
      >
        {ORDER.map((code) => {
          const on = active === code;
          const gap = CLOCKS[code].tone === "gap";
          return (
            <button
              key={code}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(code)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                on
                  ? gap
                    ? "border-alarm bg-alarm-soft text-alarm"
                    : "border-accent bg-accent-soft text-accent"
                  : "border-rule bg-paper-raised text-ink-soft hover:text-ink"
              }`}
            >
              {code}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className={`mt-6 border-t pt-6 ${
          card.tone === "gap" ? "border-alarm/30" : "border-rule"
        }`}
      >
        <p className="font-display text-xl font-semibold text-ink">
          {card.name}
        </p>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-ink">Can open</dt>
            <dd className="mt-1 leading-relaxed text-ink-soft">{card.canOpen}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Example figure</dt>
            <dd className="mt-1 leading-relaxed text-ink-soft">{card.example}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">GP → CT report clock</dt>
            <dd
              className={`mt-1 leading-relaxed ${
                card.tone === "gap" ? "font-medium text-alarm" : "text-ink-soft"
              }`}
            >
              {card.gpToCt}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
