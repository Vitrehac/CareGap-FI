// Plain-language explainers for every number and unit. Written for people who know nothing about
// cancer care. Comparisons use only figures we hold (Finnish data, Nordic benchmarks).
import type { ReactNode } from "react";
import { CAPACITY_CEILING } from "@/components/CountyMap";
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
        Days from asking for an appointment to actually seeing a family doctor. Finland: about {FACTS.gpWaitToday} days; other
        Nordic countries: under {FACTS.gpWaitNordic}. In this scenario: <B>{days} days</B>.
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
        From the moment a person with lung symptoms asks for a doctor to the moment they know it is cancer. Today about{" "}
        {today} days; with your changes {scen}. <B>{saved} days sooner</B> = treatment can start {Math.round(saved / 7)} weeks
        earlier, while the tumour is smaller.
      </>
    ),
  }),
  lives: (low: number, mid: number, high: number, county: string): Tip => ({
    title: "Deaths avoided a year",
    body: (
      <>
        Our estimate of how many people in {county} each year would <B>not</B> die of lung cancer because they were diagnosed
        sooner. Range {n1(low)}–{n1(high)}, most likely ≈ {n1(mid)}. Based on Hanna 2020 (BMJ): every 4 weeks of delay raises
        the risk of death by about 6%. It is a model, not a promise.
      </>
    ),
  }),
  lifeYears: (mid: number): Tip => ({
    title: "Years of life gained",
    body: (
      <>
        Each lung-cancer death in Finland takes on average {FACTS.yearsLostPerPatient} years of life (Finnish Cancer Registry).
        Deaths avoided × {FACTS.yearsLostPerPatient} ≈ <B>{n0(mid)} years</B> of life a year.
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
  safeLimit: (): Tip => ({
    title: `Rule of thumb · ${CAPACITY_CEILING} a week`,
    body: <>Our planning assumption: one county can usually free up to {CAPACITY_CEILING} extra scans a week without new machines.</>,
  }),
  national: (lives: number, years: number): Tip => ({
    title: "If all of Finland did it",
    body: (
      <>
        The same choices run in all 22 wellbeing-services counties, each covering its own CT demand the way you did. About{" "}
        <B>{n0(lives)} deaths avoided a year</B> and {n0(years)} years of life — out of ≈ 2,300 lung-cancer deaths a year in
        Finland.
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
