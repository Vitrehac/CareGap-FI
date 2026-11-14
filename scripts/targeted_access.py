"""County-level access to targeted lung cancer medicines, relative to lung cancer death burden.

Kela gives each drug an old and a new reimbursement code for the same people, so the
README warns against summing both. We take the larger of each pair per county-year.
"""

import csv
import statistics as st
from collections import defaultdict


def load(f):
    with open("raw/" + f + ".csv", encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


reg = {r["region_id"]: (r["name_en"] or r["name_fi"]) for r in load("dim_region")}
deaths = load("deaths")
kela = load("kela")

# drug -> (old code, new code); pralsetinib only ever had one
DRUGS = {
    "osimertinib": ("1519", "3004"),
    "alectinib": ("1504", "3001"),
    "brigatinib": ("1521", "3017"),
    "lorlatinib": ("1527", "3026"),
    "entrectinib": ("1538", "3050"),
    "tepotinib": ("1546", "3081"),
    "selpercatinib": ("1550", "3072"),
    "pralsetinib": ("3068",),
    "erlotinib": ("191", "325"),
    "afatinib_gefitinib": ("155", "341"),
}

LC_CNT = "statfin:ksyyt:lung_trachea_larynx_cancer_C32_C34:deaths_count"
LC_RATE = "statfin:ksyyt:lung_trachea_larynx_cancer_C32_C34:crude_mortality_per_100k"
YEARS = ("2021", "2022", "2023", "2024")

lc = defaultdict(dict)
rate = defaultdict(dict)
for r in deaths:
    if not r["region_id"].startswith("FI-HVA"):
        continue
    if r["indicator_id"] == LC_CNT:
        lc[r["region_id"]][r["year"]] = float(r["value"])
    elif r["indicator_id"] == LC_RATE:
        rate[r["region_id"]][r["year"]] = float(r["value"])

# code -> county -> year -> persons
raw = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
for r in kela:
    code = r["indicator_id"].split(":")[1]
    if r["indicator_id"].endswith("valid_during_year"):
        raw[code][r["region_id"]][r["year"]] += float(r["value"])

copd = defaultdict(lambda: defaultdict(float))
for r in kela:
    if r["indicator_id"] == "kela:203:valid_during_year":
        copd[r["region_id"]][r["year"]] += float(r["value"])


def targeted(region, year):
    """Dedupe old/new code pairs by taking the larger."""
    return sum(max(raw[c][region].get(year, 0) for c in codes) for codes in DRUGS.values())


rows = []
for rid in lc:
    d_sum = sum(lc[rid].get(y, 0) for y in YEARS)
    t_sum = sum(targeted(rid, y) for y in YEARS)
    pops = [
        lc[rid][y] / rate[rid][y] * 100000
        for y in YEARS
        if rate[rid].get(y) and lc[rid].get(y)
    ]
    pop = st.mean(pops) if pops else 0
    c_sum = sum(copd[rid].get(y, 0) for y in YEARS) / len(YEARS)
    if not d_sum or not pop:
        continue
    rows.append(
        {
            "name": reg.get(rid, rid).replace(" wellbeing services county", "").replace(" wellbeing services", ""),
            "per100": t_sum / d_sum * 100,
            "deaths": int(d_sum),
            "targ": int(t_sum),
            "mort": st.mean(rate[rid][y] for y in YEARS if rate[rid].get(y)),
            "copd_per100k": c_sum / pop * 100000,
            "pop": int(pop),
        }
    )

rows.sort(key=lambda r: r["per100"])

print("Targeted lung cancer medicines per 100 lung/trachea/larynx cancer deaths")
print("pooled 2021-2024, old/new Kela codes de-duplicated\n")
print(f"{'county':24}{'per 100 deaths':>15}{'deaths':>8}{'drug-yrs':>10}{'LC mort/100k':>14}{'COPD/100k':>11}{'pop':>9}")
for r in rows:
    print(
        f"{r['name'][:24]:24}{r['per100']:15.1f}{r['deaths']:8d}{r['targ']:10d}"
        f"{r['mort']:14.1f}{r['copd_per100k']:11.0f}{r['pop']:9d}"
    )

big = [r for r in rows if r["deaths"] >= 150]
v = [r["per100"] for r in big]
print(f"\nCounties with >=150 pooled deaths (n={len(big)}, excludes Aland):")
print(f"  min {min(v):.1f}  max {max(v):.1f}  = {max(v)/min(v):.2f}x   median {st.median(v):.1f}   cv {st.pstdev(v)/st.mean(v):.2f}")
q = sorted(v)
k = max(1, len(q) // 4)
print(f"  bottom quartile mean {st.mean(q[:k]):.1f} vs top quartile mean {st.mean(q[-k:]):.1f} = {st.mean(q[-k:])/st.mean(q[:k]):.2f}x")

nat_d = sum(r["deaths"] for r in rows)
nat_t = sum(r["targ"] for r in rows)
print(f"\n  national average: {nat_t/nat_d*100:.1f} per 100 deaths  ({nat_t} drug-years / {nat_d} deaths)")

print("\nIs low access just low burden? correlation of per100 vs LC mortality:")
x = [r["mort"] for r in big]
y = [r["per100"] for r in big]
mx, my = st.mean(x), st.mean(y)
num = sum((a - mx) * (b - my) for a, b in zip(x, y))
den = (sum((a - mx) ** 2 for a in x) ** 0.5) * (sum((b - my) ** 2 for b in y) ** 0.5)
print(f"  pearson r = {num/den:.2f}  (negative = high-mortality counties get LESS targeted treatment)")

x2 = [r["copd_per100k"] for r in big]
mx2 = st.mean(x2)
num2 = sum((a - mx2) * (b - my) for a, b in zip(x2, y))
den2 = (sum((a - mx2) ** 2 for a in x2) ** 0.5) * (sum((b - my) ** 2 for b in y) ** 0.5)
print(f"  vs COPD prevalence: pearson r = {num2/den2:.2f}")

print("\nPer-year check (stability of the 5 lowest pooled counties):")
low5 = [r["name"] for r in rows if r["deaths"] >= 150][:5]
name_to_rid = {reg.get(rid, rid).replace(" wellbeing services county", "").replace(" wellbeing services", ""): rid for rid in lc}
print(f"{'county':24}" + "".join(f"{y:>9}" for y in YEARS))
for nm in low5:
    rid = name_to_rid[nm]
    cells = []
    for y in YEARS:
        d = lc[rid].get(y, 0)
        cells.append(f"{targeted(rid, y)/d*100:9.1f}" if d else f"{'-':>9}")
    print(f"{nm[:24]:24}" + "".join(cells))
