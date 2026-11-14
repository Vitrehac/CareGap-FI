// Turns a strategic plan into numbers: what the county can afford, what it buys, whether it is worth it,
// and (from the data feed) how it is actually going. Pure functions, no React.
// Every step of the calculation is also returned as `steps`, with its source, so the UI can show its working.
import { getCounty, counties, national } from "@/lib/data";
import { FACTS, MODEL_SOURCES, type Stage } from "@/components/pilot/model";

// Outcome assumptions live here, not in the process model (components/pilot/model.ts measures times only).
const OUTCOME = {
  hrPer4Weeks: { low: 1.03, mid: 1.06, high: 1.08 }, // Hanna 2020 BMJ (Z43): surgery 1.06–1.08; lung surgery 1.06
  yearsLostPerPatient: 11.6, // Finnish Cancer Registry 2022 (Z20)
};
const OUTCOME_SOURCES = [
  { id: "Z43", title: "Hanna et al. 2020, Mortality due to cancer treatment delay, BMJ", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7610021/" },
  { id: "Z20", title: "Finnish Cancer Registry annual report 2022", url: "https://www.sttinfo.fi/files/69820264/70275300/98389/fi" },
];
import type { Investment, PathwayRecord, Plan } from "@/lib/plans";

export const TODAY = "2026-11-14";
const FI_POP = counties.reduce((a, c) => a + c.population, 0);

export const ASSUMED = {
  radiologistMinPerCt: 15, // ESTIMATE
  gpDoctorsFiForSevenDays: { low: 672, high: 1800 }, // HE bill / THL 2023
  protocolEuro: 10_000, // ESTIMATE: referral criteria + order set in the patient record system
  trainingEuro: 15_000, // ESTIMATE: one training round for the county's family doctors
  /** ASSUMPTION: share of lung cancers that start with a GP visit for symptoms (the rest are found in hospital) */
  maxRouteShare: 0.8,
  /** yardstick for "worth it": NICE £20–30k per healthy life-year ≈ €24–36k */
  worthPerLifeYear: 35_000,
  borderlinePerLifeYear: 100_000,
};

export const CT_RESULT_DAYS = FACTS.ctResultSweden; // reserved slots → answer within a week (Sweden's target)
const WORKUP = Math.round(FACTS.referralToDiagnosis * FACTS.workupShare.mid);
const PER_CANCER = national.pathwaysPerConfirmedCancer; // people scanned to find one cancer

export type Limiter = "covered" | "scanners" | "radiologists" | "funding";

export const LIMITER_TEXT: Record<Limiter, string> = {
  covered: "Your resources cover the scans you asked for",
  scanners: "Scanner time is the bottleneck",
  radiologists: "Radiologist time is the bottleneck",
  funding: "Funding is the bottleneck",
};

export const money = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `€${(v / 1_000_000).toLocaleString("en-GB", { maximumFractionDigits: 1 })}M`;
  if (a >= 1000) return `€${Math.round(v / 1000).toLocaleString("en-GB")}k`;
  return `€${Math.round(v).toLocaleString("en-GB")}`;
};
export const num = (v: number, d = 1) => v.toLocaleString("en-GB", { maximumFractionDigits: d });
const pct = (v: number) => `${num(v * 100)}%`;

/** scans a week beyond which there are no more lung cancers to find on the GP route */
export function usefulScans(slug: string) {
  const c = getCounty(slug);
  return (c.casesPerYearEst * ASSUMED.maxRouteShare * PER_CANCER) / 52;
}

/** auto line items, recomputed from the inputs; user-entered actuals/suppliers/status are kept */
export function syncInvestments(plan: Plan, scansPerWeek: number): Investment[] {
  const want: Investment[] = [
    { id: "auto-ct", auto: "ct-time", name: "Reserved chest-CT time (scanner, radiographer, radiologist report)", kind: "yearly", estimate: Math.round(scansPerWeek * 52 * plan.costs.ctEuro), status: "planned", note: `${num(scansPerWeek)} scans a week × 52 × ${money(plan.costs.ctEuro)}` },
    { id: "auto-protocol", auto: "protocol", name: "Referral criteria + CT order set in the patient record system", kind: "one-off", estimate: ASSUMED.protocolEuro, status: "planned", note: "Estimate" },
    { id: "auto-training", auto: "training", name: "Training family doctors on the new referral", kind: "one-off", estimate: ASSUMED.trainingEuro, status: "planned", note: "Estimate" },
  ];
  if (plan.inputs.newScanners > 0)
    want.push({ id: "auto-scanner", auto: "scanner", name: `New CT scanner${plan.inputs.newScanners > 1 ? ` × ${plan.inputs.newScanners}` : ""}`, kind: "one-off", estimate: plan.inputs.newScanners * plan.costs.scannerEuro, status: "planned", note: "Estimate — ask suppliers for a quote and enter it as the actual price" });
  const kept = new Map(plan.investments.map((i) => [i.id, i]));
  const auto = want.map((w) => {
    const k = kept.get(w.id);
    return k ? { ...w, actual: k.actual, supplier: k.supplier, status: k.status } : w;
  });
  const custom = plan.investments.filter((i) => !i.auto);
  return [...auto, ...custom];
}

const cost = (i: Investment) => i.actual ?? i.estimate;
const cut = (hr: number, days: number) => 1 - Math.pow(hr, -Math.max(0, days) / 28);
const src = (id: string): { title: string; url: string } | undefined => MODEL_SOURCES.find((s) => s.id === id) ?? OUTCOME_SOURCES.find((s) => s.id === id);

export type Step = { label: string; value: string; how: string; source?: { title: string; url: string } };

export function evaluate(plan: Plan) {
  const county = getCounty(plan.inputs.slug);
  const I = plan.inputs;
  const customYearly = plan.investments.filter((i) => !i.auto && i.kind === "yearly").reduce((a, i) => a + cost(i), 0);

  // ---- what the county can actually run
  const caps = {
    scanners: I.spareCtSlots + I.newScanners * plan.costs.slotsPerScanner,
    radiologists: I.radiologistHours / (ASSUMED.radiologistMinPerCt / 60),
    funding: Math.max(0, I.yearlyFunding - customYearly) / plan.costs.ctEuro / 52,
  };
  const wanted = Math.max(0, I.scansPerWeek);
  const minCap = Math.min(caps.scanners, caps.radiologists, caps.funding);
  const scans = Math.min(wanted, minCap);
  const limiter: Limiter = minCap >= wanted ? "covered" : caps.funding === minCap ? "funding" : caps.scanners === minCap ? "scanners" : "radiologists";
  const useful = usefulScans(county.slug);
  const effective = Math.min(scans, useful);

  // ---- who it reaches
  const peopleScannedYear = scans * 52;
  const cancersRoute = (effective * 52) / PER_CANCER;
  const reach = county.casesPerYearEst > 0 ? cancersRoute / county.casesPerYearEst : 0;
  const deathRisk = county.deathsPerYear / county.casesPerYearEst; // share of diagnosed patients who die of it

  // ---- GP growth (budgeted elsewhere)
  const share = county.population / FI_POP;
  const gpNeeded = share * ((ASSUMED.gpDoctorsFiForSevenDays.low + ASSUMED.gpDoctorsFiForSevenDays.high) / 2);
  const gpWait = Math.round(FACTS.gpWaitToday - (FACTS.gpWaitToday - FACTS.gpWaitNordic) * Math.min(1, I.newGps / gpNeeded));

  // ---- time
  const today: Stage[] = [
    { key: "gp", label: "Wait for a GP", days: FACTS.gpWaitToday, tip: "" },
    { key: "ref", label: "GP visits → referral", days: FACTS.gpToReferral, tip: "" },
    { key: "spec", label: "Specialist, CT, diagnosis", days: FACTS.referralToDiagnosis, tip: "" },
  ];
  const daysToday = today.reduce((a, s) => a + s.days, 0);
  const route: Stage[] = [
    { key: "gp", label: "Wait for a GP", days: gpWait, tip: "" },
    { key: "ct", label: "GP orders CT → result", days: CT_RESULT_DAYS, tip: "" },
    { key: "spec", label: "Specialist work-up, diagnosis", days: WORKUP, tip: "" },
  ];
  const daysRoute = route.reduce((a, s) => a + s.days, 0);
  const savedRoute = daysToday - daysRoute;
  const savedOthers = FACTS.gpWaitToday - gpWait;
  const savedRouteProgramme = daysToday - (FACTS.gpWaitToday + CT_RESULT_DAYS + WORKUP);

  // ---- lives (programme = the CT route alone; GP growth reported separately)
  const deathsRoute = cancersRoute * deathRisk;
  const deathsOthers = county.deathsPerYear - deathsRoute;
  const livesAt = (hr: number) => deathsRoute * cut(hr, savedRoute) + deathsOthers * cut(hr, savedOthers);
  const H_ = OUTCOME.hrPer4Weeks;
  const livesYear = { low: livesAt(H_.low), mid: livesAt(H_.mid), high: livesAt(H_.high) };
  const programmeYear = { low: deathsRoute * cut(H_.low, savedRouteProgramme), mid: deathsRoute * cut(H_.mid, savedRouteProgramme), high: deathsRoute * cut(H_.high, savedRouteProgramme) };
  const gpYear = livesYear.mid - programmeYear.mid;
  const L = OUTCOME.yearsLostPerPatient;

  // ---- money
  const investments = syncInvestments(plan, scans);
  const oneOff = investments.filter((i) => i.kind === "one-off").reduce((a, i) => a + cost(i), 0);
  const yearly = investments.filter((i) => i.kind === "yearly").reduce((a, i) => a + cost(i), 0);
  const H = I.horizonYears;
  const total = oneOff + yearly * H;
  const effectiveYears = Math.max(0, H - 0.5); // first year runs at half speed while the route starts up
  const lives = programmeYear.mid * effectiveYears;
  const lifeYears = lives * L;
  const perLife = lives > 0.05 ? total / lives : Infinity;
  const perLifeYear = lifeYears > 0.1 ? total / lifeYears : Infinity;
  const perPatient = peopleScannedYear > 0 ? yearly / peopleScannedYear : Infinity;
  const verdict = lives < 0.05 ? "none" : perLifeYear <= ASSUMED.worthPerLifeYear ? "worth" : perLifeYear <= ASSUMED.borderlinePerLifeYear ? "borderline" : "poor";

  const timeline = Array.from({ length: H + 1 }, (_, y) => ({
    year: y,
    lives: programmeYear.mid * Math.max(0, y - (y > 0 ? 0.5 : 0)),
    cost: y === 0 ? 0 : oneOff + yearly * y,
  }));

  // ---- the working, step by step
  const steps: Step[] = [
    { label: "Lung-cancer deaths a year", value: num(county.deathsPerYear, 0), how: `${county.deathsPooled} deaths in ${county.name} 2021–2024 ÷ 4 years`, source: src("Z2") },
    { label: "New lung cancers a year", value: num(county.casesPerYearEst, 0), how: `deaths × ${national.incidenceMortalityRatio} (Finland: ${national.incidencePooled.toLocaleString("en-GB")} new cases for ${national.mortalityPooled.toLocaleString("en-GB")} deaths, same years)`, source: src("Z52") },
    { label: "People scanned to find one cancer", value: num(PER_CANCER, 2), how: `in Denmark's fast track ${pct(national.dkRuledOutShare)} of people referred turn out not to have cancer → 1 ÷ ${num(1 - national.dkRuledOutShare, 2)}`, source: { title: "Sundhedsstyrelsen, cancer pathway annual report 2025 (lung cancer, B26)", url: "https://www.sst.dk/" } },
    { label: "People scanned a year", value: num(peopleScannedYear, 0), how: `${num(scans)} scans a week × 52${scans < wanted ? ` (you asked for ${num(wanted)}; ${LIMITER_TEXT[limiter].toLowerCase()})` : ""}` },
    { label: "Lung cancers found on the fast route", value: num(cancersRoute), how: `${num(effective * 52, 0)} people ÷ ${num(PER_CANCER, 2)}${scans > useful ? ` — capped: only ≈ ${pct(ASSUMED.maxRouteShare)} of cancers start with a GP visit, so scans above ${num(useful)} a week find no extra cancers` : ""} = ${pct(reach)} of the county's cancers` },
    { label: "Days to diagnosis today", value: `${daysToday} days`, how: `${FACTS.gpWaitToday} days to see a GP + ${FACTS.gpToReferral} days GP → referral + ${FACTS.referralToDiagnosis} days referral → diagnosis`, source: src("Z13") },
    { label: "Days on the fast route", value: `${daysRoute} days`, how: `${gpWait} days to see a GP + ${CT_RESULT_DAYS} days CT result (Sweden's target) + ${WORKUP} days specialist work-up (half of today's 55; unknown, plausible range ${Math.round(FACTS.referralToDiagnosis * FACTS.workupShare.low)}–${Math.round(FACTS.referralToDiagnosis * FACTS.workupShare.high)} — the pilot measures it)`, source: src("Z41") },
    { label: "Lower risk of dying", value: pct(cut(H_.mid, savedRouteProgramme)), how: `every 4 weeks of delay raises the risk of death by ≈ 6% (range 3–8%) → 1 − 1.06^(−${savedRouteProgramme} ÷ 28)`, source: src("Z43") },
    { label: "Of the fast-route patients, deaths expected today", value: num(deathsRoute), how: `${num(cancersRoute)} cancers × ${pct(deathRisk)} (deaths ÷ new cases in ${county.name})` },
    { label: "Deaths avoided a year (the CT route)", value: num(programmeYear.mid), how: `${num(deathsRoute)} × ${pct(cut(H_.mid, savedRouteProgramme))} · range ${num(programmeYear.low)}–${num(programmeYear.high)}` },
    ...(gpYear > 0.05 ? [{ label: "Plus: from the new family doctors", value: num(gpYear), how: `GP wait ${FACTS.gpWaitToday} → ${gpWait} days for every lung-cancer patient (not counted in the cost per life — the doctors are budgeted elsewhere)`, source: src("Z12") }] : []),
    { label: "Years of life gained a year", value: num(livesYear.mid * L, 0), how: `deaths avoided × ${L} years lost per lung-cancer death`, source: src("Z20") },
  ];

  return {
    county,
    caps,
    wanted,
    scans,
    useful,
    limiter,
    gpWait,
    gpNeeded,
    peopleScannedYear,
    ruledOutYear: Math.max(0, peopleScannedYear - cancersRoute),
    waitingDaysSavedYear: peopleScannedYear * savedRoute,
    sim: {
      today,
      scenario: route,
      daysToday,
      daysScenario: reach > 0 ? daysRoute : daysToday - savedOthers,
      wait: CT_RESULT_DAYS,
      reach,
      cancersRoute,
      cancersAll: county.casesPerYearEst,
      savedRoute,
      savedOthers,
      livesYear,
      lifeYears: { low: livesYear.low * L, mid: livesYear.mid * L, high: livesYear.high * L },
    },
    programmeYear,
    gpYear,
    investments,
    oneOff,
    yearly,
    total,
    lives,
    lifeYears,
    perLife,
    perLifeYear,
    perPatient,
    verdict: verdict as "none" | "worth" | "borderline" | "poor",
    shareOfDeaths: livesYear.mid / county.deathsPerYear,
    overBudget: { yearly: yearly > I.yearlyFunding + 1, oneOff: oneOff > I.oneOffBudget + 1 },
    timeline,
    steps,
  };
}
export type Evaluation = ReturnType<typeof evaluate>;

export const VERDICT = {
  worth: { label: "Worth it", tone: "good", text: "A year of life costs less than health systems usually pay for one." },
  borderline: { label: "Borderline", tone: "warn", text: "A year of life costs more than the usual yardstick, but within reach." },
  poor: { label: "Poor value", tone: "bad", text: "A year of life costs far more than the usual yardstick." },
  none: { label: "No effect yet", tone: "bad", text: "With these inputs nobody is scanned sooner." },
} as const;

// ---------- the data feed: how it is actually going ----------
// Until a real source is connected, a deterministic demo feed stands in (clearly labelled in the UI).

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const addDays = (iso: string, d: number) => {
  const t = new Date(iso + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + Math.round(d));
  return t.toISOString().slice(0, 10);
};
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
const monthKey = (iso: string) => iso.slice(0, 7);

export function monthsSince(start: string, today = TODAY) {
  const out: string[] = [];
  const [y0, m0] = start.split("-").map(Number);
  const [y1, m1] = today.split("-").map(Number);
  for (let y = y0, m = m0; y < y1 || (y === y1 && m <= m1); m === 12 ? (y++, (m = 1)) : m++) out.push(`${y}-${String(m).padStart(2, "0")}`);
  return out;
}

export function demoFeed(plan: Plan, ev: Evaluation): PathwayRecord[] {
  const r = rng(plan.id + plan.inputs.slug + Math.round(ev.scans));
  const months = monthsSince(plan.inputs.start);
  const perMonth = ev.peopleScannedYear / 12;
  const cancerShare = ev.sim.cancersRoute / Math.max(1, ev.peopleScannedYear);
  const out: PathwayRecord[] = [];
  months.forEach((m, k) => {
    const ramp = Math.min(1, (k + 1) / 4);
    const n = Math.round(perMonth * ramp * (0.8 + r() * 0.4));
    for (let i = 0; i < n; i++) {
      const visit = addDays(`${m}-01`, r() * 27);
      if (visit > TODAY) continue;
      // early months run slower than planned; the route settles in over ~6 months
      const drag = 1 + 0.6 * Math.max(0, 1 - k / 6);
      const ctOrdered = addDays(visit, r() * 2);
      const ctResult = addDays(ctOrdered, ev.sim.wait * drag * (0.7 + r() * 0.6));
      const isCancer = r() < cancerShare;
      const workup = WORKUP;
      const diagnosis = isCancer ? addDays(ctResult, workup * drag * (0.7 + r() * 0.6)) : undefined;
      const open = (diagnosis ?? ctResult) > TODAY;
      out.push({
        id: `P-${m.replace("-", "")}-${String(i + 1).padStart(3, "0")}`,
        gpVisit: visit,
        ctOrdered: ctOrdered > TODAY ? undefined : ctOrdered,
        ctResult: ctResult > TODAY ? undefined : ctResult,
        diagnosis: diagnosis && diagnosis <= TODAY ? diagnosis : undefined,
        outcome: open ? "open" : isCancer ? "cancer" : "ruled-out",
        source: "feed",
      });
    }
  });
  return out;
}

/** monthly comparison: no plan vs plan estimate vs what the records show */
export function actuals(plan: Plan, ev: Evaluation, records: PathwayRecord[]) {
  const months = monthsSince(plan.inputs.start);
  const deathRisk = ev.county.deathsPerYear / ev.county.casesPerYearEst;
  const cutMid = (days: number) => cut(OUTCOME.hrPer4Weeks.mid, days);
  const baseDays = ev.sim.daysToday;
  let cumEst = 0;
  let cumAct = 0;
  let cumSpendEst = 0;
  let cumSpendAct = 0;
  const oneOffPaid = ev.investments.filter((i) => i.kind === "one-off" && i.status === "paid").reduce((a, i) => a + (i.actual ?? i.estimate), 0);
  // like-for-like: for the cancers actually diagnosed so far, what the plan expected vs what their real
  // speed implies. The GP-wait gain for patients outside the route is not observable here.
  const rows = months.map((m, k) => {
    const ramp = Math.min(1, (k + 1) / 4);
    const mine = records.filter((p) => monthKey(p.gpVisit) === m);
    const cancers = mine.filter((p) => p.outcome === "cancer" && p.diagnosis);
    // patient-reported booking wait is not in the record: we add the county's GP wait to visit → diagnosis
    const days = cancers.map((p) => ev.gpWait + daysBetween(p.gpVisit, p.diagnosis!)).sort((a, b) => a - b);
    const median = days.length ? days[Math.floor(days.length / 2)] : null;
    const estLives = days.length * deathRisk * cutMid(ev.sim.savedRoute);
    const actLives = days.reduce((a, d) => a + deathRisk * cutMid(baseDays - d), 0);
    cumEst += estLives;
    cumAct += actLives;
    cumSpendEst += (ev.yearly / 12) * ramp + (k === 0 ? ev.oneOff : 0);
    cumSpendAct += mine.filter((p) => p.ctOrdered).length * plan.costs.ctEuro + (k === 0 ? oneOffPaid : 0);
    return {
      month: m,
      referred: mine.length,
      cancers: cancers.length,
      ruledOut: mine.filter((p) => p.outcome === "ruled-out").length,
      medianDays: median,
      targetDays: ev.sim.daysToday - ev.sim.savedRoute,
      baseDays,
      cumEst,
      cumAct,
      cumSpendEst,
      cumSpendAct,
    };
  });
  const allDays = rows.filter((r) => r.medianDays !== null);
  const recent = allDays.slice(-3);
  const recentMedian = recent.length ? Math.round(recent.reduce((a, r) => a + (r.medianDays as number), 0) / recent.length) : null;
  return {
    rows,
    referred: records.length,
    cancers: records.filter((p) => p.outcome === "cancer").length,
    ruledOut: records.filter((p) => p.outcome === "ruled-out").length,
    open: records.filter((p) => p.outcome === "open").length,
    recentMedian,
    livesEst: cumEst,
    livesAct: cumAct,
    spendEst: cumSpendEst,
    spendAct: cumSpendAct,
  };
}
