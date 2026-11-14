import csv
import statistics as st
from collections import defaultdict


def load(f):
    with open("raw/" + f + ".csv", encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


reg = {r["region_id"]: (r["name_en"] or r["name_fi"]) for r in load("dim_region")}
deaths = load("deaths")
kela = load("kela")
dim = load("dim_indicator")

print("--- Kela indicator names (what are these codes?) ---")
for r in dim:
    if r["indicator_id"].startswith("kela:"):
        print(f"  {r['indicator_id']:38} {(r['name_en'] or r['name_fi'])[:95]}")

LC_CNT = "statfin:ksyyt:lung_trachea_larynx_cancer_C32_C34:deaths_count"
TARGETED = {
    "1504", "1519", "1521", "1527", "1538", "1546", "1550",
    "3001", "3004", "3017", "3026", "3050", "3068", "3072", "3081",
}
YEARS = ("2021", "2022", "2023", "2024")

lc = defaultdict(dict)
for r in deaths:
    if r["indicator_id"] == LC_CNT and r["region_id"].startswith("FI-HVA"):
        lc[r["region_id"]][r["year"]] = float(r["value"])

targ = defaultdict(lambda: defaultdict(float))
per_code = defaultdict(lambda: defaultdict(float))
for r in kela:
    code = r["indicator_id"].split(":")[1]
    if code in TARGETED and r["indicator_id"].endswith("valid_during_year"):
        targ[r["region_id"]][r["year"]] += float(r["value"])
        per_code[r["year"]][code] += float(r["value"])

print("\n--- national targeted users by code and year (check coding transitions) ---")
codes = sorted(TARGETED)
print("year  " + "".join(f"{c:>8}" for c in codes))
for y in ("2020", "2021", "2022", "2023", "2024", "2025"):
    print(f"{y}  " + "".join(f"{per_code[y].get(c, 0):8.0f}" for c in codes))

print("\n--- 4-year pooled: targeted users per 100 lung-cancer deaths, by county ---")
rows = []
for rid in lc:
    d_sum = sum(lc[rid].get(y, 0) for y in YEARS)
    t_sum = sum(targ[rid].get(y, 0) for y in YEARS)
    if d_sum:
        rows.append((reg.get(rid, rid)[:24], t_sum / d_sum * 100, int(d_sum), int(t_sum)))
rows.sort(key=lambda x: x[1])
for n, ratio, d_sum, t_sum in rows:
    print(f"  {n:26}{ratio:7.1f}   deaths {d_sum:5d}   targeted-years {t_sum:5d}")

v = [r[1] for r in rows if r[1] > 0]
print(
    f"\n  pooled spread: min {min(v):.1f} max {max(v):.1f} = {max(v)/min(v):.2f}x | "
    f"median {st.median(v):.1f} | cv {st.pstdev(v)/st.mean(v):.2f}"
)
q = sorted(v)
n = len(q)
bottom = st.mean(q[: n // 4])
top = st.mean(q[-(n // 4):])
print(f"  bottom quartile mean {bottom:.1f} vs top quartile mean {top:.1f} = {top/bottom:.2f}x")

print("\n--- year-to-year rank stability (Spearman-ish: rank in 2022 vs 2024) ---")


def ranking(year):
    tmp = []
    for rid in lc:
        d = lc[rid].get(year, 0)
        if d:
            tmp.append((rid, targ[rid].get(year, 0) / d))
    tmp.sort(key=lambda x: x[1])
    return {rid: i for i, (rid, _) in enumerate(tmp)}


r22, r24 = ranking("2022"), ranking("2024")
common = [k for k in r22 if k in r24]
mean22 = st.mean(r22[k] for k in common)
mean24 = st.mean(r24[k] for k in common)
num = sum((r22[k] - mean22) * (r24[k] - mean24) for k in common)
den = (
    sum((r22[k] - mean22) ** 2 for k in common) ** 0.5
    * sum((r24[k] - mean24) ** 2 for k in common) ** 0.5
)
print(f"  rank correlation 2022 vs 2024: {num/den:.2f}  (n={len(common)} counties)")

print("\n--- counties low on targeted access in BOTH 2022 and 2024 ---")
lowest22 = {k for k, v2 in r22.items() if v2 < 6}
lowest24 = {k for k, v2 in r24.items() if v2 < 6}
for rid in sorted(lowest22 & lowest24):
    print(f"  {reg.get(rid, rid)[:30]}")
