// Scenario model: what happens to lung-cancer diagnosis in a county when you change the pathway.
// Today vs. your scenario, computed from Finnish data with every assumption named.
// Sources (team data sheet ids): Z12, Z13, Z43, Z20, Z2, Z52, Z41, Z39, STUK 2024.
import { CAPACITY_CEILING } from "@/components/CountyMap";
import { comparatorFor, counties, national } from "@/lib/data";
import type { County } from "@/lib/types";

// ---------- inputs ----------
export const INTENSITY = [
  { id: "narrow", label: "Narrow", hint: "Only high-risk people with clear warning signs", factor: 0.7, reach: 0.4 },
  { id: "satakunta", label: "Satakunta-style", hint: "Long-term heavy smokers with symptoms — what Satakunta does", factor: 1, reach: 0.6 },
  { id: "broad", label: "Broader", hint: "Anyone with lung symptoms the GP is worried about", factor: 1.35, reach: 0.8 },
] as const;
export type IntensityId = (typeof INTENSITY)[number]["id"];

/** extra CT scans a week the county adds on purpose for this route */
export const CAPACITY_OPTIONS = [0, 2, 5, 10] as const;

export type Config = {
  slug: string;
  directCt: boolean;
  intensityId: IntensityId;
  addedScans: number;
  fastGp: boolean;
};

export const DEFAULT_CONFIG: Omit<Config, "slug"> = {
  directCt: true,
  intensityId: "satakunta",
  addedScans: 5,
  fastGp: false,
};

// ---------- Finnish facts the model stands on ----------
export const FACTS = {
  gpWaitToday: 14, // days to see a GP, Finland (Z12); other Nordics under 7
  gpWaitNordic: 7,
  gpToReferral: 14, // first GP visit → referral (Z13, Satakunta 2021–22)
  referralToDiagnosis: 55, // referral → diagnosis (Z13)
  ctResultSweden: national.swedenReferralToCtResultDays, // SVF budget, referral → imaging answer (Z41)
  workupShare: 0.5, // ASSUMPTION: half of the 55 days is work-up that still happens after a direct CT
  hrPer4Weeks: { low: 1.03, mid: 1.06, high: 1.08 }, // Hanna 2020 BMJ (Z43): surgery 1.06–1.08; lung surgery 1.06
  yearsLostPerPatient: 11.6, // Finnish Cancer Registry 2022 (Z20)
  ruledOutShare: national.dkRuledOutShare, // Danish fast-track: cancer ruled out (Z39)
};

export const selectable = counties
  .filter((c) => !c.tooSmall)
  .sort((a, b) => (a.needRank ?? 99) - (b.needRank ?? 99));

export const NATIONAL_CT_WEEK = national.thoraxCt2024 / 52;

export function intensityOf(id: IntensityId) {
  return INTENSITY.find((i) => i.id === id) ?? INTENSITY[1];
}

export function slotsFor(c: County, id: IntensityId, on = true) {
  return on ? Math.round(c.ctPerWeekEst * intensityOf(id).factor * 10) / 10 : 0;
}

export function pathwaysFor(c: County, id: IntensityId, on = true) {
  return on ? Math.round(c.pathwaysPerYearEst * intensityOf(id).factor) : 0;
}

/** days until the CT result once the GP has ordered it — grows when added scans don't cover demand */
export function ctWait(demand: number, added: number) {
  if (demand <= 0) return FACTS.ctResultSweden;
  const shortfall = Math.max(0, 1 - added / demand);
  return Math.round(FACTS.ctResultSweden + 35 * shortfall);
}

export type Stage = { key: string; label: string; days: number; tip: string };

export function simulate(county: County, cfg: Config) {
  const it = intensityOf(cfg.intensityId);
  const demand = slotsFor(county, cfg.intensityId, cfg.directCt);
  const wait = cfg.directCt ? ctWait(demand, cfg.addedScans) : 0;
  const gpWait = cfg.fastGp ? FACTS.gpWaitNordic : FACTS.gpWaitToday;
  const workup = Math.round(FACTS.referralToDiagnosis * FACTS.workupShare);

  const today: Stage[] = [
    { key: "gp", label: "Wait for a GP", days: FACTS.gpWaitToday, tip: "gpWait" },
    { key: "ref", label: "GP visits → referral", days: FACTS.gpToReferral, tip: "gpToReferral" },
    { key: "spec", label: "Specialist, CT, diagnosis", days: FACTS.referralToDiagnosis, tip: "referralToDiagnosis" },
  ];
  const scenario: Stage[] = cfg.directCt
    ? [
        { key: "gp", label: "Wait for a GP", days: gpWait, tip: "gpWait" },
        { key: "ct", label: "GP orders CT → result", days: wait, tip: "ctWait" },
        { key: "spec", label: "Specialist work-up, diagnosis", days: workup, tip: "workup" },
      ]
    : [
        { key: "gp", label: "Wait for a GP", days: gpWait, tip: "gpWait" },
        { key: "ref", label: "GP visits → referral", days: FACTS.gpToReferral, tip: "gpToReferral" },
        { key: "spec", label: "Specialist, CT, diagnosis", days: FACTS.referralToDiagnosis, tip: "referralToDiagnosis" },
      ];
  const daysToday = today.reduce((a, s) => a + s.days, 0);
  const daysScenario = scenario.reduce((a, s) => a + s.days, 0);

  // who is reached: patients on the new route get the full saving; everyone else only the faster GP
  const reach = cfg.directCt ? it.reach : 0;
  const savedRoute = daysToday - daysScenario;
  const savedOthers = FACTS.gpWaitToday - gpWait;
  const deathsRoute = county.deathsPerYear * reach;
  const deathsOthers = county.deathsPerYear * (1 - reach);

  const lives = (hr: number) => {
    const cut = (days: number) => 1 - Math.pow(hr, -days / 28);
    return deathsRoute * cut(savedRoute) + deathsOthers * cut(savedOthers);
  };
  const livesYear = {
    low: lives(FACTS.hrPer4Weeks.low),
    mid: lives(FACTS.hrPer4Weeks.mid),
    high: lives(FACTS.hrPer4Weeks.high),
  };

  return {
    county,
    comparator: comparatorFor(county),
    today,
    scenario,
    daysToday,
    daysScenario,
    savedRoute,
    savedOthers,
    reach,
    demand,
    wait,
    peopleScanned: pathwaysFor(county, cfg.intensityId, cfg.directCt),
    cancersRoute: county.casesPerYearEst * reach,
    cancersAll: county.casesPerYearEst,
    livesYear,
    lifeYears: {
      low: livesYear.low * FACTS.yearsLostPerPatient,
      mid: livesYear.mid * FACTS.yearsLostPerPatient,
      high: livesYear.high * FACTS.yearsLostPerPatient,
    },
    coping: !cfg.directCt
      ? ("none" as const)
      : cfg.addedScans >= demand
        ? ("ok" as const)
        : ("queue" as const),
    nationalShare: (demand / NATIONAL_CT_WEEK) * 100,
  };
}

/**
 * The same choices run in every county — "if all of Finland did this". Each county covers the
 * same share of its own CT demand as the user's county does with the scans they added.
 */
export function simulateAll(cfg: Config) {
  const here = selectable.find((c) => c.slug === cfg.slug) ?? selectable[0];
  const hereDemand = slotsFor(here, cfg.intensityId, cfg.directCt);
  const coverage = hereDemand > 0 ? Math.min(1, cfg.addedScans / hereDemand) : 1;
  return selectable.map((c) => {
    const demand = slotsFor(c, cfg.intensityId, cfg.directCt);
    return { c, sim: simulate(c, { ...cfg, slug: c.slug, addedScans: demand * coverage }) };
  });
}

// ---------- reference values for explainers ----------
const POP = selectable.reduce((a, c) => a + c.population, 0);
const weighted = (k: "lcMortality" | "copdPer100k" | "per100") =>
  selectable.reduce((a, c) => a + c[k] * c.population, 0) / POP;
export const FI_AVG = {
  lcMortality: weighted("lcMortality"),
  copdPer100k: weighted("copdPer100k"),
  targeted: national.targetedAccessNationalAvg,
  slots: selectable.reduce((a, c) => a + c.ctPerWeekEst, 0) / selectable.length,
};

/** "2–3" style range for a fractional count, so people read it as whole patients. */
export function peopleRange(v: number) {
  if (v < 1) return "less than 1";
  return Number.isInteger(v) ? `${v}` : `${Math.floor(v)}–${Math.ceil(v)}`;
}

// ---------- sources shown in "How we calculated" ----------
export const MODEL_SOURCES = [
  { id: "Z12", what: "Waiting 14 days to see a GP in Finland; under 7 in other Nordic countries", title: "Miksi Suomessa keuhkosyöpään kuollaan aiemmin kuin Pohjoismaissa? (University of Helsinki)", url: "https://www.helsinki.fi/fi/uutiset/terveys/miksi-suomessa-keuhkosyopaan-kuollaan-aiemmin-kuin-pohjoismaissa" },
  { id: "Z13", what: "14 days from first GP visit to referral, 55 days from referral to diagnosis (Satakunta 2021–22)", title: "Keuhkosyövän diagnostinen viive Satakunnassa (University of Turku, 2025)", url: "https://www.utupub.fi/handle/10024/180618" },
  { id: "Z43", what: "Each 4 weeks of delay raises the risk of death by 6–8% (cancer surgery); lung surgery 1.06", title: "Hanna et al. 2020, Mortality due to cancer treatment delay, BMJ", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7610021/" },
  { id: "Z20", what: "11.6 years of life lost per lung-cancer patient", title: "Finnish Cancer Registry annual report 2022", url: "https://www.sttinfo.fi/files/69820264/70275300/98389/fi" },
  { id: "Z2", what: "Lung-cancer deaths per county per year, 2021–2024", title: "Statistics Finland, causes of death", url: "https://pxdata.stat.fi/PxWeb/pxweb/fi/StatFin/StatFin__ksyyt/" },
  { id: "Z52", what: "5-year survival: Finland 17.9%, Sweden 31.3% (men)", title: "NORDCAN 2.0", url: "https://nordcan.iarc.fr/" },
  { id: "Z41", what: "Sweden: 7 days from referral to the chest-scan answer", title: "Ledtider standardiserat vårdförlopp lungcancer (Sweden)", url: "https://vardgivare.regionkalmar.se/globalassets/vard-och-behandling/cancersjukdomar/ledtider_svf_20180123-uppdaterad.pdf" },
  { id: "STUK", what: "Finland did 35,058 chest CT scans in 2024 (≈ 674 a week)", title: "STUK radiological examinations 2024", url: "https://stuk.fi/avoin-data" },
] as const;

export const ASSUMPTIONS = [
  "Who qualifies decides how many of the county’s lung cancers come through the new route: narrow 40%, Satakunta-style 60%, broader 80%.",
  "With a direct CT, half of today’s 55 days from referral to diagnosis still remains (specialist tests after a suspicious scan). The other half — waiting for the specialist to order the CT — disappears.",
  "If the county adds fewer scans than the route needs, patients queue: the CT result slips from 7 days up to 42 days with no added scans.",
  "Lives: the delay–mortality link measured for treatment (Hanna 2020) is applied to the diagnosis delay. We show a cautious (1.03), central (1.06) and optimistic (1.08) version.",
];

export { CAPACITY_CEILING };
