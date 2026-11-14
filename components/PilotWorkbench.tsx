"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CountyMap,
  CAPACITY_CEILING,
} from "@/components/CountyMap";
import { Tag } from "@/components/Provenance";
import {
  comparatorFor,
  counties,
  DEFAULT_COUNTY,
  getCounty,
  national,
} from "@/lib/data";
import type { County } from "@/lib/types";

const ENDPOINT_OPTIONS = [
  {
    id: "10",
    label: "Median days from primary-care CT order to CT report ≤ 10",
    days: 10,
  },
  {
    id: "14",
    label: "Median days from primary-care CT order to CT report ≤ 14",
    days: 14,
  },
  {
    id: "7",
    label: "Median days from primary-care CT order to CT report ≤ 7",
    days: 7,
  },
] as const;

const INTENSITY = [
  {
    id: "narrow",
    label: "Narrow criteria",
    hint: "High-risk + clear symptoms only",
    factor: 0.7,
  },
  {
    id: "satakunta",
    label: "Satakunta-style",
    hint: "≥20 pack-years + symptoms (press)",
    factor: 1,
  },
  {
    id: "broad",
    label: "Broader entry",
    hint: "Wider symptom set (higher demand)",
    factor: 1.35,
  },
] as const;

const DURATIONS = [
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months" },
  { months: 18, label: "18 months" },
] as const;

function satakunta(): County | undefined {
  return counties.find((c) => c.slug === "satakunta");
}

function validSlug(slug: string | null): string {
  if (!slug) return DEFAULT_COUNTY;
  if (counties.some((c) => c.slug === slug && !c.tooSmall)) return slug;
  return DEFAULT_COUNTY;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

export function PilotWorkbench() {
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState(() =>
    validSlug(searchParams.get("county")),
  );
  const [directCt, setDirectCt] = useState(true);
  const [intensityId, setIntensityId] =
    useState<(typeof INTENSITY)[number]["id"]>("satakunta");
  const [durationMonths, setDurationMonths] = useState(12);
  const [endpointId, setEndpointId] =
    useState<(typeof ENDPOINT_OPTIONS)[number]["id"]>("10");
  const [tripFlash, setTripFlash] = useState(false);
  const [briefTick, setBriefTick] = useState(0);

  const county = getCounty(slug);
  const comparator = useMemo(() => comparatorFor(county), [county]);
  const precedent = satakunta();
  const intensity = INTENSITY.find((i) => i.id === intensityId) ?? INTENSITY[1];
  const endpoint =
    ENDPOINT_OPTIONS.find((e) => e.id === endpointId) ?? ENDPOINT_OPTIONS[0];

  const slotsWeek = directCt
    ? Math.round(county.ctPerWeekEst * intensity.factor * 10) / 10
    : 0;
  const pathwaysYear = directCt
    ? Math.round(county.pathwaysPerYearEst * intensity.factor)
    : 0;
  const blocked = directCt && slotsWeek > CAPACITY_CEILING;
  const selectable = useMemo(
    () =>
      counties
        .filter((c) => !c.tooSmall)
        .sort((a, b) => (a.needRank ?? 99) - (b.needRank ?? 99)),
    [],
  );

  useEffect(() => {
    const fromUrl = validSlug(searchParams.get("county"));
    setSlug(fromUrl);
  }, [searchParams]);

  useEffect(() => {
    setBriefTick((t) => t + 1);
  }, [slug, directCt, intensityId, durationMonths, endpointId]);

  useEffect(() => {
    if (!blocked) return;
    setTripFlash(true);
    const t = window.setTimeout(() => setTripFlash(false), 900);
    return () => window.clearTimeout(t);
  }, [blocked, slug, intensityId, directCt]);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#county");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, []);

  return (
    <div className="space-y-16 pb-16 pt-4">
      {/* Step: County — one job */}
      <section id="county" className="scroll-mt-28">
        <p className="nums text-xs font-semibold text-accent">2 · County</p>
        <h2 className="font-display mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
          Pick your wellbeing-services county
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Kainuu is pre-selected. Demand is an Estimate from incidence × pathway
          assumptions.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <label className="block">
              <span className="text-sm font-semibold text-ink">County</span>
              <select
                className="mt-2 w-full rounded-md border border-rule bg-paper-raised px-3 py-2.5 text-sm text-ink"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              >
                {selectable.map((c) => {
                  const over = c.ctPerWeekEst > CAPACITY_CEILING;
                  return (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                      {c.hasPrecedent ? " · unevaluated precedent" : ""}
                      {c.needRank ? ` · need #${c.needRank}` : ""}
                      {` · ~${c.ctPerWeekEst.toFixed(1)} slots/wk`}
                      {over ? " · capacity risk" : ""}
                    </option>
                  );
                })}
              </select>
            </label>

            <div className="mt-6 border-t border-rule pt-6">
              <div className="flex items-start gap-2">
                <span
                  className={`nums text-4xl font-semibold leading-none ${
                    county.ctPerWeekEst > CAPACITY_CEILING
                      ? "text-alarm"
                      : "text-ink"
                  }`}
                >
                  {county.ctPerWeekEst.toFixed(1)}
                </span>
                <Tag kind="estimate" />
              </div>
              <p className="mt-1 text-sm font-medium text-ink">
                CT slots / week · {county.name}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                This is an Estimate from incidence × pathway assumptions.
                Comparator suggestion: {comparator.name}. Need rank{" "}
                {county.needRank ?? "n/a"}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => scrollToId("configure")}
              className="mt-8 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Continue to experiment
            </button>
          </div>

          <div className="rounded-md border border-rule bg-paper-raised p-3 sm:p-4">
            <CountyMap selected={slug} onSelect={setSlug} />
          </div>
        </div>
      </section>

      {/* Step: Experiment — one job */}
      <section id="configure" className="scroll-mt-28 border-t border-rule pt-16">
        <p className="nums text-xs font-semibold text-accent">3 · Experiment</p>
        <h2 className="font-display mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
          Configure a 12-month measured experiment
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Defaults are ready. Advanced intensity stays collapsed until you need
          it.
        </p>

        <div className="mt-8 max-w-2xl space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-rule pb-6">
            <div>
              <p className="text-sm font-semibold text-ink">
                Satakunta-style direct primary-care CT
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                On: health centres can order CT for high-risk symptomatic
                patients. Off: keep the specialist gate. Precedent is
                unevaluated local practice.
              </p>
              {precedent && (
                <p className="mt-2 flex items-center gap-2 text-xs text-ink-faint">
                  <Tag kind="sourced" />
                  {precedent.name} press (~170 imaged); no peer-reviewed outcome
                  evaluation as of 2026-11-14
                </p>
              )}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={directCt}
              onClick={() => setDirectCt((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                directCt ? "bg-accent" : "bg-rule"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
                  directCt ? "translate-x-5" : "translate-x-0"
                }`}
              />
              <span className="sr-only">
                {directCt ? "Direct CT on" : "Direct CT off"}
              </span>
            </button>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Pilot duration</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.months}
                  type="button"
                  onClick={() => setDurationMonths(d.months)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                    durationMonths === d.months
                      ? "border-accent bg-accent-soft text-ink"
                      : "border-rule bg-paper-raised text-ink-soft hover:text-ink"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-faint">
              Sets the measurement window in the brief. Not an outcome claim.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">
              Pre-register this endpoint
            </p>
            <p className="mt-1 text-sm text-ink-soft">{endpoint.label}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ENDPOINT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEndpointId(opt.id)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
                    endpointId === opt.id
                      ? "border-accent bg-accent text-white"
                      : "border-rule bg-paper-raised text-ink-soft hover:text-ink"
                  }`}
                >
                  ≤ {opt.days} days
                </button>
              ))}
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
              <Tag kind="estimate" />
              Demo planning target · Sweden SVF filter context:{" "}
              {national.swedenReferralToCtResultDays}d referral→imaging answer
            </p>
          </div>

          <details className="group border border-rule bg-paper-raised open:pb-4">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3">
                Advanced: entry intensity
                <span className="text-xs font-medium text-ink-faint group-open:hidden">
                  Show
                </span>
                <span className="hidden text-xs font-medium text-ink-faint group-open:inline">
                  Hide
                </span>
              </span>
            </summary>
            <div
              className={`px-4 pb-1 transition-opacity ${
                directCt ? "opacity-100" : "opacity-45"
              }`}
            >
              <p className="text-xs text-ink-faint">
                Scales estimated pathways. Planning convention only.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {INTENSITY.map((opt) => {
                  const on = intensityId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={!directCt}
                      onClick={() => setIntensityId(opt.id)}
                      className={`rounded-md border px-3 py-2.5 text-left transition-colors ${
                        on
                          ? "border-accent bg-accent-soft"
                          : "border-rule bg-paper hover:border-accent/40"
                      }`}
                    >
                      <span className="block text-sm font-semibold text-ink">
                        {opt.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-faint">
                        {opt.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-ink-faint">
                <Tag kind="estimate" />
                Factor ×{intensity.factor} on seeded CT demand chain
              </p>
            </div>
          </details>

          <div
            className={`rounded-md border px-4 py-4 ${
              blocked
                ? `border-alarm/40 bg-alarm-soft ${tripFlash ? "motion-stop-trip" : ""}`
                : "border-rule bg-paper-raised"
            }`}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-start gap-2">
                  <span
                    className={`nums text-3xl font-semibold leading-none ${
                      blocked ? "text-alarm" : "text-ink"
                    }`}
                  >
                    {slotsWeek.toFixed(1)}
                  </span>
                  <Tag kind="estimate" />
                </div>
                <p className="mt-1 text-sm font-medium">
                  Live demand · CT slots / week
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  ~{pathwaysYear} pathways / year · ceiling {CAPACITY_CEILING}{" "}
                  slots/wk
                </p>
              </div>
              <div className="max-w-sm text-right">
                <p
                  className={`text-sm font-semibold ${
                    blocked ? "text-alarm" : "text-ink"
                  }`}
                >
                  {!directCt
                    ? "Stop rule: N/A (route off)"
                    : blocked
                      ? "Stop rule: tripped"
                      : "Stop rule: clear"}
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  {!directCt
                    ? "Flip the route on to size demand."
                    : blocked
                      ? `Demand exceeds demo ceiling. Secure capacity or narrow entry before announcing.`
                      : `Within demo ceiling. Still require endpoint instrumentation.`}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToId("brief")}
            className="inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View pilot brief
          </button>
        </div>
      </section>

      {/* Step: Brief — the payoff */}
      <section id="brief" className="scroll-mt-28 border-t border-rule pt-16">
        <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="nums text-xs font-semibold text-accent">4 · Brief</p>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
              Your pilot brief
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Printable Monday handout. Updates live with your settings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-rule bg-paper-raised px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            Print brief
          </button>
        </div>

        <article
          key={briefTick}
          className="pilot-brief motion-brief border border-rule bg-paper-raised px-6 py-8 sm:px-10 sm:py-12"
        >
          <header className="border-b border-rule pb-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/caregap-mark.svg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <div>
                <p className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                  CareGap<span className="text-accent"> FI</span>
                </p>
                <p className="text-xs text-ink-faint">
                  County pilot brief · measure the CT handoff first
                </p>
              </div>
            </div>
            <h3 className="font-display mt-6 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
              {county.name}
            </h3>
            <p className="mt-2 text-base text-ink-soft">
              {durationMonths}-month measured experiment
              {county.needRank ? ` · need rank #${county.needRank}` : ""}
            </p>
          </header>

          <dl className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-ink-faint">
                Comparator county
              </dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {comparator.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-faint">Install</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {directCt
                  ? `Direct primary-care CT · ${intensity.label}`
                  : "Specialist-gate baseline (direct CT off)"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-faint">
                Estimated demand
              </dt>
              <dd className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold text-ink">
                <span className="nums">~{slotsWeek.toFixed(1)}</span> CT
                slots/week ·{" "}
                <span className="nums">~{pathwaysYear}</span> pathways/year
                <Tag kind="estimate" />
              </dd>
              <p className="mt-1 text-xs text-ink-faint">
                This is an Estimate from incidence × pathway assumptions.
              </p>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-faint">
                Capacity stop rule
              </dt>
              <dd
                className={`mt-1 text-lg font-semibold ${
                  blocked ? "text-alarm" : "text-ink"
                }`}
              >
                {!directCt
                  ? "N/A while route is off"
                  : blocked
                    ? `Tripped: ${slotsWeek.toFixed(1)} > ${CAPACITY_CEILING} slots/wk. Pause announcement.`
                    : `Clear: ${slotsWeek.toFixed(1)} ≤ ${CAPACITY_CEILING} slots/wk. Measure before scale.`}
              </dd>
              <p className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
                <Tag kind="estimate" />
                Demo planning ceiling, not a published national standard
              </p>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-ink-faint">
                Pre-registered process endpoint
              </dt>
              <dd className="mt-1 text-xl font-semibold leading-snug text-ink sm:text-2xl">
                {endpoint.label}
              </dd>
              <p className="mt-2 text-sm text-ink-soft">
                Process measure only. Guldbrandt 2015 cluster-RCT of GP direct
                LDCT was null on stage and diagnostic interval; do not pitch
                outcome miracles.
              </p>
            </div>
          </dl>

          <ul className="mt-10 list-disc space-y-2 border-t border-rule pt-6 pl-5 text-sm text-ink-soft">
            <li>
              Cite: NORDCAN survival · Acta / JTHO / EU-JUST-CT on GP CT access ·
              Satakunta press (unevaluated).
            </li>
            <li>
              Do not claim stage shift, lives saved, or Satakunta clinical
              outcomes. Prototype, not a medical device.
            </li>
          </ul>
        </article>
      </section>

      <div className="no-print flex flex-wrap gap-3 border-t border-rule pt-8">
        <Link
          href="/sources"
          className="rounded-md border border-rule bg-paper-raised px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          Provenance vault
        </Link>
        <Link
          href="/"
          className="rounded-md border border-rule bg-paper-raised px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          Back to the gap
        </Link>
      </div>
    </div>
  );
}
