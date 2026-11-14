"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CountyMap } from "@/components/CountyMap";
import { selectable } from "@/components/pilot/model";
import { getCounty } from "@/lib/data";
import { ASSUMED, LIMITER_TEXT, evaluate, money, num } from "@/lib/engine";
import { DEFAULT_COSTS, defaultInputs, savePlan, suggestedScans, uid, type Plan, type PlanInputs } from "@/lib/plans";
import { Card, Field, NumberInput, Page, VerdictPill } from "./ui";

const STEPS = ["County & scans", "Money", "People & capacity", "Review"];

export function NewPlan() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<PlanInputs>(() => defaultInputs(selectable[0].slug));
  const [name, setName] = useState("");
  const set = <K extends keyof PlanInputs>(k: K, v: PlanInputs[K]) => setInputs((i) => ({ ...i, [k]: v }));
  const county = getCounty(inputs.slug);
  const pickCounty = (slug: string) => setInputs((i) => ({ ...i, slug, scansPerWeek: suggestedScans(slug) }));

  const draft: Plan = useMemo(
    () => ({ id: "draft", name: name || `${county.name} · lung track`, createdAt: "", status: "draft", inputs, costs: { ...DEFAULT_COSTS }, investments: [], pathways: [] }),
    [inputs, name, county.name],
  );
  const ev = evaluate(draft);

  const create = () => {
    const plan: Plan = { ...draft, id: uid(), status: "active", createdAt: new Date().toISOString().slice(0, 10) };
    plan.investments = ev.investments;
    savePlan(plan);
    router.push(`/dashboard/plan/${plan.id}`);
  };

  return (
    <Page title="New strategic plan" sub="Four short steps. The panel on the right updates as you type.">
      <ol className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${i === step ? "bg-accent text-paper" : i < step ? "bg-accent-soft text-accent" : "bg-paper text-ink-faint"}`}
            >
              {i + 1}. {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Card>
          {step === 0 && (
            <div className="grid gap-6 md:grid-cols-[1fr_13rem]">
              <div className="space-y-6">
                <Field label="Which county?" hint="Ordered from the highest need (lung-cancer deaths, COPD, access to care).">
                  <select value={inputs.slug} onChange={(e) => pickCounty(e.target.value)} className="w-full rounded-2xl border border-rule bg-paper px-3 py-2.5 text-ink">
                    {selectable.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} · {Math.round(c.deathsPerYear)} lung-cancer deaths a year
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Chest CT scans a week for the GP route" hint="Slots reserved so a family doctor can send a patient with lung symptoms straight to CT.">
                  <NumberInput value={inputs.scansPerWeek} onChange={(v) => set("scansPerWeek", v)} suffix="scans / wk" step={0.5} />
                </Field>
                <div className="rounded-2xl bg-sand-soft p-4 text-sm leading-relaxed text-ink-soft">
                  <p>
                    <b className="text-ink">{num(ev.peopleScannedYear, 0)} people a year</b> get a chest CT within a week. About 1 in {num(2.38, 2)} of them has lung cancer, so ≈{" "}
                    <b className="text-ink">{num(ev.sim.cancersRoute)} lung cancers</b> are found sooner — {num(ev.sim.reach * 100, 0)}% of the {Math.round(county.casesPerYearEst)} new cases a year in {county.name}.
                  </p>
                  <p className="mt-2 text-ink-faint">
                    Above ≈ {num(ev.useful)} scans a week there are no more cancers to find on this route.{" "}
                    <button type="button" className="font-semibold text-accent underline" onClick={() => set("scansPerWeek", Math.round(ev.useful * 2) / 2)}>
                      Use {num(Math.round(ev.useful * 2) / 2)}
                    </button>
                  </p>
                </div>
              </div>
              <CountyMap selected={inputs.slug} onSelect={pickCounty} flagCapacity={false} />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Funding a year" hint="What the county can put into the programme every year.">
                <NumberInput value={inputs.yearlyFunding} onChange={(v) => set("yearlyFunding", v)} prefix="€" step={10000} />
              </Field>
              <Field label="One-off budget" hint="Equipment and setup, spent once.">
                <NumberInput value={inputs.oneOffBudget} onChange={(v) => set("oneOffBudget", v)} prefix="€" step={10000} />
              </Field>
              <Field label="Start" hint="First month of the programme.">
                <input type="month" value={inputs.start} onChange={(e) => e.target.value && set("start", e.target.value)} className="w-full rounded-2xl border border-rule bg-paper px-3 py-2.5 text-ink" />
              </Field>
              <Field label="Plan horizon" hint="Years you judge the investment over.">
                <NumberInput value={inputs.horizonYears} onChange={(v) => set("horizonYears", Math.max(1, Math.min(15, Math.round(v))))} suffix="years" min={1} />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Spare CT slots a week" hint={`On the county's existing scanners. Your plan uses ${num(inputs.scansPerWeek)} a week.`}>
                <NumberInput value={inputs.spareCtSlots} onChange={(v) => set("spareCtSlots", v)} suffix="slots / wk" />
              </Field>
              <Field label="New CT scanners" hint={`Each adds ≈ ${DEFAULT_COSTS.slotsPerScanner} slots a week; ≈ ${money(DEFAULT_COSTS.scannerEuro)} each until you enter a quote.`}>
                <NumberInput value={inputs.newScanners} onChange={(v) => set("newScanners", Math.round(v))} suffix="scanners" />
              </Field>
              <Field label="Radiologist time for this route" hint={`≈ ${ASSUMED.radiologistMinPerCt} min to read one scan. ${num(inputs.scansPerWeek)} scans need ≈ ${num((inputs.scansPerWeek * ASSUMED.radiologistMinPerCt) / 60)} h a week.`}>
                <NumberInput value={inputs.radiologistHours} onChange={(v) => set("radiologistHours", v)} suffix="hours / wk" step={0.5} />
              </Field>
              <Field label="Family doctors joining next year" hint={`Seeing everyone within 7 days needs ≈ ${Math.round(ev.gpNeeded)} more in ${county.name}.`}>
                <NumberInput value={inputs.newGps} onChange={(v) => set("newGps", Math.round(v))} suffix="doctors" />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Field label="Plan name">
                <input value={name} placeholder={`${county.name} · lung track`} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-rule bg-paper px-3 py-2.5 text-ink" />
              </Field>
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ["County", county.name],
                  ["Scans for the route", `${num(inputs.scansPerWeek)} a week`],
                  ["Funding", `${money(inputs.yearlyFunding)} a year + ${money(inputs.oneOffBudget)} once`],
                  ["Horizon", `${inputs.horizonYears} years from ${inputs.start}`],
                  ["CT", `${inputs.spareCtSlots} spare slots/wk, ${inputs.newScanners} new scanner(s)`],
                  ["Staff", `${inputs.radiologistHours} radiologist h/wk, +${inputs.newGps} family doctors`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-rule pb-2">
                    <dt className="text-ink-faint">{k}</dt>
                    <dd className="text-right font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 flex justify-between gap-3 border-t border-rule pt-5">
            <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="hack border border-rule px-5 py-2.5 text-sm font-semibold text-ink-soft disabled:opacity-40">
              ↲ Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} className="cta bg-accent px-6 py-2.5 text-paper">
                Next ↳
              </button>
            ) : (
              <button type="button" onClick={create} className="cta bg-accent px-6 py-2.5 text-paper">
                Create plan
              </button>
            )}
          </div>
        </Card>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card title="What this buys, a year" aside={<VerdictPill v={ev.verdict} />}>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-ink-faint">People get a CT answer sooner</dt>
                <dd className="font-display text-4xl text-accent">{num(ev.peopleScannedYear, 0)}</dd>
                <dd className="text-sm text-ink-soft">{ev.sim.savedRoute} days sooner each · {num(ev.ruledOutYear, 0)} of them hear it is not cancer</dd>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-rule pt-4">
                <div>
                  <dt className="text-xs text-ink-faint">Lung cancers found sooner</dt>
                  <dd className="font-display text-2xl text-ink">{num(ev.sim.cancersRoute)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Deaths avoided (estimate)</dt>
                  <dd className="font-display text-2xl text-ink">{num(ev.sim.livesYear.mid)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Running cost</dt>
                  <dd className="font-display text-2xl text-ink">{money(ev.yearly)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Per person scanned</dt>
                  <dd className="font-display text-2xl text-ink">{Number.isFinite(ev.perPatient) ? money(ev.perPatient) : "—"}</dd>
                </div>
              </div>
            </dl>
            <p className="mt-4 rounded-2xl bg-sand-soft px-3 py-2.5 text-sm text-ink-soft">
              <b className="text-ink">{num(ev.scans)}</b> of {num(ev.wanted)} scans a week possible · {LIMITER_TEXT[ev.limiter]}
            </p>
            {(ev.overBudget.yearly || ev.overBudget.oneOff) && (
              <p className="mt-2 rounded-2xl bg-alarm-soft px-3 py-2.5 text-sm text-[#b13d29]">
                Over budget: {ev.overBudget.yearly ? `${money(ev.yearly)} a year needed` : ""} {ev.overBudget.oneOff ? `${money(ev.oneOff)} one-off needed` : ""}
              </p>
            )}
          </Card>
        </aside>
      </div>
    </Page>
  );
}
