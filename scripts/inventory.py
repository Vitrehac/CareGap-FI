"""Inventory every scraped file: row counts, columns, and a sample of unused tabs."""
import csv
import glob
import os

for path in sorted(glob.glob("raw/*.csv")):
    with open(path, encoding="utf-8-sig", newline="") as f:
        r = csv.reader(f)
        try:
            header = next(r)
        except StopIteration:
            print(f"{os.path.basename(path)}: empty")
            continue
        n = sum(1 for _ in r)
    kb = round(os.path.getsize(path) / 1024)
    print(f"\n{os.path.basename(path):18} {n:>7,} rows  {kb:>5} KB  {len(header)} cols")
    print(f"   cols: {header[:12]}")

print("\n" + "=" * 72)
for name in ("nordcan", "nocca", "dim_indicator"):
    path = f"raw/{name}.csv"
    if not os.path.exists(path):
        continue
    print(f"\n--- {name}.csv sample ---")
    with open(path, encoding="utf-8-sig", newline="") as f:
        for i, row in enumerate(csv.reader(f)):
            print("  ", [str(c)[:22] for c in row[:9]])
            if i >= 8:
                break
