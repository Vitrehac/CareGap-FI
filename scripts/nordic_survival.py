"""Nordic 5-year relative survival and mortality trend, FI vs other Nordic countries."""
import csv

NAMES = {
    "FI": "Finland", "NORDIC-208": "Denmark", "NORDIC-352": "Iceland",
    "NORDIC-578": "Norway", "NORDIC-752": "Sweden",
}

def load(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))

# What site does this NORDCAN extract cover?
print("--- NORDCAN indicator metadata ---")
for r in load("raw/dim_indicator.csv"):
    if r["indicator_id"].startswith("nordcan:") and "survival" in r["indicator_id"]:
        print(f"  {r['indicator_id']}")
        print(f"     native_id = {r['native_id']}")
        print(f"     name_en   = {r['name_en']}")
        print(f"     unit      = {r['unit']}   period = {r['period_note']}")

rows = load("raw/nordcan.csv")

def series(ind, sex="ALL_SEX", group="ALL"):
    out = {}
    for r in rows:
        if r["indicator_id"] == ind and r["group_id"] == group:
            out.setdefault(r["sex"], {}).setdefault(r["region_id"], {})[r["year"]] = float(r["value"])
    return out

print("\n--- survival_5y_relative_pct, group=ALL ---")
sv = series("nordcan:survival_5y_relative_pct")
for sex, regions in sv.items():
    print(f"\nsex={sex}")
    for rid, yrs in sorted(regions.items()):
        ys = sorted(yrs)
        shown = ", ".join(f"{y}:{yrs[y]:.1f}" for y in ys[-8:])
        print(f"  {NAMES.get(rid, rid):9} n={len(ys):3}  {shown}")

print("\n--- mortality_asr_esp2013_per_100k, group=ALL, recent years ---")
mt = series("nordcan:mortality_asr_esp2013_per_100k")
for sex, regions in mt.items():
    print(f"\nsex={sex}")
    for rid, yrs in sorted(regions.items()):
        ys = sorted(yrs)
        shown = ", ".join(f"{y}:{yrs[y]:.1f}" for y in ys[-6:])
        print(f"  {NAMES.get(rid, rid):9} {shown}")
