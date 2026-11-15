"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { LIMITER_TEXT, VERDICT, actuals, demoFeed, evaluate, money, num, type Evaluation } from "@/lib/engine";
import { deletePlan, savePlan, uid, useHydrated, usePlans, type Investment, type Plan, type PlanInputs, type WeekReport } from "@/lib/plans";
import { JourneyBar, Legend, LineChart, SERIES } from "./charts";
import { Card, Field, Kpi, NumberInput, Page, Segmented, VerdictPill } from "./ui";

type Mode = "estimate" | "actual";

export function PlanView() {
  const { id } = useParams<{ id: string }>();
  const plans = usePlans();
  const ready = useHydrated();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("estimate");
  const plan = plans.find((p) => p.id === id);

  if (!ready) return <p className="p-8 text-ink-faint">Loading plan…</p>;
  if (!plan)
    return (
      <Page title="Plan not found">
        <Link href="/dashboard" className="text-accent underline">↲ Back to plans</Link>
      </Page>
    );

  const ev = evaluate(plan);
  const update = (p: Plan) => savePlan({ ...p, investments: evaluate(p).investments });

  return (
    <Page
      title={
        <span className="flex flex-wrap items-center gap-3">
          {plan.name} <VerdictPill v={ev.verdict} />
        </span>
      }
      sub={
        <span>
          <Link href="/dashboard" className="hover:text-accent">↲ Plans</Link> · {ev.county.name} · {num(plan.inputs.scansPerWeek)} scans a week · {plan.inputs.horizonYears === 1 ? "12-month pilot" : `${plan.inputs.horizonYears} years`} from {plan.inputs.start}
        </span>
      }
      actions={
        <>
          <Segmented<Mode>
            value={mode}
            onChange={setMode}
            options={[
              { value: "estimate", label: "Estimate" },
              { value: "actual", label: "Actual" },
            ]}
          />
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete “${plan.name}”? This cannot be undone.`)) {
                deletePlan(plan.id);
                router.push("/dashboard");
              }
            }}
            className="hack border border-rule px-4 py-2 text-sm font-semibold text-ink-faint"
          >
            Delete
          </button>
        </>
      }
    >
      {mode === "estimate" ? <EstimateView plan={plan} ev={ev} update={update} /> : <ActualView plan={plan} ev={ev} update={update} />}
    </Page>
  );
}

/* ------------------------------------------------------------------ estimate */

function EstimateView({ plan, ev, update }: { plan: Plan; ev: Evaluation; update: (p: Plan) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-sand-soft px-4 py-3">
          <p className="text-xs text-ink-faint">CT report · Estimate</p>
          <p className="font-display text-3xl text-ink">about {ev.sim.visitToCt} days</p>
        </div>
        <div className="rounded-2xl bg-sand-soft px-4 py-3">
          <p className="text-xs text-ink-faint">{ev.county.slug === "kainuu" ? "Liwe estimate for Kainuu today" : "Liwe estimate for today"} · Estimate</p>
          <p className="font-display text-3xl text-ink">{ev.sim.daysToday - ev.sim.savedRoute} vs {ev.sim.daysToday} days</p>
          <p className="text-xs text-ink-faint">diagnosis, plan vs today</p>
        </div>
        <div className="rounded-2xl bg-sand-soft px-4 py-3">
          <p className="text-xs text-ink-faint">Chest-CT capacity stop · Estimate/Mock</p>
          <p className="font-display text-3xl text-ink">{num(ev.capacityShare * 100, 1)}%</p>
          <p className="text-xs text-ink-faint">{ev.capacityShare > 0.05 ? "Over 5%. Pause the route." : "Under 5%. Stop rule clear."}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi
          tone="accent"
          label="People get a CT answer sooner"
          value={num(ev.peopleScannedYear, 0)}
          sub={`a year · ${num(ev.ruledOutYear, 0)} hear it is not cancer`}
          tip={{ title: "Everyone the route scans", body: `${num(ev.scans)} reserved scans a week × 52. Each person gets the answer ${ev.sim.savedRoute} days sooner than on today's path, whether it turns out to be cancer or not.` }}
        />
        <Kpi label="Lung cancers on the fast CT route" value={num(ev.sim.cancersRoute)} sub={`a year · ${num(ev.sim.reach * 100, 0)}% of ${Math.round(ev.county.casesPerYearEst)} new cases`} />
        <Kpi
          label="Public visit → CT report"
          value={`${ev.sim.visitToCt} days`}
          sub={`pilot endpoint ≤ ${10} days · ${ev.verdict === "meets" ? "inside the target" : "check the verdict"}`}
          tip={{ title: "Public door", body: "Days from the public health-centre visit to the CT report, if the reserved slots cover demand. Estimate, anchored on Sweden's 7-day filter budget. Not a survival figure." }}
        />
      </div>

      <Card title="Endpoints">
        <ol className="space-y-4 text-sm leading-relaxed text-ink-soft">
          <li>
            <b className="text-ink">Primary · live.</b> Median days from the public health-centre visit to the CT report, target ≤ 10. This is what the weekly mock feed shows. Estimate target, anchored on Sweden&apos;s SVF filter budget.
          </li>
          <li>
            <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-semibold text-ink-soft">Retrospective · Findata permit · Mock</span>
            <span className="mt-2 block">At 12 months: the gap in days to the CT report between a public first contact and an occupational or private first contact. That comparison needs Kanta-linked data under a Findata permit. It is not a live weekly metric.</span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-ink-faint">Aggregate reporting only. Any record linkage happens in a later Findata-permitted evaluation, not in Liwe.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Worth plan={plan} ev={ev} />
        <Card title="Can you run it?" aside={<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ev.limiter === "covered" ? "bg-accent-soft text-accent" : "bg-[#fbf0d9] text-[#8a5a00]"}`}>{LIMITER_TEXT[ev.limiter]}</span>}>
          <Capacity ev={ev} />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card title="Time to diagnosis" aside={<span className="text-sm text-ink-faint">hover a bar</span>}>
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-sm text-ink-soft">{ev.county.slug === "kainuu" ? "Liwe estimate for Kainuu today · Estimate" : "Today · Estimate"}</p>
              <JourneyBar max={ev.sim.daysToday} total={ev.sim.daysToday} stages={ev.sim.today.map((s, i) => ({ label: s.label, days: s.days, color: ["#c9cfcb", "#b3bab6", "#9aa59f"][i] }))} />
            </div>
            <div>
              <p className="mb-1.5 text-sm text-ink-soft">On the fast route</p>
              <JourneyBar max={ev.sim.daysToday} total={ev.sim.daysToday - ev.sim.savedRoute} stages={ev.sim.scenario.map((s, i) => ({ label: s.label, days: s.days, color: ["#9fd0b4", "#1f8a5c", "#5aa883"][i] }))} />
            </div>
          </div>
          <ul className="mt-5 grid gap-2 text-sm text-ink-soft sm:grid-cols-3">
            {ev.sim.scenario.map((s) => (
              <li key={s.key} className="rounded-2xl bg-sand-soft px-3 py-2">
                <b className="block text-ink">{s.days} days</b>
                {s.label}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Who it helps, a year">
          <Funnel ev={ev} />
        </Card>
      </div>

      <Steps ev={ev} />
      <Investments plan={plan} ev={ev} update={update} />
      <Inputs plan={plan} update={update} />
    </div>
  );
}

function Worth({ plan, ev }: { plan: Plan; ev: Evaluation }) {
  const v = VERDICT[ev.verdict];
  const fin = (x: number) => (Number.isFinite(x) ? money(x) : "—");
  return (
    <Card title="Against the pilot target" aside={<VerdictPill v={ev.verdict} />}>
      <p className="text-ink-soft">{v.text}</p>
      <p className="mt-1 text-sm text-ink-faint">
        Whole-county cost of the CT route, {money(ev.total)} over {plan.inputs.horizonYears === 1 ? "the 12-month pilot" : `${plan.inputs.horizonYears} years`} ({money(ev.oneOff)} once + {money(ev.yearly)} a year).
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        {[
          ["per person scanned", fin(ev.perPatient), "Estimate"],
          ["per cancer on the fast CT route", fin(ev.perCancer), "Estimate"],
          ["CT report", `about ${ev.sim.visitToCt} days`, "Estimate"],
          ["county CT used", `${num(ev.capacityShare * 100)}%`, "Estimate"],
        ].map(([k, val, tag]) => (
          <div key={k}>
            <dd className="font-display text-3xl text-ink">{val}</dd>
            <dt className="text-sm text-ink-faint">{k} · {tag}</dt>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function Capacity({ ev }: { ev: Evaluation }) {
  const rows = [
    { k: "You asked for", v: ev.wanted, main: true },
    { k: "Scanners allow", v: ev.caps.scanners },
    { k: "Radiologists allow", v: ev.caps.radiologists },
    { k: "Funding allows", v: ev.caps.funding },
  ];
  const max = Math.max(...rows.map((r) => r.v), ev.useful, 1) * 1.05;
  return (
    <div>
      <ul className="space-y-3">
        {rows.map((r) => {
          const short = !r.main && r.v < ev.wanted;
          return (
            <li key={r.k} className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-sm">
              <span className={r.main ? "font-semibold text-ink" : "text-ink-soft"}>{r.k}</span>
              <span className="relative h-3.5">
                <span className="absolute inset-y-0 left-0 rounded-r-[4px]" style={{ width: `${Math.max(1, (r.v / max) * 100)}%`, background: r.main ? "#1d2b25" : short ? "#e9a493" : "#9fd0b4" }} />
              </span>
              <span className="text-right text-ink">{num(r.v)}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">
        scans a week. You can run <b className="text-ink">{num(ev.scans)}</b>
        {ev.scans > ev.useful ? <> — more than the ≈ {num(ev.useful)} that still find new cancers.</> : <>; up to ≈ {num(ev.useful)} would still find more cancers.</>}
      </p>
      {ev.limiter !== "covered" && <p className="mt-2 text-sm text-ink-faint">Raise the {ev.limiter === "funding" ? "funding" : ev.limiter === "scanners" ? "spare CT slots or add a scanner" : "radiologist hours"} in “Plan inputs” to run all {num(ev.wanted)}.</p>}
    </div>
  );
}

function Funnel({ ev }: { ev: Evaluation }) {
  const rows = [
    { k: "People scanned", v: ev.peopleScannedYear, c: "#9fd0b4" },
    { k: "Not cancer — reassured sooner", v: ev.ruledOutYear, c: "#cfe8da" },
    { k: "Lung cancer on the fast CT route", v: ev.sim.cancersRoute, c: "#1f8a5c" },
  ];
  const max = Math.max(rows[0].v, 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.k} className="grid grid-cols-[11rem_1fr_3.5rem] items-center gap-3 text-sm">
          <span className="text-ink-soft">{r.k}</span>
          <span className="h-3.5 rounded-r-[4px]" style={{ width: `${Math.max(1, (r.v / max) * 100)}%`, background: r.c }} />
          <span className="text-right text-ink">{num(r.v, r.v < 10 ? 1 : 0)}</span>
        </li>
      ))}
    </ul>
  );
}

function Steps({ ev }: { ev: Evaluation }) {
  return (
    <Card title="How this plan is calculated" aside={<span className="text-sm text-ink-faint">every number, with its source</span>}>
      <ol className="divide-y divide-rule">
        {ev.steps.map((s, i) => (
          <li key={s.label} className="grid gap-1 py-3 sm:grid-cols-[2rem_15rem_7rem_1fr] sm:items-baseline sm:gap-4">
            <span className="text-sm text-ink-faint">{i + 1}</span>
            <span className="font-semibold text-ink">{s.label}</span>
            <span className="font-display text-xl text-accent">{s.value}</span>
            <span className="text-sm text-ink-soft">
              {s.how}
              {s.source && (
                <>
                  {" · "}
                  <a href={s.source.url} target="_blank" rel="noreferrer" className="text-ink-faint underline decoration-dotted underline-offset-2 hover:text-accent">
                    {s.source.title.split(",")[0].split(" (")[0]}
                  </a>
                </>
              )}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* ------------------------------------------------------------------ investments */

const STATUS: Investment["status"][] = ["planned", "ordered", "paid"];

function Investments({ plan, ev, update }: { plan: Plan; ev: Evaluation; update: (p: Plan) => void }) {
  const [draft, setDraft] = useState({ name: "", kind: "one-off" as Investment["kind"], estimate: 0 });
  const list = ev.investments;
  const save = (next: Investment[]) => update({ ...plan, investments: next });
  const patch = (id: string, p: Partial<Investment>) => save(list.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const actualTotal = list.reduce((a, i) => a + (i.actual !== undefined ? (i.kind === "yearly" ? i.actual * plan.inputs.horizonYears : i.actual) : 0), 0);

  return (
    <Card
      title="Investments"
      aside={<span className="text-sm text-ink-faint">Enter the supplier&apos;s price as “actual” once you have a quote — every number above recalculates.</span>}
    >
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="text-left text-ink-faint">
              <th className="px-2 pb-2 font-semibold">Item</th>
              <th className="px-2 pb-2 font-semibold">Type</th>
              <th className="px-2 pb-2 text-right font-semibold">Estimate</th>
              <th className="px-2 pb-2 font-semibold">Actual price</th>
              <th className="px-2 pb-2 font-semibold">Supplier</th>
              <th className="px-2 pb-2 font-semibold">Status</th>
              <th className="px-2 pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {list.map((i) => (
              <tr key={i.id} className="align-top">
                <td className="px-2 py-3">
                  <p className="font-semibold text-ink">{i.name}</p>
                  {i.note && <p className="text-xs text-ink-faint">{i.note}</p>}
                </td>
                <td className="px-2 py-3 text-ink-soft">{i.kind === "yearly" ? "per year" : "one-off"}</td>
                <td className="px-2 py-3 text-right text-ink-soft">{money(i.estimate)}</td>
                <td className="w-36 px-2 py-2">
                  <input
                    type="number"
                    placeholder="—"
                    value={i.actual ?? ""}
                    onChange={(e) => patch(i.id, { actual: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)) })}
                    className="w-full rounded-xl border border-rule px-2 py-1.5 text-ink"
                  />
                </td>
                <td className="w-40 px-2 py-2">
                  <input value={i.supplier ?? ""} placeholder="e.g. Siemens" onChange={(e) => patch(i.id, { supplier: e.target.value })} className="w-full rounded-xl border border-rule px-2 py-1.5 text-ink" />
                </td>
                <td className="px-2 py-2">
                  <select value={i.status} onChange={(e) => patch(i.id, { status: e.target.value as Investment["status"] })} className="rounded-xl border border-rule bg-paper px-2 py-1.5 text-ink">
                    {STATUS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-3 text-right">
                  {!i.auto && (
                    <button type="button" onClick={() => save(list.filter((x) => x.id !== i.id))} className="text-ink-faint hover:text-alarm" aria-label={`Remove ${i.name}`}>
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-2 py-3">
                <input value={draft.name} placeholder="Add an item, e.g. Second radiologist" onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-xl border border-rule px-2 py-1.5 text-ink" />
              </td>
              <td className="px-2 py-3">
                <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as Investment["kind"] })} className="rounded-xl border border-rule bg-paper px-2 py-1.5 text-ink">
                  <option value="one-off">one-off</option>
                  <option value="yearly">per year</option>
                </select>
              </td>
              <td className="px-2 py-3">
                <input type="number" value={draft.estimate || ""} placeholder="€" onChange={(e) => setDraft({ ...draft, estimate: Math.max(0, Number(e.target.value)) })} className="w-full rounded-xl border border-rule px-2 py-1.5 text-right text-ink" />
              </td>
              <td className="px-2 py-3" colSpan={4}>
                <button
                  type="button"
                  disabled={!draft.name || !draft.estimate}
                  onClick={() => {
                    save([...list, { id: uid(), name: draft.name, kind: draft.kind, estimate: draft.estimate, status: "planned" }]);
                    setDraft({ name: "", kind: "one-off", estimate: 0 });
                  }}
                  className="cta bg-accent px-4 py-1.5 text-sm text-paper disabled:opacity-40"
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 rounded-2xl bg-accent-soft p-4 text-sm sm:grid-cols-4">
        <p><span className="block text-ink-faint">One-off</span><b className="text-lg text-ink">{money(ev.oneOff)}</b></p>
        <p><span className="block text-ink-faint">Per year</span><b className="text-lg text-ink">{money(ev.yearly)}</b></p>
        <p><span className="block text-ink-faint">Whole plan ({plan.inputs.horizonYears === 1 ? "12-month pilot" : `${plan.inputs.horizonYears} yrs`})</span><b className="text-lg text-ink">{money(ev.total)}</b></p>
        <p><span className="block text-ink-faint">Confirmed by real prices</span><b className="text-lg text-ink">{money(actualTotal)}</b></p>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ inputs */

function Inputs({ plan, update }: { plan: Plan; update: (p: Plan) => void }) {
  const I = plan.inputs;
  const set = <K extends keyof PlanInputs>(k: K, v: PlanInputs[K]) => update({ ...plan, inputs: { ...I, [k]: v } });
  const setCost = (k: keyof Plan["costs"], v: number) => update({ ...plan, costs: { ...plan.costs, [k]: v } });
  return (
    <details className="group rounded-3xl border border-rule bg-paper">
      <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold text-ink sm:p-6 [&::-webkit-details-marker]:hidden">
        Plan inputs and unit prices
        <span className="text-ink-faint transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="grid gap-5 border-t border-rule p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <Field label="CT scans for the route"><NumberInput value={I.scansPerWeek} onChange={(v) => set("scansPerWeek", v)} suffix="/ wk" step={0.5} /></Field>
        <Field label="Funding a year"><NumberInput value={I.yearlyFunding} onChange={(v) => set("yearlyFunding", v)} prefix="€" step={10000} /></Field>
        <Field label="One-off budget"><NumberInput value={I.oneOffBudget} onChange={(v) => set("oneOffBudget", v)} prefix="€" step={10000} /></Field>
        <Field label="Pilot length"><NumberInput value={I.horizonYears} onChange={(v) => set("horizonYears", Math.max(1, Math.min(15, Math.round(v))))} suffix={I.horizonYears === 1 ? "year (12-month pilot)" : "years"} min={1} /></Field>
        <Field label="Spare CT slots"><NumberInput value={I.spareCtSlots} onChange={(v) => set("spareCtSlots", v)} suffix="/ wk" /></Field>
        <Field label="New CT scanners"><NumberInput value={I.newScanners} onChange={(v) => set("newScanners", Math.round(v))} /></Field>
        <Field label="Radiologist time"><NumberInput value={I.radiologistHours} onChange={(v) => set("radiologistHours", v)} suffix="h / wk" step={0.5} /></Field>
        <Field label="New family doctors"><NumberInput value={I.newGps} onChange={(v) => set("newGps", Math.round(v))} /></Field>
        <Field label="Price of one chest CT" hint="Tyks list: €132–198"><NumberInput value={plan.costs.ctEuro} onChange={(v) => setCost("ctEuro", v)} prefix="€" /></Field>
        <Field label="Price of a CT scanner" hint="Estimate until you have a quote"><NumberInput value={plan.costs.scannerEuro} onChange={(v) => setCost("scannerEuro", v)} prefix="€" step={10000} /></Field>
        <Field label="Slots per new scanner"><NumberInput value={plan.costs.slotsPerScanner} onChange={(v) => setCost("slotsPerScanner", v)} suffix="/ wk" /></Field>
        <Field label="Start month">
          <input type="month" value={I.start} onChange={(e) => e.target.value && set("start", e.target.value)} className="w-full rounded-2xl border border-rule bg-paper px-3 py-2.5 text-ink" />
        </Field>
      </div>
    </details>
  );
}

/* ------------------------------------------------------------------ actual */

function ActualView({ plan, ev, update }: { plan: Plan; ev: Evaluation; update: (p: Plan) => void }) {
  const records: WeekReport[] = [...plan.weeks, ...demoFeed(plan, ev)];
  const a = actuals(plan, ev, records);
  const labels = a.rows.map((r) => new Date(r.month + "-01").toLocaleString("en-GB", { month: "short", year: "2-digit" }));
  const behind = a.recentMedian !== null && a.recentMedian > 10;
  const latest = [...records].sort((x, y) => (x.weekStart < y.weekStart ? 1 : -1)).slice(0, 12);

  if (!a.rows.length)
    return (
      <Card>
        <p className="text-ink-soft">The plan starts in {plan.inputs.start}. Actual data appears once the first patients go through the route.</p>
      </Card>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#3d63b8]/30 bg-[#eef2fb] px-4 py-3 text-sm text-[#2c4a8c]">
        <span>
          <b>Mock data.</b> Weekly totals shaped like {ev.county.name}&apos;s plan. A live feed would be a weekly aggregate from the county&apos;s own reporting (Lifecare, Omni360, Apotti or Esko).
        </span>
        <Link href="/dashboard/data" className="font-semibold underline">Connect a data source ↳</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi tone="blue" label="Pathways started" value={a.started} sub="weekly totals, mock feed" />
        <Kpi
          label="Public visit → CT report"
          value={a.recentMedian !== null ? `${a.recentMedian} days` : "—"}
          sub={
            <span className={behind ? "text-[#b13d29]" : "text-accent"}>
              {behind ? "Over 10 days" : "Within 10 days"} · plan {ev.sim.visitToCt} days
            </span>
          }
          tip={{ title: "Last 3 months", body: "Median of the weekly medians. Mock data. The clock is the symptomatic visit to the CT report, not survival." }}
        />
        <Kpi label="CT scans used" value={a.scans} sub="sum of weekly reports" />
        <Kpi label="Spent so far" value={money(a.spendAct)} sub={`budgeted ${money(a.spendEst)} by now`} />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Mock data</p>
      <Card title="Days from the GP visit to the CT report" aside={<Legend items={[{ label: "Weekly median", color: SERIES.actual }, { label: "Plan", color: SERIES.estimate }, { label: "Endpoint", color: SERIES.none, dashed: true }]} />}>
        <LineChart
          labels={labels}
          series={[
            { key: "end", label: "Endpoint", color: SERIES.none, values: a.rows.map((r) => r.endpointDays), dashed: true },
            { key: "target", label: "Plan", color: SERIES.estimate, values: a.rows.map((r) => r.targetDays) },
            { key: "actual", label: "Actual", color: SERIES.actual, values: a.rows.map((r) => r.medianDays) },
          ]}
          format={(x) => `${Math.round(x)} d`}
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="CT scans used, cumulative" aside={<Legend items={[{ label: "Reported", color: SERIES.actual }, { label: "Plan", color: SERIES.estimate }]} />}>
          <LineChart
            labels={labels}
            series={[
              { key: "est", label: "Plan", color: SERIES.estimate, values: a.rows.map((r) => r.cumScansEst) },
              { key: "act", label: "Reported", color: SERIES.actual, values: a.rows.map((r) => r.cumScansAct) },
            ]}
            format={(x) => num(x, 0)}
          />
        </Card>
        <Card title="Money spent, cumulative" aside={<Legend items={[{ label: "Actual", color: SERIES.actual }, { label: "Budgeted", color: SERIES.estimate }]} />}>
          <LineChart
            labels={labels}
            series={[
              { key: "est", label: "Budgeted", color: SERIES.estimate, values: a.rows.map((r) => r.cumSpendEst) },
              { key: "act", label: "Actual", color: SERIES.actual, values: a.rows.map((r) => r.cumSpendAct) },
            ]}
            format={money}
          />
          <p className="mt-2 text-sm text-ink-faint">Actual = scans done × {money(plan.costs.ctEuro)} + investments marked “paid”.</p>
        </Card>
      </div>

      <Card title="Weekly county report · newest first">
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[42rem] text-sm">
            <thead>
              <tr className="text-left text-ink-faint">
                {["Week", "Pathways started", "Median visit → CT", "CT scans used", "Other CT wait", "Source"].map((h) => (
                  <th key={h} className="px-2 pb-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {latest.map((p) => (
                <tr key={p.id}>
                  <td className="px-2 py-2 text-ink-soft">{p.weekStart}</td>
                  <td className="px-2 py-2 text-ink">{p.pathwaysStarted}</td>
                  <td className="px-2 py-2 text-ink">{p.medianDaysVisitToCt ?? "—"}</td>
                  <td className="px-2 py-2 text-ink">{p.ctScansUsed}</td>
                  <td className="px-2 py-2 text-ink">{p.otherCtMedianWait ?? "—"}</td>
                  <td className="px-2 py-2 text-ink-faint">{p.source === "mock" ? "Mock data" : p.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <LogWeek onAdd={(p) => update({ ...plan, weeks: [p, ...plan.weeks] })} />
      </Card>
    </div>
  );
}

function LogWeek({ onAdd }: { onAdd: (p: WeekReport) => void }) {
  const [f, setF] = useState({ weekStart: "", pathwaysStarted: "", median: "", scans: "", other: "" });
  return (
    <details className="mt-4 rounded-2xl bg-sand-soft">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink">+ Add a weekly total</summary>
      <div className="grid gap-3 px-4 pb-4 sm:grid-cols-3 lg:grid-cols-6">
        <label className="text-sm">
          <span className="block text-ink-faint">Week starting</span>
          <input type="date" value={f.weekStart} onChange={(e) => setF({ ...f, weekStart: e.target.value })} className="mt-1 w-full rounded-xl border border-rule px-2 py-1.5 text-ink" />
        </label>
        {([
          ["pathwaysStarted", "Pathways started"],
          ["median", "Median days"],
          ["scans", "CT scans used"],
          ["other", "Other CT wait"],
        ] as const).map(([k, label]) => (
          <label key={k} className="text-sm">
            <span className="block text-ink-faint">{label}</span>
            <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-1 w-full rounded-xl border border-rule px-2 py-1.5 text-ink" />
          </label>
        ))}
        <button
          type="button"
          disabled={!f.weekStart}
          onClick={() => {
            onAdd({
              id: `M-${uid().slice(0, 6).toUpperCase()}`,
              weekStart: f.weekStart,
              pathwaysStarted: Number(f.pathwaysStarted) || 0,
              medianDaysVisitToCt: f.median === "" ? null : Number(f.median),
              ctScansUsed: Number(f.scans) || 0,
              otherCtMedianWait: f.other === "" ? null : Number(f.other),
              source: "manual",
            });
            setF({ weekStart: "", pathwaysStarted: "", median: "", scans: "", other: "" });
          }}
          className="cta self-end bg-accent px-4 py-2 text-sm text-paper disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </details>
  );
}
