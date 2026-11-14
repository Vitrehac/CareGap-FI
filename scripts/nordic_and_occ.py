"""Pull Nordic comparison series and occupational lung cancer SIR for the canvas."""
import csv
from collections import defaultdict

def load(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))

nordcan = load("raw/nordcan.csv")
nocca = load("raw/nocca.csv")

print("NORDCAN indicators:")
inds = sorted({r["indicator_id"] for r in nordcan})
for i in inds:
    print("  ", i)
print("\nNORDCAN regions:", sorted({r["region_id"] for r in nordcan}))
print("NORDCAN years:", min(r["year"] for r in nordcan), "-", max(r["year"] for r in nordcan))
print("NORDCAN groups (first 25):", sorted({r["group_id"] for r in nordcan})[:25])

print("\n" + "=" * 72)
print("NOCCA indicators:")
for i in sorted({r["indicator_id"] for r in nocca}):
    print("  ", i)
print("NOCCA regions:", sorted({r["region_id"] for r in nocca})[:10])
print("NOCCA years:", sorted({r["year"] for r in nocca})[:10])

sir = [r for r in nocca if r["indicator_id"] == "nocca:lung_cancer:sir"]
print(f"\nlung cancer SIR rows: {len(sir)}")
for sex in ("M", "F"):
    rows = [(r["group_id"].replace("OCC_", ""), float(r["value"])) for r in sir if r["sex"] == sex]
    rows.sort(key=lambda t: -t[1])
    print(f"\n  sex={sex}  n={len(rows)}   highest 12:")
    for g, v in rows[:12]:
        print(f"     {g:34} {v:7.2f}")
    print("   lowest 5:")
    for g, v in rows[-5:]:
        print(f"     {g:34} {v:7.2f}")
