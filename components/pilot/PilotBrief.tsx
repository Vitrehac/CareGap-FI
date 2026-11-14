"use client";

import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Mark } from "@/components/mithril/Mark";
import { Glitch } from "@/components/mithril/Effects";
import { Tip } from "@/components/mithril/Tip";
import { getCounty } from "@/lib/data";
import { explain, type Tip as TipT } from "./explain";
import {
  ASSUMPTIONS,
  FACTS,
  NATIONAL_CT_WEEK as NATIONAL_CT_WEEK_REF,
  INTENSITY,
  MODEL_SOURCES,
  simulate,
  simulateAll,
  type Config,
  type Stage,
} from "./model";

type Props = {
  cfg: Config;
  setCfg: Dispatch<SetStateAction<Config>>;
  onEdit: () => void;
  onRestart: () => void;
};

const n0 = (v: number) => Math.round(v).toLocaleString("en-GB");
const n1 = (v: number) => v.toLocaleString("en-GB", { maximumFractionDigits: 1, minimumFractionDigits: v < 10 ? 1 : 0 });

function Panel({ title, means, children, className = "" }: { title: string; means?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-rule bg-paper-raised p-5 sm:p-6 ${className}`}>
      <h3 className="label mb-5 text-ink-soft">{title}</h3>
      {children}
      {means && (
        <p className="mt-6 border-t border-rule pt-4 text-sm leading-relaxed text-ink">
          <span className="label mr-2 text-accent">What it means</span>
          {means}
        </p>
      )}
    </section>
  );
}

function Big({ value, label, tip, tone = "ink" }: { value: string; label: string; tip?: TipT; tone?: "ink" | "accent" | "alarm" }) {
  const color = tone === "accent" ? "text-accent" : tone === "alarm" ? "text-alarm" : "text-ink";
  return (
    <div>
      <p className={`font-display text-[clamp(2.6rem,6vw,4.8rem)] leading-none ${color}`}>{value}</p>
      <p className="label mt-3 text-ink-faint">{tip ? <Tip align="left" title={tip.title} body={tip.body}>{label}</Tip> : label}</p>
    </div>
  );
}

/* today vs your plan — the journey from "I need a doctor" to "it is cancer", in days */
function Journey({ today, scenario, coping, wait }: { today: Stage[]; scenario: Stage[]; coping: string; wait: number }) {
  const total = (s: Stage[]) => s.reduce((a, x) => a + x.days, 0);
  const max = total(today);
  const tipFor = (s: Stage): TipT =>
    s.tip === "gpWait"
      ? explain.gpWait(s.days)
      : s.tip === "gpToReferral"
        ? explain.gpToReferral()
        : s.tip === "referralToDiagnosis"
          ? explain.referralToDiagnosis()
          : s.tip === "ctWait"
            ? explain.ctWait(wait, coping)
            : explain.workup(s.days);
  const shade = ["bg-ink/45", "bg-ink/25", "bg-ink/15"];
  const row = (stages: Stage[], name: string, accent: boolean) => (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className={`label ${accent ? "text-accent" : "text-ink-soft"}`}>{name}</span>
        <span className={`font-display text-2xl ${accent ? "text-accent" : "text-ink"}`}>{total(stages)} days</span>
      </div>
      <div className="flex h-12 w-full gap-[3px]">
        {stages.map((s, i) => {
          const t = tipFor(s);
          return (
            <div
              key={s.key + i}
              className={`relative flex min-w-0 items-center px-2 transition-[width] duration-700 ${i === 0 ? "rounded-l-xl" : ""} ${i === stages.length - 1 ? "rounded-r-xl" : ""} ${
                accent ? (s.key === "ct" ? "bg-accent" : i === 0 ? "bg-accent/60" : "bg-accent/30") : shade[i]
              }`}
              style={{ width: `${(s.days / max) * 100}%` }}
            >
              <Tip align={i === 0 ? "left" : i === stages.length - 1 ? "right" : "center"} underline={false} title={t.title} body={t.body} className="w-full">
                <span className={`block truncate text-xs ${accent && s.key === "ct" ? "text-paper" : "text-ink"}`}>
                  <span className="nums mr-1.5">{s.days}d</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </span>
              </Tip>
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      {row(today, "Today", false)}
      {row(scenario, "With your changes", true)}
    </div>
  );
}

/* scans needed vs added — with live +/- */
function Capacity({ need, added, wait, setAdded }: { need: number; added: number; wait: number; setAdded: (n: number) => void }) {
  const max = Math.max(need, added, 4) * 1.2;
  const rows: [string, number, string, TipT][] = [
    ["Needed", need, "bg-ink/40", explain.scansWeek(need, "the county")],
    ["You add", added, added >= need ? "bg-accent" : "bg-alarm", explain.scansAdded(added, need)],
  ];
  return (
    <div>
      {rows.map(([label, v, color, tip]) => (
        <div key={label} className="mb-3 grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-3">
          <span className="label text-ink-faint">
            <Tip align="left" title={tip.title} body={tip.body}>{label}</Tip>
          </span>
          <span className="relative h-4 bg-ink-faint/10">
            <span className={`absolute inset-y-0 left-0 transition-[width] duration-500 ${color}`} style={{ width: `${(v / max) * 100}%` }} />
          </span>
          <span className="nums text-right text-sm text-ink">{n1(v)}/wk</span>
        </div>
      ))}
      <div className="no-print mt-5 flex flex-wrap items-center gap-3">
        <span className="label text-ink-faint">Try it</span>
        <button type="button" onClick={() => setAdded(Math.max(0, added - 1))} className="hack label border border-rule px-3 py-1.5 text-ink-soft">−1</button>
        <button type="button" onClick={() => setAdded(added + 1)} className="hack label border border-rule px-3 py-1.5 text-ink-soft">+1</button>
        <button type="button" onClick={() => setAdded(Math.ceil(need))} className="hack label border border-rule px-3 py-1.5 text-ink-soft">Cover the need</button>
        <span className="text-sm text-ink-soft">
          CT result in <b className={wait > FACTS.ctResultSweden ? "text-alarm" : "text-accent"}>{wait} days</b>
        </span>
      </div>
    </div>
  );
}

/* the same plan everywhere — extra slots a week, click to switch */
function Finland({ cfg, setCfg }: { cfg: Config; setCfg: Props["setCfg"] }) {
  const [hover, setHover] = useState<string | null>(null);
  const rows = useMemo(() => simulateAll(cfg).sort((a, b) => a.sim.demand - b.sim.demand), [cfg]);
  const max = Math.max(...rows.map((r) => r.sim.demand), 0.1);
  const shown = rows.find((r) => r.c.slug === (hover ?? cfg.slug)) ?? rows[0];
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
      <ul className="space-y-[3px]" onMouseLeave={() => setHover(null)}>
        {rows.map(({ c, sim }) => {
          const sel = c.slug === cfg.slug;
          return (
            <li key={c.slug}>
              <button
                type="button"
                onMouseEnter={() => setHover(c.slug)}
                onFocus={() => setHover(c.slug)}
                onClick={() => setCfg((st) => ({ ...st, slug: c.slug }))}
                className="group grid w-full grid-cols-[9.5rem_1fr_3rem] items-center gap-2 text-left"
              >
                <span className={`truncate text-xs ${sel ? "text-accent" : "text-ink-faint group-hover:text-ink"}`}>{c.name}</span>
                <span className="relative h-3">
                  <span
                    className={`absolute inset-y-0 left-0 transition-[width] duration-500 ${sel ? "bg-accent" : "bg-ink-faint/30 group-hover:bg-ink-faint/60"}`}
                    style={{ width: `${(sim.demand / max) * 100}%` }}
                  />
                </span>
                <span className="nums text-right text-xs text-ink-soft">{n1(sim.demand)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-rule pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <p className="label text-ink-faint">
          <Tip align="right" {...explain.national(rows.length)}>All of Finland</Tip>
        </p>
        <p className="font-display mt-2 text-5xl text-accent">{rows.length}</p>
        <p className="mt-1 text-sm text-ink-soft">counties, ranked by slots a week (fewer is an easier pilot)</p>
        <div className="mt-6 border-t border-rule pt-4">
          <p className="label text-ink-faint">{shown.c.slug === cfg.slug ? "Your county" : "Hovered"}</p>
          <p className="font-display mt-1 text-2xl text-ink">{shown.c.name}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {n1(shown.sim.demand)} slots/week · {shown.sim.savedRoute} days sooner
          </p>
          {shown.c.slug !== cfg.slug && <p className="label mt-3 text-accent">Click to switch</p>}
        </div>
      </div>
    </div>
  );
}

/* what each choice costs in resources and what it buys, each lever measured on its own */
function WhatItTakes({ cfg }: { cfg: Config }) {
  const county = getCounty(cfg.slug);
  const off: Config = { ...cfg, directCt: false, fastGp: false, addedScans: 0 };
  const sim = (c: Config) => simulate(county, c);
  const base = sim(off);
  const full = sim(cfg);
  const noGp = sim({ ...cfg, fastGp: false });
  const noScans = sim({ ...cfg, addedScans: 0 });
  const src = (id: string) => MODEL_SOURCES.find((x) => x.id === id);

  type Row = { invest: string; detail: string; gain: string; gainDetail: string; sources: string[] };
  const rows: Row[] = [];
  if (cfg.directCt) {
    const d = base.daysScenario - noGp.daysScenario;
    rows.push({
      invest: "Let family doctors order chest CT directly",
      detail: `A rule change by the wellbeing-services county — no new building, no new machine. ${INTENSITY.find((i) => i.id === cfg.intensityId)?.label} rules: ${Math.round(full.reach * 100)}% of the county’s lung cancers use the new route.`,
      gain: `${d} days sooner`,
      gainDetail: `about ${n0(full.peopleReached)} people a year on the new route (Estimate)`,
      sources: ["Z13"],
    });
    if (cfg.addedScans > 0) {
      rows.push({
        invest: `Reserve ${cfg.addedScans} extra CT scans a week`,
        detail: `≈ ${n0(cfg.addedScans * 52)} scans a year of scanner and radiologist time. The route needs ${n1(full.demand)} a week; Finland does ≈ ${n0(NATIONAL_CT_WEEK_REF)} a week in total.`,
        gain: `CT result in ${full.wait} instead of ${noScans.wait} days`,
        gainDetail: "without reserved time the CT report slips later. The pilot stops if other non-urgent CT waits rise.",
        sources: ["Z41", "STUK"],
      });
    } else {
      const covered = sim({ ...cfg, addedScans: Math.ceil(full.demand) });
      rows.push({
        invest: "No extra CT scans reserved",
        detail: `The route needs ${n1(full.demand)} scans a week. Without reserved time the new patients queue and wait ${full.wait} days for the result.`,
        gain: `Add ${Math.ceil(full.demand)} a week → result in ${covered.wait} days`,
        gainDetail: `about ${n0(Math.ceil(full.demand) * 52)} reserved scans a year (Estimate)`,
        sources: ["Z41", "STUK"],
      });
    }
  }
  if (cfg.fastGp) {
    rows.push({
      invest: "GP appointment within 7 days (Nordic level)",
      detail: "More GP time so people with symptoms are seen within a week instead of two. Its cost is not modelled here.",
      gain: `${FACTS.gpWaitToday - FACTS.gpWaitNordic} days sooner`,
      gainDetail: `the GP wait in the model drops by ${FACTS.gpWaitToday - FACTS.gpWaitNordic} days. Z12 is a news summary, not a national register.`,
      sources: ["Z12"],
    });
  }

  if (!rows.length) return <p className="text-ink-soft">You haven’t changed anything yet — go back and pick at least one change.</p>;

  return (
    <div>
      <div className="hidden grid-cols-[1.2fr_auto_1fr] gap-6 border-b border-rule pb-3 sm:grid">
        <span className="label text-ink-faint">If you invest in…</span>
        <span />
        <span className="label text-ink-faint">…you get</span>
      </div>
      <ol className="divide-y divide-rule">
        {rows.map((r) => (
          <li key={r.invest} className="grid gap-3 py-5 sm:grid-cols-[1.2fr_auto_1fr] sm:items-start sm:gap-6">
            <div>
              <p className="font-semibold text-ink">{r.invest}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.detail}</p>
            </div>
            <span className="hidden pt-0.5 text-2xl text-accent sm:block" aria-hidden>→</span>
            <div>
              <p className="font-display text-2xl text-accent">{r.gain}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.gainDetail}</p>
              <p className="mt-2 text-xs text-ink-faint">
                Based on:{" "}
                {r.sources.map((id, i) => {
                  const x = src(id);
                  return x ? (
                    <span key={id}>
                      {i > 0 && " · "}
                      <a href={x.url} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-accent">
                        {x.title.split(",")[0].split(" (")[0]}
                      </a>
                    </span>
                  ) : null;
                })}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-2 grid gap-3 rounded-2xl bg-accent-soft p-5 sm:grid-cols-[1.2fr_auto_1fr] sm:items-center sm:gap-6">
        <p className="font-semibold text-ink">All your choices together</p>
        <span className="hidden text-2xl text-accent sm:block" aria-hidden>→</span>
        <p className="text-ink">
          <b className="text-accent">{full.savedRoute} days sooner</b> to the CT report on the central assumption · {n1(full.demand)} slots/week · {n0(full.peopleReached)} people reached a year (Estimate)
        </p>
      </div>
    </div>
  );
}

export function PilotBrief({ cfg, setCfg, onEdit, onRestart }: Props) {
  const county = getCounty(cfg.slug);
  const s = simulate(county, cfg);
  const it = INTENSITY.find((i) => i.id === cfg.intensityId) ?? INTENSITY[1];
  const saved = s.daysToday - s.daysScenario;
  const weeks = Math.round(saved / 7);

  const headline =
    saved <= 0
      ? "Nothing changes yet."
      : `People in ${county.name} would learn they have lung cancer about ${weeks} week${weeks === 1 ? "" : "s"} sooner.`;

  const chips = [
    cfg.directCt ? "GP orders CT directly" : "Specialist still orders CT",
    cfg.directCt ? `${it.label} rules` : null,
    cfg.directCt ? `+${cfg.addedScans} scans a week` : null,
    cfg.fastGp ? "GP within 7 days" : "GP wait unchanged",
  ].filter((x): x is string => Boolean(x));

  return (
    <article className="pilot-brief border border-rule px-5 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-rule pb-8">
        <div>
          <p className="label flex items-center gap-2 text-ink-faint">
            <span className="text-ink"><Mark className="h-5 w-5" /></span> Your scenario
          </p>
          <h2 className="font-display mt-4 text-[clamp(2.8rem,7vw,5.6rem)] text-ink">{county.name}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((t) => (
              <span key={t} className="label rounded-full bg-accent-soft px-3 py-1.5 text-accent">{t}</span>
            ))}
          </div>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button type="button" onClick={onEdit} className="hack label border border-rule px-4 py-2.5 text-ink-soft">Change choices</button>
          <button type="button" onClick={onRestart} className="hack label border border-rule px-4 py-2.5 text-ink-soft">Start over</button>
          <button type="button" onClick={() => window.print()} className="cta label inline-flex items-center gap-2 bg-accent px-4 py-2.5 text-paper">
            <span className="cta-dot" />
            <Glitch>Print</Glitch>
          </button>
        </div>
      </header>

      {/* the answer, first */}
      <section className="mt-10">
        <p className="font-display max-w-4xl text-[clamp(1.8rem,3.6vw,3rem)] leading-tight text-ink">{headline}</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <Big value={`${s.savedDays.low}–${s.savedDays.high}`} label={`Days sooner (central ${s.savedDays.mid})`} tone="accent" tip={explain.daysSooner(s.savedDays.mid, s.daysToday, s.daysScenario)} />
          <Big value={n0(s.peopleReached)} label="People reached a year" tip={explain.cancersRoute(s.cancersRoute, s.cancersAll, s.reach)} />
          <Big value={n1(s.demand)} label="CT slots a week" tip={explain.scansWeek(s.demand, county.name)} />
        </div>
      </section>

      <Panel
        title="What it takes → what you get"
        className="mt-10"
        means="Direct CT and the reserved scans go together: the rule change saves the time, the scans make sure there is room for it. The faster GP adds on top for everyone. The bottom line is the combined result, not a simple sum of the lines."
      >
        <WhatItTakes cfg={cfg} />
      </Panel>

      <Panel
        title="The journey to a diagnosis · hover each part"
        className="mt-6"
        means={
          cfg.directCt
            ? `The biggest saving is the middle step: instead of waiting for a specialist to order the scan, the family doctor orders it. ${cfg.fastGp ? "The shorter GP wait adds a week for everyone." : "Shortening the GP wait would save another week."}`
            : cfg.fastGp
              ? "Only the GP wait gets shorter. Letting GPs order the CT directly would save far more."
              : "Nothing changes. Go back and let GPs order the CT, or shorten the GP wait."
        }
      >
        <Journey today={s.today} scenario={s.scenario} coping={s.coping} wait={s.wait} />
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="Who it helps · a year"
          className="lg:col-span-2"
          means="Most people who get the quick scan do not have cancer — they find out within days instead of months. The ones who do start treatment earlier."
        >
          <div className="grid gap-8 sm:grid-cols-3">
            <Big value={n0(s.cancersRoute)} label="Lung cancers found faster" tip={explain.cancersRoute(s.cancersRoute, s.cancersAll, s.reach)} />
            <Big value={n0(s.peopleScanned)} label="People get a quick CT" tip={explain.peopleScanned(s.peopleScanned)} />
            <Big
              value={cfg.fastGp ? n0(s.cancersAll) : "—"}
              label="Cancer patients see a GP sooner"
              tip={{
                title: "Faster GP",
                body: cfg.fastGp ? (
                  <>Every person with lung-cancer symptoms in the county (≈ {n0(s.cancersAll)} cancers a year) sees a doctor 7 days sooner.</>
                ) : (
                  <>You kept today’s GP wait.</>
                ),
              }}
            />
          </div>
        </Panel>
        <Panel title="Process endpoint" means="The pre-registered target is a median of 10 days or less from the symptomatic primary-care visit to the CT report. Sweden’s SVF filter budget is the anchor (Z41).">
          <p className="font-display text-5xl text-accent">≤ 10 days</p>
          <p className="mt-2 text-sm text-ink-soft">Median, visit to CT report. Estimate target, not a Finnish standard.</p>
        </Panel>
      </div>

      {cfg.directCt && (
        <Panel
          title="Can the hospital cope?"
          className="mt-6"
          means={
            s.coping === "ok"
              ? `Yes. You add enough scans, so the CT result comes in about ${s.wait} days and nobody else waits longer.`
              : `Not fully: the route needs ${n1(s.demand)} scans a week but you add ${cfg.addedScans}. Patients queue (${s.wait} days for the result) and part of the benefit is lost.`
          }
        >
          <Capacity need={s.demand} added={cfg.addedScans} wait={s.wait} setAdded={(n) => setCfg((c) => ({ ...c, addedScans: n }))} />
          <p className="mt-4 text-sm text-ink-soft">
            Estimated county chest CT: {n1(s.countyCtWeek)} a week (STUK 2024 national total, split by population, Estimate). This route is {(s.capacityShare * 100).toFixed(1)}% of that.
            {s.blocked ? " Over the share limit, so do not announce." : " Under the share limit."}
          </p>
          <label className="mt-3 block text-sm text-ink-soft">
            Block announcement above
            <input
              type="number"
              min={1}
              max={50}
              value={Math.round(cfg.shareLimit * 100)}
              onChange={(e) => setCfg((c) => ({ ...c, shareLimit: Number(e.target.value) / 100 }))}
              className="mx-2 w-16 rounded border border-rule px-2 py-1 text-ink"
            />
            % of estimated county chest CT (Estimate/Mock, default 5)
          </label>
          <label className="mt-3 block text-sm text-ink-soft">
            Pause intake if other non-urgent CT median wait rises more than
            <input
              type="number"
              min={1}
              max={30}
              value={cfg.stopDays}
              onChange={(e) => setCfg((c) => ({ ...c, stopDays: Number(e.target.value) }))}
              className="mx-2 w-16 rounded border border-rule px-2 py-1 text-ink"
            />
            days versus baseline for 4 weeks (Mock, default 7)
          </label>
        </Panel>
      )}

      <Panel
        title="Same rules in every county · extra CT slots a week"
        className="mt-6"
        means="Big counties gain most in absolute numbers because more people live there. Small counties are easier places to start and prove it works."
      >
        <Finland cfg={cfg} setCfg={setCfg} />
      </Panel>

      <details className="group mt-6 border border-rule bg-paper-raised" open>
        <summary className="label flex cursor-pointer list-none items-center justify-between px-5 py-4 text-ink-soft hover:text-accent [&::-webkit-details-marker]:hidden sm:px-6">
          How we calculated this · data and sources
          <span className="nums text-ink-faint transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="grid gap-8 border-t border-rule px-5 py-6 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="label text-accent">Data we use</p>
            <ul className="mt-4 space-y-3">
              {MODEL_SOURCES.map((src) => (
                <li key={src.id} className="text-sm leading-relaxed">
                  <span className="text-ink">{src.what}</span>
                  <br />
                  <a href={src.url} target="_blank" rel="noreferrer" className="text-xs text-ink-faint hover:text-accent">
                    {src.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-accent">Assumptions we made</p>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink-soft">
              {ASSUMPTIONS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
            <p className="mt-6 text-xs leading-relaxed text-ink-faint">
              County numbers (cancers, deaths, population) come from Statistics Finland and the files on the Sources page. This is a
              planning model, not a medical device and not a promise — the way to know for sure is to run the change in one county
              and measure it against a similar one (here: {s.comparator.name}).
            </p>
          </div>
        </div>
      </details>
    </article>
  );
}
