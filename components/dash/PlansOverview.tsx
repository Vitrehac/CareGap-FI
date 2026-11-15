"use client";

import Link from "next/link";
import { evaluate, money, num } from "@/lib/engine";
import { resetExamples, useHydrated, usePlans } from "@/lib/plans";
import { CapacityHeatmap } from "./CapacityHeatmap";
import { Page, VerdictPill } from "./ui";

export function PlansOverview() {
  const plans = usePlans();
  const ready = useHydrated();
  const evs = plans.map((p) => ({ p, ev: evaluate(p) }));

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
        <div className="grid items-start gap-6 lg:grid-cols-[18rem_1fr]">
          <section className="rounded-3xl border border-rule bg-paper p-4">
            <h2 className="font-semibold text-ink">Chest-CT share</h2>
            <p className="mt-1 text-sm text-ink-soft">Lung pathway as a share of the county’s chest CT. Estimate.</p>
            <div className="mt-3">
              <CapacityHeatmap planned={evs.map(({ ev }) => ev.county.slug)} />
            </div>
          </section>

          <section className="overflow-x-auto rounded-3xl border border-rule bg-paper">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-ink-faint">
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 text-right font-semibold">People scanned / yr</th>
                  <th className="px-3 py-3 text-right font-semibold">On the fast CT route</th>
                  <th className="px-3 py-3 text-right font-semibold">Days visit → CT</th>
                  <th className="px-3 py-3 text-right font-semibold">Scans / wk</th>
                  <th className="px-4 py-3 text-right font-semibold">€ / yr</th>
                </tr>
              </thead>
              <tbody>
                {evs.map(({ p, ev }) => (
                  <tr key={p.id} className="border-b border-rule last:border-0 hover:bg-sand-soft">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/plan/${p.id}`} className="font-semibold text-ink hover:text-accent">{p.name}</Link>
                      <p className="text-xs text-ink-faint">{ev.county.name}{p.example ? " · example" : ""} · since {p.inputs.start}</p>
                    </td>
                    <td className="px-3 py-3"><VerdictPill v={ev.verdict} /></td>
                    <td className="nums px-3 py-3 text-right text-ink">{num(ev.peopleScannedYear, 0)}</td>
                    <td className="nums px-3 py-3 text-right text-ink">{num(ev.sim.cancersRoute, 0)}</td>
                    <td className="nums px-3 py-3 text-right text-ink">{ev.sim.visitToCt}</td>
                    <td className="nums px-3 py-3 text-right text-ink">{num(ev.scans)}</td>
                    <td className="nums px-4 py-3 text-right text-ink">{money(ev.yearly)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {plans.length === 0 && (
              <p className="px-4 py-6 text-sm text-ink-soft">
                No plans yet.{" "}
                <button type="button" onClick={resetExamples} className="font-semibold text-accent underline">
                  Restore the example plans
                </button>
              </p>
            )}
          </section>
        </div>
      )}
    </Page>
  );
}
