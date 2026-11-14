// Plain-language explainers for every number and unit. Written for people who know nothing about
// cancer care. Comparisons use only figures we hold (Finnish data, Nordic benchmarks).
import type { ReactNode } from "react";
import { FACTS, NATIONAL_CT_WEEK, peopleRange } from "./model";

const n0 = (v: number) => Math.round(v).toLocaleString("en-GB");
const n1 = (v: number) => v.toLocaleString("en-GB", { maximumFractionDigits: 1 });

export type Tip = { title: string; body: ReactNode };
const B = ({ children }: { children: ReactNode }) => <b className="text-ink">{children}</b>;

export const explain = {
  // ---- the pathway stages ----
  gpWait: (days: number): Tip => ({
    title: "Wait for a GP",
    body: (
      <>
        Days from asking for an appointment to seeing a family doctor. A Helsinki news piece puts Finland at about {FACTS.gpWaitToday} days and the other Nordics under {FACTS.gpWaitNordic} (Z12). In this scenario: <B>{days} days</B>.
      </>
    ),
  }),
  gpToReferral: (): Tip => ({
    title: "GP visits → referral",
    body: (
      <>
        Today the GP usually can’t order a lung CT. It often takes more than one visit (and a normal X-ray) before they send the
        patient to a hospital specialist. Measured in Satakunta: <B>{FACTS.gpToReferral} days</B>.
      </>
    ),
  }),
  referralToDiagnosis: (): Tip => ({
    title: "Specialist, CT, diagnosis",
    body: (
      <>
        After the referral the patient waits for the specialist, who then orders the CT and further tests until cancer is
        confirmed. Measured in Satakunta: <B>{FACTS.referralToDiagnosis} days</B>.
      </>
    ),
  }),
  ctWait: (days: number, coping: string): Tip => ({
    title: "GP orders CT → result",
    body: (
      <>
        The GP orders the CT scan directly. If the hospital has room, the result comes in about {FACTS.ctResultSweden} days —
        Sweden’s goal. {coping === "queue" ? <>You added too few scans, so patients queue: <B>{days} days</B>.</> : <>In this scenario: <B>{days} days</B>.</>}
      </>
    ),
  }),
  workup: (days: number): Tip => ({
    title: "Specialist work-up",
    body: (
      <>
        A suspicious scan still needs a specialist and more tests (like a biopsy) before the diagnosis. We assume this takes
        half of today’s {FACTS.referralToDiagnosis} days: <B>{days} days</B>. The other half was waiting for the CT itself.
      </>
    ),
  }),

  // ---- results ----
  daysSooner: (saved: number, today: number, scen: number): Tip => ({
    title: "Diagnosed sooner",
    body: (
      <>
        Days from the first symptomatic primary-care visit to a CT report, in this model. Today about {today} days; in the pilot about {scen}. <B>{saved} days sooner</B> on the central assumption.
      </>
    ),
  }),
  peopleScanned: (v: number): Tip => ({
    title: "People scanned a year",
    body: (
      <>
        People whose GP orders a chest CT through the new route — about {n0(v)} a year. <B>Most will not have cancer</B>; the
        scan rules it out fast. In Danish fast-track lung checks about {Math.round(FACTS.ruledOutShare * 100)}% end with cancer
        ruled out — that peace of mind is a benefit too.
      </>
    ),
  }),
  cancersRoute: (v: number, all: number, reach: number): Tip => ({
    title: "Lung cancers found faster",
    body: (
      <>
        The county has about {n0(all)} new lung cancers a year. With your rules about {Math.round(reach * 100)}% of them would come
        through the new, faster route: <B>≈ {n0(v)} people a year</B>.
      </>
    ),
  }),
  scansWeek: (v: number, county: string): Tip => ({
    title: "CT scans needed a week",
    body: (
      <>
        Extra chest CT scans {county}’s hospital must do each week for this route. One scan = one person, so {n1(v)} ≈{" "}
        <B>{peopleRange(v)} people a week</B>. For scale: all of Finland does ≈ {n0(NATIONAL_CT_WEEK)} chest CTs a week.
      </>
    ),
  }),
  scansAdded: (added: number, need: number): Tip => ({
    title: "CT scans you add",
    body: (
      <>
        Scanner and radiologist time the county reserves for this route each week: <B>{n1(added)}</B>. It needs {n1(need)}.{" "}
        {added >= need ? "Enough — results stay fast." : "Not enough — patients queue and the CT result comes later."}
      </>
    ),
  }),
  coping: (coping: string): Tip => ({
    title: "Can the hospital cope?",
    body:
      coping === "ok" ? (
        <>Yes. The scans you added cover the new demand, so nobody else waits longer.</>
      ) : coping === "queue" ? (
        <>Not fully. The new patients need more scans than you added, so they queue and some benefit is lost. Add scans in the chart.</>
      ) : (
        <>Direct CT is off, so there is no extra work.</>
      ),
  }),
  national: (counties: number): Tip => ({
    title: "Every county, same rules",
    body: (
      <>
        The same eligibility and scan reservation, run separately in {counties} wellbeing-services counties. Ranked by how many extra scans a week the route needs. Smaller demand is an easier first pilot.
      </>
    ),
  }),
  comparator: (name: string): Tip => ({
    title: "Comparison county",
    body: <>{name} is a similar county that keeps today’s rules. If waits fall only in your county, the change caused it — this is how you prove the effect.</>,
  }),
  sweden: (): Tip => ({
    title: "Sweden",
    body: (
      <>
        Sweden lets the pathway skip the queue: {FACTS.ctResultSweden} days from referral to the chest-scan answer, and 31 of 100
        men are alive 5 years after lung cancer (Finland: 18).
      </>
    ),
  }),
  reachRule: (label: string, hint: string, reach: number, scans: number): Tip => ({
    title: `${label}`,
    body: (
      <>
        {hint}. Catches about <B>{Math.round(reach * 100)}% of the county’s lung cancers</B> through the fast route, but needs{" "}
        {n1(scans)} CT scans a week.
      </>
    ),
  }),
};
