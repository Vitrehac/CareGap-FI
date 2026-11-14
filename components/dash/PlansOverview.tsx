"use client";

import Link from "next/link";
import { evaluate, money, num } from "@/lib/engine";
import { resetExamples, useHydrated, usePlans } from "@/lib/plans";
import { Kpi, Page, VerdictPill } from "./ui";

export function PlansOverview() {
  const plans = usePlans();
  const ready = useHydrated();
  const evs = plans.map((p) => ({ p, ev: evaluate(p) }));
  const people = evs.reduce((a, x) => a + x.ev.peopleScannedYear, 0);
  const cancers = evs.reduce((a, x) => a + x.ev.sim.cancersRoute, 0);
  const meeting = evs.filter((x) => x.ev.verdict === "meets").length;
  const yearly = evs.reduce((a, x) => a + x.ev.yearly, 0);

  return (
    <Page
      title="Strategic plans"
      sub="One plan per county. Open a plan to see what it buys and how it is going."
      actions={
        <Link href="/dashboard/new" className="cta bg-accent px-5 py-2.5 text-paper">
          + New plan
        </Link>
      }
    >
      {!ready ? (
        <p className="text-ink-faint">Loading plans…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi tone="accent" label="People get a CT answer sooner" value={num(people, 0)} sub={`a year, across ${plans.length} plan${plans.length === 1 ? "" : "s"}`} />
            <Kpi label="Lung cancers on the fast CT route" value={num(cancers, 0)} sub="a year" />
            <Kpi label="Plans on the endpoint" value={String(meeting)} sub="median visit → CT report within 10 days, inside capacity" />
            <Kpi label="Running cost" value={money(yearly)} sub="a year, all plans together" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {evs.map(({ p, ev }) => {
              return (
                <Link key={p.id} href={`/dashboard/plan/${p.id}`} className="group rounded-3xl border border-rule bg-paper p-5 transition-shadow hover:shadow-[0_18px_40px_-28px_rgb(29_43_37/0.45)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-ink-faint">{ev.county.name}</p>
                      <p className="truncate font-semibold text-ink group-hover:text-accent">{p.name}</p>
                    </div>
                    <VerdictPill v={ev.verdict} />
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div>
                      <p className="font-display text-3xl text-accent">{num(ev.peopleScannedYear, 0)}</p>
                      <p className="text-xs text-ink-faint">people scanned / yr</p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-ink">{num(ev.sim.cancersRoute, 0)}</p>
                      <p className="text-xs text-ink-faint">on the fast CT route</p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-ink">{ev.sim.visitToCt}</p>
                      <p className="text-xs text-ink-faint">days visit → CT</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5">
                    {[
                      { l: "Today", d: ev.sim.daysToday, c: "#c9cfcb" },
                      { l: "Plan", d: ev.sim.daysToday - ev.sim.savedRoute, c: "#1f8a5c" },
                    ].map((r) => (
                      <div key={r.l} className="grid grid-cols-[3rem_1fr_3.5rem] items-center gap-2 text-xs text-ink-soft">
                        <span>{r.l}</span>
                        <span className="h-2 rounded-r-[4px]" style={{ width: `${(r.d / ev.sim.daysToday) * 100}%`, background: r.c }} />
                        <span className="text-right">{r.d} days</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-rule pt-3 text-xs text-ink-faint">
                    <span>{money(ev.yearly)} / yr</span>
                    <span>{num(ev.scans)} scans / wk</span>
                    <span>since {p.inputs.start}</span>
                    {p.example && <span className="rounded-full bg-sand px-2 text-ink-soft">example</span>}
                  </div>
                </Link>
              );
            })}
            <Link href="/dashboard/new" className="grid min-h-60 place-items-center rounded-3xl border-2 border-dashed border-rule p-5 text-center text-ink-soft transition-colors hover:border-accent hover:text-accent">
              <span>
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-2xl text-accent">+</span>
                <span className="mt-3 block font-semibold">Create a new plan</span>
                <span className="mt-1 block text-sm text-ink-faint">Pick a county, budget and staff</span>
              </span>
            </Link>
          </div>
          {plans.length === 0 && (
            <button type="button" onClick={resetExamples} className="mt-6 text-sm text-ink-faint underline">
              Restore the example plans
            </button>
          )}
        </>
      )}
    </Page>
  );
}
