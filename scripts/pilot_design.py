"""Size a direct-primary-care-CT pilot for a single wellbeing services county.

Three questions a county director will ask in the first minute:
  1. Why my county?
  2. How many extra CT slots does this cost me per week?
  3. How long until I know whether it worked?

Everything here is derived from data already in the repo plus two published
ratios. Estimates are labelled as such; nothing is invented.
"""
import csv
import math
from collections import defaultdict

# ---------------------------------------------------------------- inputs

# Pooled 2021-2024, from scripts/targeted_access.py
COUNTIES = [
    # name,                  per100, deaths, lcMort, copd,  pop
    ("Lapland",                18.2,   435,   61.7,  6121,  176182),
    ("Kainuu",                 18.4,   163,   57.7,  8014,   70626),
    ("North Karelia",          18.7,   327,   50.2,  6873,  162697),
    ("South Savo",             19.2,   291,   55.6,  6212,  130734),
    ("East Uusimaa",           20.1,   204,   51.5,  4239,   98982),
    ("Päijät-Häme",            21.6,   454,   55.4,  4725,  204777),
    ("North Ostrobothnia",     22.5,   670,   40.2,  5660,  416714),
    ("West Uusimaa",           23.7,   708,   36.4,  3394,  487130),
    ("Central Finland",        25.7,   409,   37.5,  5634,  273044),
    ("Satakunta",              26.5,   490,   57.5,  3989,  213010),
    ("Kymenlaakso",            26.7,   401,   62.7,  4873,  159962),
    ("Central Ostrobothnia",   26.7,   101,   37.2,  5411,   67863),
    ("Central Uusimaa",        27.3,   297,   36.5,  4864,  203542),
    ("North Savo",             28.6,   377,   38.0,  6490,  248178),
    ("City of Helsinki",       30.7,   914,   34.2,  3168,  667311),
    ("South Ostrobothnia",     32.6,   341,   44.6,  5567,  191082),
    ("Pirkanmaa",              33.4,   770,   36.1,  4160,  533326),
    ("Vantaa and Kerava",      34.1,   340,   30.3,  3423,  281173),
    ("Kanta-Häme",             36.9,   344,   50.6,  5364,  169789),
    ("Southwest Finland",      39.7,   824,   42.3,  3861,  486692),
    ("Ostrobothnia",           42.6,   272,   38.5,  4055,  176842),
    ("South Karelia",          52.4,   227,   45.1,  5429,  125733),
]

YEARS_POOLED = 4

# Denmark reports that in 58% of lung cancer pathways the suspicion is ruled out
# during workup (Sundhedsstyrelsen aarsopgoerelse 2025, lung cancer B26).
# So pathways per confirmed cancer = 1 / (1 - 0.58).
DK_RULED_OUT = 0.58

# ------------------------------------------------- national incidence : mortality


def nordcan_fi_counts():
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
    return inc, mor


inc, mor = nordcan_fi_counts()
tot_inc, tot_mor = sum(inc.values()), sum(mor.values())
IM_RATIO = tot_inc / tot_mor

print("Finland, lung cancer (C33-C34), NORDCAN, both sexes, 2021-2024")
for y in sorted(inc):
    print(f"  {y}: incidence {inc[y]:7.0f}   mortality {mor[y]:7.0f}   ratio {inc[y]/mor[y]:.3f}")
print(f"  pooled incidence {tot_inc:.0f} / mortality {tot_mor:.0f} = {IM_RATIO:.3f}")
print(f"\nPathways per confirmed cancer (Denmark {DK_RULED_OUT:.0%} ruled out): "
      f"{1/(1-DK_RULED_OUT):.2f}")

# ------------------------------------------------------------ site selection


def z(vals):
    m = sum(vals) / len(vals)
    sd = math.sqrt(sum((v - m) ** 2 for v in vals) / len(vals))
    return [(v - m) / sd if sd else 0.0 for v in vals]


names = [c[0] for c in COUNTIES]
per100 = [c[1] for c in COUNTIES]
deaths = [c[2] for c in COUNTIES]
lcmort = [c[3] for c in COUNTIES]
copd = [c[4] for c in COUNTIES]
pops = [c[5] for c in COUNTIES]

# Need: high mortality, high chronic respiratory burden, low targeted access.
z_mort, z_copd, z_acc = z(lcmort), z(copd), z(per100)
need = [(a + b - c) / 3 for a, b, c in zip(z_mort, z_copd, z_acc)]

rows = []
for i, name in enumerate(names):
    d_yr = deaths[i] / YEARS_POOLED
    cases_yr = d_yr * IM_RATIO                      # Estimate
    pathways_yr = cases_yr / (1 - DK_RULED_OUT)     # Estimate
    rows.append({
        "name": name,
        "need": need[i],
        "deaths_yr": d_yr,
        "cases_yr": cases_yr,
        "pathways_yr": pathways_yr,
        "ct_week": pathways_yr / 52,
        "pop": pops[i],
        "per100": per100[i],
        "lcMort": lcmort[i],
        "copd": copd[i],
    })

rows.sort(key=lambda r: -r["need"])

print("\n\nPilot site selection index  (higher = more need)")
print("need = mean of z(mortality) + z(COPD) - z(targeted access)\n")
print(f"{'county':22} {'need':>6} {'deaths/y':>9} {'est cases/y':>12} "
      f"{'est pathways/y':>15} {'CT/week':>8} {'pop':>9}")
for r in rows:
    print(f"{r['name']:22} {r['need']:+6.2f} {r['deaths_yr']:9.0f} {r['cases_yr']:12.0f} "
          f"{r['pathways_yr']:15.0f} {r['ct_week']:8.1f} {r['pop']:9,}")

# ------------------------------------------------------- detectable effect


def n_for_proportion(p1, p2, alpha=0.05, power=0.80):
    """Two-proportion z-test, per arm."""
    za, zb = 1.959964, 0.8416212
    pbar = (p1 + p2) / 2
    num = (za * math.sqrt(2 * pbar * (1 - pbar)) + zb * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2
    return num / ((p2 - p1) ** 2)


print("\n\nHow big an early-stage shift could a county actually detect?")
print("Comparing the share of cases diagnosed at stage I-II, pilot year vs the")
print("county's own prior year. Two-proportion test, alpha 0.05, power 80%.\n")
BASELINE = 0.30  # placeholder baseline, must be replaced with the county's real figure
print(f"Assumed baseline share diagnosed at stage I-II: {BASELINE:.0%}  <-- MUST be"
      " replaced with the county's own Cancer Registry figure before use\n")
print(f"{'absolute shift':>15} {'cases needed per arm':>22} {'years for Lapland':>19} "
      f"{'years for N.Ostrobothnia':>26}")
lap = next(r for r in rows if r["name"] == "Lapland")["cases_yr"]
npo = next(r for r in rows if r["name"] == "North Ostrobothnia")["cases_yr"]
for shift in (0.05, 0.075, 0.10, 0.15, 0.20):
    n = n_for_proportion(BASELINE, BASELINE + shift)
    print(f"{shift:>14.0%} {n:>22.0f} {n/lap:>19.1f} {n/npo:>26.1f}")

print("""
Reading this honestly: a stage shift is NOT a realistic primary endpoint for a
one-year pilot in any single Finnish county. Even a large 10-point shift needs
roughly 350 cases per arm, which is 3+ years of cases in Lapland. The primary
endpoint has to be a process measure the county controls and can read in weeks.
""")
