"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CountyMap } from "@/components/CountyMap";
import { DEFAULT_COUNTY, counties, getCounty } from "@/lib/data";
import { Glitch } from "@/components/mithril/Effects";
import { Tip } from "@/components/mithril/Tip";
import { explain, type Tip as TipT } from "./explain";
import { PilotBrief } from "./PilotBrief";
import {
  CAPACITY_OPTIONS,
  DEFAULT_CONFIG,
  FACTS,
  INTENSITY,
  selectable,
  slotsFor,
  type Config,
  type IntensityId,
} from "./model";

// One decision per screen. Picking an answer moves on by itself; the result is the last step.
const STEPS = ["County", "Direct CT", "Who", "Scans", "GP wait", "Result"] as const;
const HASH_FOR_STEP = ["county", "configure", "configure", "configure", "configure", "brief"];

function validSlug(slug: string | null) {
  return slug && counties.some((c) => c.slug === slug && !c.tooSmall) ? slug : DEFAULT_COUNTY;
}

function stepFromHash(hash: string, current: number) {
  const h = hash.replace(/^#/, "");
  if (h === "county") return 0;
  if (h === "brief") return 5;
  if (h === "configure") return current === 0 || current === 5 ? 1 : current;
  return current;
}

function BackArrow() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M13 2v8H3.5M7 6.5 3.5 10 7 13.5" />
    </svg>
  );
}

function Choice({
  active,
  onClick,
  title,
  big,
  unit,
  unitTip,
  note,
  alarm = false,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  big?: string;
  unit?: string;
  unitTip?: TipT;
  note?: string;
  alarm?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-36 flex-col justify-between rounded-2xl border-2 p-5 text-left shadow-sm transition-[border-color,background-color,transform] hover:-translate-y-0.5 ${
        active ? "border-accent bg-accent-soft" : "border-rule bg-paper hover:border-accent/50"
      }`}
    >
      <span className="label text-ink-soft group-hover:text-accent">
        <Glitch>{title}</Glitch>
      </span>
      {big && (
        <span className={`font-display mt-4 text-[clamp(2.2rem,4.6vw,3.4rem)] ${alarm ? "text-alarm" : "text-ink"}`}>{big}</span>
      )}
      {unit && (
        <span className="label mt-1 text-ink-faint">
          {unitTip ? <Tip align="left" title={unitTip.title} body={unitTip.body}>{unit}</Tip> : unit}
        </span>
      )}
      {note && <span className="mt-3 text-sm leading-snug text-ink-soft">{note}</span>}
    </button>
  );
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-ink">{children}</h2>
);
const Sub = ({ children }: { children: React.ReactNode }) => <p className="mt-3 max-w-2xl text-ink-faint">{children}</p>;

export function PilotWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [cfg, setCfg] = useState<Config>(() => ({ slug: validSlug(searchParams.get("county")), ...DEFAULT_CONFIG }));
  const county = getCounty(cfg.slug);
  const need = slotsFor(county, cfg.intensityId);

  const go = useCallback((n: number) => {
    setStep(n);
    const hash = HASH_FOR_STEP[n];
    if (window.location.hash.replace(/^#/, "") !== hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${hash}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // the header links jump straight to a step
  // (read once after mount too, so server and client render the same first frame)
  useEffect(() => {
    const onHash = () => setStep((s) => stepFromHash(window.location.hash, s));
    const first = requestAnimationFrame(onHash);
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const pick = (patch: Partial<Config>, next: number) => {
    setCfg((c) => ({ ...c, ...patch }));
    window.setTimeout(() => go(next), 220);
  };

  const summary = [
    county.name,
    cfg.directCt ? "Yes" : "No",
    cfg.directCt ? INTENSITY.find((i) => i.id === cfg.intensityId)?.label : "—",
    cfg.directCt ? `+${cfg.addedScans}/wk` : "—",
    cfg.fastGp ? "7 days" : "14 days",
    "",
  ];

  return (
    <div className="pb-20">
      <ol className="no-print flex flex-wrap gap-x-1 gap-y-2 border-b border-rule pb-4">
        {STEPS.map((label, i) => {
          const done = i < step, active = i === step;
          const skip = !cfg.directCt && (i === 2 || i === 3);
          const disabled = (i > step && !(i === 5 && step >= 1)) || skip;
          return (
            <li key={label} className="flex items-center gap-1">
              {i > 0 && <span className="px-1 text-ink-faint/40">/</span>}
              <button
                type="button"
                disabled={disabled}
                onClick={() => go(i)}
                className={`label rounded-full px-3 py-1.5 transition-colors ${
                  active ? "bg-accent text-paper" : done && !skip ? "text-ink hover:text-accent" : "text-ink-faint/60"
                }`}
              >
                <span className="nums mr-1.5 opacity-60">{i + 1}</span>
                {label}
                {done && summary[i] && <span className="ml-2 text-ink-faint normal-case tracking-normal">· {summary[i]}</span>}
              </button>
            </li>
          );
        })}
      </ol>

      <div key={step} className="wizard-step pt-10 sm:pt-14">
        {step > 0 && step < 5 && (
          <button
            type="button"
            onClick={() => go(step === 4 && !cfg.directCt ? 1 : step - 1)}
            className="label mb-8 inline-flex items-center gap-2 text-ink-faint hover:text-accent"
          >
            <BackArrow /> Back
          </button>
        )}

        {step === 0 && (
          <div>
            <div className="mb-12 grid gap-4 sm:grid-cols-3">
              {[
                ["The problem", `In Satakunta in 2021–22, one study measured about ${FACTS.gpToReferral} days from the first GP visit to referral and ${FACTS.referralToDiagnosis} days from referral to diagnosis. The family doctor usually cannot order the CT.`],
                ["What you can change", "Let family doctors order the CT directly, decide who qualifies, and reserve scanner time."],
                ["What you’ll see", "Days from the GP visit to the CT report, people reached a year, and CT slots a week. Every number is tagged."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-paper-raised p-5 ring-1 ring-rule">
                  <p className="label text-accent">{t}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{d}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <H2>Which county?</H2>
                <Sub>Click it on the map.</Sub>
                <div className="mt-10 grid max-w-md grid-cols-2 gap-6">
                  <div>
                    <p className="font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-none text-accent">{Math.round(county.casesPerYearEst)}</p>
                    <p className="label mt-2 text-ink-faint">new lung cancers a year</p>
                  </div>
                  <div>
                    <p className="font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-none text-ink">{Math.round(county.deathsPerYear)}</p>
                    <p className="label mt-2 text-ink-faint">lung-cancer deaths a year</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-ink-faint">
                  {county.name} · {county.population.toLocaleString("en-GB")} people
                </p>
                <select
                  aria-label="County"
                  className="mt-8 w-full rounded-xl border border-rule bg-paper px-3 py-3 text-sm text-ink"
                  value={cfg.slug}
                  onChange={(e) => setCfg((c) => ({ ...c, slug: e.target.value }))}
                >
                  {selectable.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} · {Math.round(c.deathsPerYear)} lung-cancer deaths a year
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => go(1)} className="cta mt-6 inline-flex items-center gap-3 bg-accent px-6 py-3.5 font-mono text-[0.78rem] tracking-[0.1em] text-paper uppercase">
                  <span className="cta-dot" />
                  <Glitch>{`Improve ${county.name}`}</Glitch>
                </button>
              </div>
              <div className="rounded-3xl border border-rule bg-paper-raised p-5">
                <CountyMap selected={cfg.slug} onSelect={(slug) => pick({ slug }, 1)} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <H2>Let family doctors order the CT scan directly?</H2>
            <Sub>A CT scan is a detailed 3D X-ray of the chest. It shows lung cancer far earlier than a normal X-ray. Today a specialist has to order it.</Sub>
            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              <Choice active={cfg.directCt} onClick={() => pick({ directCt: true }, 2)} title="Yes · like Sweden" big="Direct CT" note="Skips the wait for the specialist. The biggest time saver." />
              <Choice active={!cfg.directCt} onClick={() => pick({ directCt: false }, 4)} title="No · keep today’s rule" big="Specialist first" note="Only the GP wait can be improved." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <H2>Who should get the direct scan?</H2>
            <Sub>Wider rules catch more cancers early — but need more scans.</Sub>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {INTENSITY.map((i) => {
                const s = slotsFor(county, i.id as IntensityId);
                return (
                  <Choice
                    key={i.id}
                    active={cfg.intensityId === i.id}
                    onClick={() => pick({ intensityId: i.id }, 3)}
                    title={i.label}
                    big={`${Math.round(i.reach * 100)}%`}
                    unit="of lung cancers found faster"
                    unitTip={explain.reachRule(i.label, i.hint, i.reach, s)}
                    note={`${i.hint}. Needs ${s.toFixed(1)} scans a week.`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <H2>How many extra CT scans a week will {county.name} add?</H2>
            <Sub>
              This route needs about <Tip align="left" {...explain.scansWeek(need, county.name)}>{need.toFixed(1)} scans a week</Tip>. Add fewer and patients queue.
            </Sub>
            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              {CAPACITY_OPTIONS.map((n) => (
                <Choice
                  key={n}
                  active={cfg.addedScans === n}
                  onClick={() => pick({ addedScans: n }, 4)}
                  title={n === 0 ? "Nothing extra" : n >= need ? "Covers the need" : "Partly covers"}
                  big={`+${n}`}
                  unit="scans a week"
                  note={n >= need ? "Results in about 7 days." : n === 0 ? "Patients queue for weeks." : "Some queueing."}
                  alarm={n < need}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <H2>Make it faster to see a family doctor?</H2>
            <Sub>
              Today people wait about {FACTS.gpWaitToday} days for a GP appointment. In the other Nordic countries it is under {FACTS.gpWaitNordic}. This helps every patient, not only the CT route.
            </Sub>
            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              <Choice active={!cfg.fastGp} onClick={() => pick({ fastGp: false }, 5)} title="Keep today’s wait" big={`${FACTS.gpWaitToday} days`} note="No change to GP access." />
              <Choice active={cfg.fastGp} onClick={() => pick({ fastGp: true }, 5)} title="Nordic level" big={`${FACTS.gpWaitNordic} days`} note="Needs more GP time, but everyone with symptoms is seen sooner." />
            </div>
          </div>
        )}

        {step === 5 && (
          <PilotBrief
            cfg={cfg}
            setCfg={setCfg}
            onEdit={() => go(1)}
            onRestart={() => {
              setCfg({ slug: DEFAULT_COUNTY, ...DEFAULT_CONFIG });
              go(0);
            }}
          />
        )}
      </div>
    </div>
  );
}
