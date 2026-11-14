"use client";

import Link from "next/link";
import { Tag } from "@/components/Provenance";
import { DEFAULT_COUNTY } from "@/lib/data";

const FIGURES = [
  {
    k: "17.9% vs 31.3%",
    d: "5-year relative survival, men, lung. Finland and Sweden. NORDCAN extract year code 2022.",
    tag: "sourced" as const,
  },
  {
    k: "X-ray yes, CT no",
    d: "Finnish primary care generally cannot order chest CT. Acta Oncologica 2025 and JTO 2024.",
    tag: "sourced" as const,
  },
  {
    k: "≤ 10 days",
    d: "Pilot endpoint: median days from the symptomatic visit to the CT report. Anchored on Sweden’s SVF filter budget.",
    tag: "estimate" as const,
  },
];

export function HomeCockpit() {
  return (
    <section className="flex min-h-[calc(100dvh-7.5rem)] flex-col justify-center py-16">
      <p className="label text-accent">Liwe</p>
      <h1 className="font-display mt-4 max-w-3xl text-[clamp(2.4rem,5.5vw,4.2rem)] text-ink">
        Satakunta changed who can order the CT. Nobody measured it.
      </h1>
      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {FIGURES.map((f) => (
          <li key={f.k} className="rounded-2xl bg-paper-raised p-5 ring-1 ring-rule">
            <p className="font-display text-3xl text-ink">{f.k}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.d}</p>
            <div className="mt-3">
              <Tag kind={f.tag} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <Link
          href={`/pilot?county=${DEFAULT_COUNTY}#county`}
          className="cta inline-flex items-center gap-3 bg-accent px-6 py-3.5 font-mono text-[0.78rem] tracking-[0.1em] text-paper uppercase"
        >
          <span className="cta-dot" />
          Design a 12-month pilot
        </Link>
      </div>
    </section>
  );
}
