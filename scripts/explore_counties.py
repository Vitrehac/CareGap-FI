import csv
import statistics as st
from collections import defaultdict


def load(f):
    with open("raw/" + f + ".csv", encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


reg = {r["region_id"]: (r["name_en"] or r["name_fi"]) for r in load("dim_region")}
deaths = load("deaths")
kela = load("kela")

TARGETED = {
    "1504", "1519", "1521", "1527", "1538", "1546", "1550",
    "3001", "3004", "3017", "3026", "3050", "3068", "3072", "3081",
}

LC_CNT = "statfin:ksyyt:lung_trachea_larynx_cancer_C32_C34:deaths_count"
LC_RATE = "statfin:ksyyt:lung_trachea_larynx_cancer_C32_C34:crude_mortality_per_100k"
COPD_RATE = "statfin:ksyyt:copd_emphysema_J40_J44_J47:crude_mortality_per_100k"


def by_county(indicator, year):
    return {
        r["region_id"]: float(r["value"])
        for r in deaths
        if r["indicator_id"] == indicator
        and r["region_id"].startswith("FI-HVA")
        and r["year"] == year
    }


def kela_sum(year, codes, suffix="valid_during_year"):
    out = defaultdict(float)
    for r in kela:
        code = r["indicator_id"].split(":")[1]
        if code in codes and r["indicator_id"].endswith(suffix) and r["year"] == year:
            out[r["region_id"]] += float(r["value"])
    return out


for YEAR in ("2024", "2023"):
    lc_cnt = by_county(LC_CNT, YEAR)
    lc_rate = by_county(LC_RATE, YEAR)
    copd_mort = by_county(COPD_RATE, YEAR)
    if not lc_cnt or not lc_rate:
        print("no data for", YEAR)
        continue

    pop = {r: lc_cnt[r] / lc_rate[r] * 100000 for r in lc_cnt if lc_rate.get(r)}
    copd = kela_sum(YEAR, {"203"})
    targeted = kela_sum(YEAR, TARGETED)

    rows = []
    for rid in sorted(lc_rate, key=lambda x: -lc_rate[x]):
        p = pop.get(rid, 0)
        c = copd.get(rid, 0)
        t = targeted.get(rid, 0)
        dd = lc_cnt[rid]
        rows.append(
            {
                "name": reg.get(rid, rid)[:22],
                "lc_mort": lc_rate[rid],
                "copd_per_100k": c / p * 100000 if p else 0,
                "deaths_per_1k_copd": dd / c * 1000 if c else 0,
                "targ_per_100_deaths": t / dd * 100 if dd else 0,
                "copd_mort": copd_mort.get(rid, 0),
                "pop": int(p),
                "deaths": int(dd),
                "copd": int(c),
                "targ": int(t),
            }
        )

    print("=" * 110)
    print("YEAR", YEAR, " counties:", len(rows))
    hdr = (
        f"{'county':23}{'LCmort':>8}{'COPDmort':>9}{'COPD/100k':>11}"
        f"{'d/1k COPD':>11}{'targ/100d':>10}{'pop':>9}{'deaths':>7}{'COPD':>7}{'targ':>6}"
    )
    print(hdr)
    for r in rows:
        print(
            f"{r['name']:23}{r['lc_mort']:8.1f}{r['copd_mort']:9.1f}{r['copd_per_100k']:11.0f}"
            f"{r['deaths_per_1k_copd']:11.1f}{r['targ_per_100_deaths']:10.1f}"
            f"{r['pop']:9d}{r['deaths']:7d}{r['copd']:7d}{r['targ']:6d}"
        )

    print()
    for key, label in [
        ("lc_mort", "lung/trachea/larynx crude mortality per 100k"),
        ("copd_mort", "COPD crude mortality per 100k"),
        ("copd_per_100k", "COPD reimbursement holders per 100k"),
        ("deaths_per_1k_copd", "LC deaths per 1000 COPD holders"),
        ("targ_per_100_deaths", "targeted-drug users per 100 LC deaths"),
    ]:
        v = [r[key] for r in rows if r[key] > 0]
        if len(v) < 2:
            continue
        print(
            f"  {label}: min {min(v):.1f} | max {max(v):.1f} | "
            f"spread {max(v)/min(v):.2f}x | median {st.median(v):.1f} | cv {st.pstdev(v)/st.mean(v):.2f}"
        )
    print()
