"""Generate data/counties.json for the Next.js app.

Single source of truth: everything the UI shows about a county is computed here
from raw/ and written once, so the app never does arithmetic on stage and the
numbers can be re-derived by running this script.
"""
import csv
import json
import math
import re
from collections import defaultdict

YEARS_POOLED = 4
DK_RULED_OUT = 0.58  # Denmark: share of lung cancer pathways where cancer is ruled out

# Pooled 2021-2024, produced by scripts/targeted_access.py
COUNTIES = [
    # name,                 per100, deaths, lcMort, copd,  pop,    tooSmall
    ("Lapland",               18.2,   435,   61.7,  6121,  176182, False),
    ("Kainuu",                18.4,   163,   57.7,  8014,   70626, False),
    ("North Karelia",         18.7,   327,   50.2,  6873,  162697, False),
    ("South Savo",            19.2,   291,   55.6,  6212,  130734, False),
    ("East Uusimaa",          20.1,   204,   51.5,  4239,   98982, False),
    ("Päijät-Häme",           21.6,   454,   55.4,  4725,  204777, False),
    ("North Ostrobothnia",    22.5,   670,   40.2,  5660,  416714, False),
    ("West Uusimaa",          23.7,   708,   36.4,  3394,  487130, False),
    ("Central Finland",       25.7,   409,   37.5,  5634,  273044, False),
    ("Satakunta",             26.5,   490,   57.5,  3989,  213010, False),
    ("Kymenlaakso",           26.7,   401,   62.7,  4873,  159962, False),
    ("Central Ostrobothnia",  26.7,   101,   37.2,  5411,   67863, False),
    ("Central Uusimaa",       27.3,   297,   36.5,  4864,  203542, False),
    ("North Savo",            28.6,   377,   38.0,  6490,  248178, False),
    ("City of Helsinki",      30.7,   914,   34.2,  3168,  667311, False),
    ("South Ostrobothnia",    32.6,   341,   44.6,  5567,  191082, False),
    ("Pirkanmaa",             33.4,   770,   36.1,  4160,  533326, False),
    ("Vantaa and Kerava",     34.1,   340,   30.3,  3423,  281173, False),
    ("Kanta-Häme",            36.9,   344,   50.6,  5364,  169789, False),
    ("Southwest Finland",     39.7,   824,   42.3,  3861,  486692, False),
    ("Ostrobothnia",          42.6,   272,   38.5,  4055,  176842, False),
    ("South Karelia",         52.4,   227,   45.1,  5429,  125733, False),
    ("Åland",                 16.4,    61,   50.1,  3235,   30404, True),
]

# Counties that already run a direct primary-care chest CT route.
PRECEDENT = {"Satakunta"}


def slugify(name):
    s = name.lower()
    for a, b in (("ä", "a"), ("ö", "o"), ("å", "a"), ("é", "e")):
        s = s.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def z(vals):
    m = sum(vals) / len(vals)
    sd = math.sqrt(sum((v - m) ** 2 for v in vals) / len(vals))
    return [(v - m) / sd if sd else 0.0 for v in vals]


def national_im_ratio():
    inc, mor = defaultdict(float), defaultdict(float)
    with open("raw/nordcan.csv", encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f):
            if r["region_id"] != "FI" or r["group_id"] != "ALL":
                continue
            if r["year"] not in ("2021", "2022", "2023", "2024"):
                continue
            if r["indicator_id"] == "nordcan:incidence_cases":
                inc[r["year"]] += float(r["value"])
            elif r["indicator_id"] == "nordcan:mortality_cases":
                mor[r["year"]] += float(r["value"])
    return sum(inc.values()), sum(mor.values())


def map_paths():
    src = open("scripts/out/map_paths.ts", encoding="utf-8").read()
    return dict(re.findall(r'^\s*"([^"]+)":\s*"([^"]+)",$', src, re.M))


tot_inc, tot_mor = national_im_ratio()
im_ratio = tot_inc / tot_mor
pathways_per_cancer = 1 / (1 - DK_RULED_OUT)
paths = map_paths()

# Need index: high mortality + high chronic respiratory burden - high existing access.
elig = [c for c in COUNTIES if not c[6]]
z_mort = z([c[3] for c in elig])
z_copd = z([c[4] for c in elig])
z_acc = z([c[1] for c in elig])
need_by_name = {
    c[0]: (z_mort[i] + z_copd[i] - z_acc[i]) / 3 for i, c in enumerate(elig)
}

out = []
for name, per100, deaths, lcmort, copd, pop, too_small in COUNTIES:
    if name not in paths:
        raise SystemExit(f"no map geometry for {name}")
    d_yr = deaths / YEARS_POOLED
    cases_yr = d_yr * im_ratio
    pathways_yr = cases_yr * pathways_per_cancer
    out.append({
        "name": name,
        "slug": slugify(name),
        "path": paths[name],
        "per100": round(per100, 1),
        "deathsPooled": deaths,
        "deathsPerYear": round(d_yr, 1),
        "casesPerYearEst": round(cases_yr),
        "pathwaysPerYearEst": round(pathways_yr),
        "ctPerWeekEst": round(pathways_yr / 52, 1),
        "lcMortality": round(lcmort, 1),
        "copdPer100k": copd,
        "population": pop,
        "need": round(need_by_name.get(name, 0.0), 2) if not too_small else None,
        "tooSmall": too_small,
        "hasPrecedent": name in PRECEDENT,
    })

ranked = sorted(
    [c for c in out if not c["tooSmall"]], key=lambda c: -c["need"]
)
for i, c in enumerate(ranked):
    c["needRank"] = i + 1
for c in out:
    c.setdefault("needRank", None)

doc = {
    "meta": {
        "generated": "2026-11-14",
        "generator": "scripts/gen_app_data.py",
        "pooledYears": "2021-2024",
        "needIndex": "mean of z(lung cancer mortality) + z(COPD prevalence) - z(targeted treatment access), over the 22 counties with sufficient data",
        "geometry": "Statistics Finland WFS tilastointialueet:hyvinvointialue4500k_2025, projected and simplified by scripts/build_map.py",
        "estimateChain": "county deaths/year x national incidence:mortality ratio = estimated cases/year; x pathways per confirmed cancer = estimated diagnostic pathways/year; /52 = CT slots per week",
    },
    "national": {
        "incidencePooled": round(tot_inc),
        "mortalityPooled": round(tot_mor),
        "incidenceMortalityRatio": round(im_ratio, 3),
        "dkRuledOutShare": DK_RULED_OUT,
        "pathwaysPerConfirmedCancer": round(pathways_per_cancer, 2),
        "chestXrayReported2024": 674757,
        "thoraxCt2024": 35058,
        "xrayToCtRatio": round(674757 / 35058, 1),
        "targetedAccessNationalAvg": 28.7,
        "swedenReferralToCtResultDays": 7,
    },
    "counties": out,
}

with open("data/counties.json", "w", encoding="utf-8") as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)

print(f"wrote data/counties.json  ({len(out)} counties)")
print(f"national incidence:mortality = {im_ratio:.3f}")
print(f"pathways per confirmed cancer = {pathways_per_cancer:.2f}")
print("\nneed-index ranking (top 6):")
for c in ranked[:6]:
    print(f"  {c['needRank']}. {c['name']:20} need {c['need']:+.2f}  "
          f"{c['ctPerWeekEst']:4.1f} CT/week  {c['casesPerYearEst']:3} cases/y")
