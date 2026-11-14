"use client";

import Link from "next/link";
import { actuals, demoFeed, evaluate, money, num } from "@/lib/engine";
import { useHydrated, usePlans } from "@/lib/plans";
import { Card, Page, VerdictPill } from "./ui";

const fin = (x: number) => (Number.isFinite(x) ? money(x) : "—");

export function Compare() {
  const plans = usePlans();
  const ready = useHydrated();
  const rows = plans.map((p) => {
    const ev = evaluate(p);
    const a = actuals(p, ev, [...p.weeks, ...demoFeed(p, ev)]);
    return { p, ev, a };
  });

  return (
    <Page title="Compare plans" sub="Each plan uses its own county's budget, staff and scanners — so the numbers are only as good as the inputs each county entered.">
      <Card>
        {!ready ? (
          <p className="text-ink-faint">Loading…</p>
        ) : (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[60rem] text-sm">
              <thead>
                <tr className="text-left align-bottom text-ink-faint">
                  <th className="px-2 pb-3 font-semibold">Plan</th>
                  <th className="px-2 pb-3 text-right font-semibold">People scanned<br />a year</th>
                  <th className="px-2 pb-3 text-right font-semibold">On the fast<br />CT route</th>
                  <th className="px-2 pb-3 text-right font-semibold">Diagnosis<br />gap (days)</th>
                  <th className="px-2 pb-3 text-right font-semibold">Visit → CT<br />report (days)</th>
                  <th className="px-2 pb-3 text-right font-semibold">Programme cost a year<br />(whole county)</th>
                  <th className="px-2 pb-3 text-right font-semibold">Cost per<br />person scanned</th>
                  <th className="px-2 pb-3 text-right font-semibold">Cost per cancer<br />on the fast route</th>
                  <th className="px-2 pb-3 font-semibold">Value</th>
                  <th className="px-2 pb-3 font-semibold">Actual so far</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {rows.map(({ p, ev, a }) => {
                  const behind = a.recentMedian !== null && a.recentMedian > 10;
                  return (
                    <tr key={p.id}>
                      <td className="px-2 py-3">
                        <Link href={`/dashboard/plan/${p.id}`} className="font-semibold text-ink hover:text-accent">{p.name}</Link>
                        <p className="text-xs text-ink-faint">{ev.county.name} · {num(ev.scans)} scans/wk</p>
                      </td>
                      <td className="px-2 py-3 text-right font-semibold text-accent">{num(ev.peopleScannedYear, 0)}</td>
                      <td className="px-2 py-3 text-right text-ink">{num(ev.sim.cancersRoute)}</td>
                      <td className="px-2 py-3 text-right text-ink">{ev.sim.savedRoute}</td>
                      <td className="px-2 py-3 text-right text-ink">{ev.sim.visitToCt}</td>
                      <td className="px-2 py-3 text-right text-ink">{money(ev.yearly)}</td>
                      <td className="px-2 py-3 text-right text-ink">{fin(ev.perPatient)}</td>
                      <td className="px-2 py-3 text-right text-ink">{fin(ev.perCancer)}</td>
                      <td className="px-2 py-3"><VerdictPill v={ev.verdict} /></td>
                      <td className="px-2 py-3">
                        {a.recentMedian === null ? (
                          <span className="text-ink-faint">no data yet</span>
                        ) : (
                          <span className={behind ? "text-[#b13d29]" : "text-accent"}>
                            {behind ? "Behind" : "On track"} · {a.recentMedian} days
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          Costs are for the whole county programme. “Actual so far” is the median days from the GP visit to the CT report over the last three months of the weekly mock feed.
        </p>
      </Card>
    </Page>
  );
}
