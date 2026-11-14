"""Incidence vs survival: is Finland's poor lung cancer survival explained by case mix?"""
import csv

NAMES = {"FI": "Finland", "NORDIC-208": "Denmark", "NORDIC-352": "Iceland",
         "NORDIC-578": "Norway", "NORDIC-752": "Sweden"}

with open("raw/nordcan.csv", encoding="utf-8-sig", newline="") as f:
    rows = list(csv.DictReader(f))

def grab(ind, sex, year, group="ALL"):
    return {r["region_id"]: float(r["value"]) for r in rows
            if r["indicator_id"] == ind and r["sex"] == sex
            and r["year"] == year and r["group_id"] == group}

for sex in ("M", "F"):
    inc = grab("nordcan:incidence_asr_esp2013_per_100k", sex, "2024")
    mor = grab("nordcan:mortality_asr_esp2013_per_100k", sex, "2024")
    sur = grab("nordcan:survival_5y_relative_pct", sex, "2022")
    lo = grab("nordcan:survival_5y_relative_pct_ci95_low", sex, "2022")
    hi = grab("nordcan:survival_5y_relative_pct_ci95_high", sex, "2022")
    print(f"\n=== sex={sex} ===")
    print(f"{'country':9} {'inc ASR 2024':>13} {'mort ASR 2024':>14} {'5y surv 2020-24':>16} {'95% CI':>14}")
    for rid in sorted(sur, key=lambda r: -sur[r]):
        ci = f"{lo.get(rid, float('nan')):.1f}-{hi.get(rid, float('nan')):.1f}"
        print(f"{NAMES.get(rid, rid):9} {inc.get(rid, float('nan')):13.1f} "
              f"{mor.get(rid, float('nan')):14.1f} {sur[rid]:16.1f} {ci:>14}")

# How much did each country gain between the 2017 and 2022 survival periods?
print("\n=== survival change, 2017 period -> 2022 period (pct points) ===")
for sex in ("M", "F"):
    a = grab("nordcan:survival_5y_relative_pct", sex, "2017")
    b = grab("nordcan:survival_5y_relative_pct", sex, "2022")
    print(f"  sex={sex}")
    for rid in sorted(b, key=lambda r: -(b[r] - a.get(r, b[r]))):
        if rid in a:
            print(f"    {NAMES.get(rid, rid):9} {a[rid]:5.1f} -> {b[rid]:5.1f}   {b[rid]-a[rid]:+.1f}")
