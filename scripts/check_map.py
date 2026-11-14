"""Sanity-check the generated map paths: every county present, none collapsed."""
import re

src = open("scripts/out/map_paths.ts", encoding="utf-8").read()
entries = re.findall(r'^\s*"([^"]+)":\s*"([^"]+)",$', src, re.M)
print(f"counties with paths: {len(entries)}\n")
print(f"{'county':22} {'subpaths':>8} {'points':>7} {'width':>7} {'height':>7}")
bad = []
for name, d in entries:
    subs = d.count("M")
    nums = [float(v) for v in re.findall(r"-?\d+\.\d+", d)]
    xs, ys = nums[0::2], nums[1::2]
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    print(f"{name:22} {subs:8} {len(xs):7} {w:7.1f} {h:7.1f}")
    if len(xs) < 4 or max(w, h) < 4:
        bad.append(name)

allx, ally = [], []
for _, d in entries:
    nums = [float(v) for v in re.findall(r"-?\d+\.\d+", d)]
    allx += nums[0::2]
    ally += nums[1::2]
print(f"\noverall x range: {min(allx):.1f} - {max(allx):.1f}  (width {max(allx)-min(allx):.0f})")
print(f"overall y range: {min(ally):.1f} - {max(ally):.1f}  (height {max(ally)-min(ally):.0f})")
print(f"aspect (w/h): {(max(allx)-min(allx))/(max(ally)-min(ally)):.2f}  — Finland is roughly 0.5")
print("collapsed counties:", bad or "none")
