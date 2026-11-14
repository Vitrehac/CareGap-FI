"""Does regional pathway speed track regional lung cancer survival?

Denmark is the only Nordic country that publishes both variables by region, so it
is the only place this correlation can actually be computed. n = 5.

Pathway compliance: Sundhedsstyrelsen, Monitorering af forloebstider paa
kraeftomraadet, aarsopgoerelse 2025 (lung cancer B26, % within standard time).
Survival: Dansk Lunge Cancer Register aarsrapport 2024, indicator tables 3.1.1-3.1.3.
"""
import math

DK = [
    # region,          surgery%, radio%, surv1y, surv2y, surv5y
    ("Hovedstaden",        82,     75,    60.0,   47.2,   28.5),
    ("Syddanmark",         86,     85,    57.9,   39.7,   23.5),
    ("Midtjylland",        79,     66,    58.9,   45.0,   25.7),
    ("Nordjylland",        77,     66,    59.4,   41.7,   23.3),
    ("Sjælland",           53,     49,    57.1,   40.3,   23.8),
]


def pearson(xs, ys):
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    dy = math.sqrt(sum((y - my) ** 2 for y in ys))
    return num / (dx * dy) if dx and dy else float("nan")


names = [r[0] for r in DK]
surgery = [r[1] for r in DK]
radio = [r[2] for r in DK]

print("Denmark, lung cancer by region")
print(f"{'region':14} {'surg%':>6} {'radio%':>7} {'1y':>6} {'2y':>6} {'5y':>6}")
for r in DK:
    print(f"{r[0]:14} {r[1]:6} {r[2]:7} {r[3]:6.1f} {r[4]:6.1f} {r[5]:6.1f}")

print("\nPearson r, pathway compliance vs survival (n=5):")
for label, idx in (("1-year", 3), ("2-year", 4), ("5-year", 5)):
    ys = [r[idx] for r in DK]
    print(f"  {label:7} vs surgery-on-time    r = {pearson(surgery, ys):+.2f}")
    print(f"  {label:7} vs radiotherapy-on-time r = {pearson(radio, ys):+.2f}")

print("\nSpread:")
print(f"  surgery on time: {min(surgery)}% - {max(surgery)}%  ({max(surgery)/min(surgery):.2f}x)")
print(f"  5-year survival: {min(r[5] for r in DK):.1f}% - {max(r[5] for r in DK):.1f}%")

print("""
Caveats that make these r values weak evidence:
  1. n = 5. One region moving changes r a lot.
  2. Timing mismatch. Compliance is 2025; the 5-year cohort was diagnosed in 2019.
     2025 pathway speed cannot have caused 2019 patients' survival.
  3. Syddanmark breaks the pattern: best radiotherapy compliance (85%) but
     near-lowest 5-year survival (23.5%).
  4. Survival here is unadjusted for stage and case mix.
Conclusion: direction is positive but the relationship is not demonstrated.
""")
