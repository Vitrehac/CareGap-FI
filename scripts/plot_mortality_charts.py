"""
Build pitch charts from raw/deaths.csv + raw/nordcan.csv only.
Never invents values. Labels every figure Sourced.

Outputs: docs/charts/*.png + docs/MORTALITY_CHARTS.md
"""
from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib.ticker as mtick

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "raw"
OUT = ROOT / "docs" / "charts"
OUT.mkdir(parents=True, exist_ok=True)

IND_CRUDE = "statfin:ksyyt:lung_trachea_larynx_cancer_C32_C34:crude_mortality_per_100k"
IND_ASR = "statfin:ksyyt:lung_trachea_larynx_cancer_C32_C34:age_std_mortality_per_100k"
IND_COUNT = "statfin:ksyyt:lung_trachea_larynx_cancer_C32_C34:deaths_count"
NORD_AGE = "nordcan:mortality_age_specific_rate_per_100k"
NORD_ASR = "nordcan:mortality_asr_world_per_100k"

NORDIC_NAME = {
    "FI": "Finland",
    "NORDIC-208": "Denmark",
    "NORDIC-752": "Sweden",
    "NORDIC-578": "Norway",
    "NORDIC-352": "Iceland",
}

AGE_ORDER = [
    "AGE_0_4", "AGE_5_9", "AGE_10_14", "AGE_15_19", "AGE_20_24", "AGE_25_29",
    "AGE_30_34", "AGE_35_39", "AGE_40_44", "AGE_45_49", "AGE_50_54", "AGE_55_59",
    "AGE_60_64", "AGE_65_69", "AGE_70_74", "AGE_75_79", "AGE_80_84", "AGE_85_PLUS",
]


def load_regions() -> dict[str, dict]:
    out = {}
    with open(RAW / "dim_region.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            out[row["region_id"]] = row
    return out


def load_groups() -> dict[str, str]:
    out = {}
    with open(RAW / "dim_group.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            out[row["group_id"]] = row["name_en"]
    return out


def short_county(name: str) -> str:
    return (
        name.replace(" wellbeing services county", "")
        .replace(" City of Helsinki", "Helsinki")
        .replace("City of Helsinki", "Helsinki")
        .strip()
    )


def style():
    plt.rcParams.update(
        {
            "figure.facecolor": "#E6EBF0",
            "axes.facecolor": "#F4F7FA",
            "axes.edgecolor": "#1E4D8C",
            "axes.labelcolor": "#0F1720",
            "text.color": "#0F1720",
            "xtick.color": "#0F1720",
            "ytick.color": "#0F1720",
            "font.size": 10,
            "axes.titlesize": 12,
            "axes.titleweight": "bold",
        }
    )


def chart_county_crude(regs: dict[str, dict]) -> Path:
    """Mean crude mortality 2021–2024 by wellbeing services county (sex=T, all ages)."""
    buckets: dict[str, list[float]] = defaultdict(list)
    with open(RAW / "deaths.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["indicator_id"] != IND_CRUDE or row["sex"] != "T":
                continue
            r = regs.get(row["region_id"], {})
            if r.get("level") != "wellbeing_services_county":
                continue
            y = int(row["year"])
            if y < 2021 or y > 2024:
                continue
            buckets[short_county(r["name_en"])].append(float(row["value"]))

    means = {k: sum(v) / len(v) for k, v in buckets.items() if v}
    ranked = sorted(means.items(), key=lambda x: x[1], reverse=True)

    fig, ax = plt.subplots(figsize=(11, 7))
    names = [n for n, _ in ranked]
    vals = [v for _, v in ranked]
    colors = []
    for n in names:
        if n == "Satakunta":
            colors.append("#C45C26")  # precedent county
        elif n == "Kainuu":
            colors.append("#1E4D8C")  # default pilot
        else:
            colors.append("#7A8B9A")
    ax.barh(names[::-1], vals[::-1], color=colors[::-1])
    ax.set_xlabel("Deaths per 100,000 (crude, C32–C34)")
    ax.set_title(
        "Lung/trachea/larynx cancer crude mortality by wellbeing services county\n"
        "Mean of annual rates, 2021–2024 · sex = both · age = all · Sourced: Statistics Finland (ksyyt)"
    )
    ax.annotate(
        "Blue = Kainuu (default CareGap pilot)\nOrange = Satakunta (direct-CT precedent, unevaluated)",
        xy=(0.98, 0.02),
        xycoords="axes fraction",
        ha="right",
        va="bottom",
        fontsize=8,
        color="#334155",
    )
    fig.tight_layout()
    path = OUT / "county_crude_mortality_2021_2024.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path


def chart_national_asr_by_sex() -> Path:
    """National age-standardised mortality by sex, recent years."""
    series: dict[str, dict[int, float]] = defaultdict(dict)
    with open(RAW / "deaths.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["indicator_id"] != IND_ASR:
                continue
            if row["region_id"] != "FI":
                continue
            y = int(row["year"])
            if y < 2000 or y > 2024:
                continue
            series[row["sex"]][y] = float(row["value"])

    fig, ax = plt.subplots(figsize=(10, 5.5))
    for sex, label, color in (
        ("M", "Men", "#1E4D8C"),
        ("F", "Women", "#C45C26"),
        ("T", "Both", "#7A8B9A"),
    ):
        ys = sorted(series[sex])
        ax.plot(ys, [series[sex][y] for y in ys], label=label, color=color, lw=2)
    ax.set_ylabel("Age-standardised deaths per 100,000")
    ax.set_xlabel("Year")
    ax.set_title(
        "Finland age-standardised lung/trachea/larynx cancer mortality by sex\n"
        "C32–C34 · national only (no county×sex in dataset) · Sourced: Statistics Finland (ksyyt)"
    )
    ax.legend()
    ax.grid(True, alpha=0.3)
    fig.tight_layout()
    path = OUT / "finland_asr_mortality_by_sex.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path


def chart_nordic_asr_by_sex() -> Path:
    """NORDCAN world ASR mortality latest common year by country × sex."""
    # collect by region, sex, year
    data: dict[tuple[str, str, int], float] = {}
    with open(RAW / "nordcan.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["indicator_id"] != NORD_ASR:
                continue
            if row["region_id"] not in NORDIC_NAME:
                continue
            if row["group_id"] != "ALL":
                continue
            data[(row["region_id"], row["sex"], int(row["year"]))] = float(row["value"])

    # pick latest year present for all five × M and F
    years = sorted({y for (_, _, y) in data})
    year = None
    for y in reversed(years):
        ok = all((rid, sex, y) in data for rid in NORDIC_NAME for sex in ("M", "F"))
        if ok:
            year = y
            break
    if year is None:
        raise RuntimeError("No common NORDCAN ASR year for all Nordic × sex")

    countries = ["Finland", "Denmark", "Iceland", "Norway", "Sweden"]
    rid_of = {v: k for k, v in NORDIC_NAME.items()}
    x = range(len(countries))
    width = 0.38
    men = [data[(rid_of[c], "M", year)] for c in countries]
    women = [data[(rid_of[c], "F", year)] for c in countries]

    fig, ax = plt.subplots(figsize=(9, 5.5))
    ax.bar([i - width / 2 for i in x], men, width, label="Men", color="#1E4D8C")
    ax.bar([i + width / 2 for i in x], women, width, label="Women", color="#C45C26")
    ax.set_xticks(list(x))
    ax.set_xticklabels(countries)
    ax.set_ylabel("Age-standardised mortality per 100,000 (world)")
    ax.set_title(
        f"Nordic lung cancer mortality ASR (world) by country and sex · {year}\n"
        "Sourced: NORDCAN mortality_asr_world_per_100k"
    )
    ax.legend()
    ax.grid(True, axis="y", alpha=0.3)
    fig.tight_layout()
    path = OUT / f"nordic_asr_mortality_by_sex_{year}.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path, year


def chart_age_specific_fi_vs_se(groups: dict[str, str]) -> Path:
    """Age-specific mortality rates FI vs SE, men and women, latest common year."""
    want = {"FI", "NORDIC-752"}
    data: dict[tuple[str, str, str, int], float] = {}
    with open(RAW / "nordcan.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["indicator_id"] != NORD_AGE:
                continue
            if row["region_id"] not in want:
                continue
            if row["sex"] not in ("M", "F"):
                continue
            if row["group_id"] not in AGE_ORDER:
                continue
            data[(row["region_id"], row["sex"], row["group_id"], int(row["year"]))] = float(
                row["value"]
            )

    years = sorted({y for (*_, y) in data})
    year = None
    for y in reversed(years):
        ok = all(
            (rid, sex, age, y) in data
            for rid in want
            for sex in ("M", "F")
            for age in AGE_ORDER
        )
        if ok:
            year = y
            break
    if year is None:
        # relax: require AGE_40_44..AGE_85_PLUS
        subset = [a for a in AGE_ORDER if a >= "AGE_40_44" or a.startswith("AGE_4") or a.startswith("AGE_5") or a.startswith("AGE_6") or a.startswith("AGE_7") or a.startswith("AGE_8")]
        subset = [a for a in AGE_ORDER if not a.startswith("AGE_0") and not a.startswith("AGE_1") and a not in ("AGE_20_24", "AGE_25_29", "AGE_30_34")]
        for y in reversed(years):
            ok = all(
                (rid, sex, age, y) in data
                for rid in want
                for sex in ("M", "F")
                for age in subset
            )
            if ok:
                year = y
                ages = subset
                break
        else:
            raise RuntimeError("No FI/SE age-specific year")
    else:
        ages = AGE_ORDER

    # Prefer ages 40+ for readability (lung deaths rare under 40)
    ages = [a for a in ages if a >= "AGE_40_44" or a in ("AGE_40_44", "AGE_45_49", "AGE_50_54", "AGE_55_59", "AGE_60_64", "AGE_65_69", "AGE_70_74", "AGE_75_79", "AGE_80_84", "AGE_85_PLUS")]
    # filter properly
    ages = [a for a in AGE_ORDER if a in {
        "AGE_40_44", "AGE_45_49", "AGE_50_54", "AGE_55_59", "AGE_60_64",
        "AGE_65_69", "AGE_70_74", "AGE_75_79", "AGE_80_84", "AGE_85_PLUS",
    } and all((rid, sex, a, year) in data for rid in want for sex in ("M", "F"))]

    labels = [groups.get(a, a) for a in ages]
    fig, axes = plt.subplots(1, 2, figsize=(12, 5.5), sharey=True)
    for ax, sex, title in (
        (axes[0], "M", "Men"),
        (axes[1], "F", "Women"),
    ):
        fi = [data[("FI", sex, a, year)] for a in ages]
        se = [data[("NORDIC-752", sex, a, year)] for a in ages]
        ax.plot(labels, fi, "o-", color="#1E4D8C", label="Finland", lw=2)
        ax.plot(labels, se, "s--", color="#C45C26", label="Sweden", lw=2)
        ax.set_title(title)
        ax.tick_params(axis="x", rotation=45)
        ax.grid(True, alpha=0.3)
        ax.set_xlabel("Age group")
    axes[0].set_ylabel("Deaths per 100,000 (age-specific)")
    fig.suptitle(
        f"Age-specific lung cancer mortality · Finland vs Sweden · {year}\n"
        "Sourced: NORDCAN mortality_age_specific_rate_per_100k · country level (not county)",
        fontsize=12,
        fontweight="bold",
    )
    axes[1].legend()
    fig.tight_layout()
    path = OUT / f"age_specific_mortality_FI_vs_SE_{year}.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path, year


def chart_county_deaths_count(regs: dict[str, dict]) -> Path:
    """Pooled death counts 2021–2024 by county (sex=T)."""
    totals: dict[str, float] = defaultdict(float)
    with open(RAW / "deaths.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["indicator_id"] != IND_COUNT or row["sex"] != "T":
                continue
            r = regs.get(row["region_id"], {})
            if r.get("level") != "wellbeing_services_county":
                continue
            y = int(row["year"])
            if y < 2021 or y > 2024:
                continue
            totals[short_county(r["name_en"])] += float(row["value"])

    ranked = sorted(totals.items(), key=lambda x: x[1], reverse=True)
    fig, ax = plt.subplots(figsize=(11, 7))
    names = [n for n, _ in ranked]
    vals = [v for _, v in ranked]
    colors = [
        "#C45C26" if n == "Satakunta" else "#1E4D8C" if n == "Kainuu" else "#7A8B9A"
        for n in names
    ]
    ax.barh(names[::-1], vals[::-1], color=colors[::-1])
    ax.set_xlabel("Deaths (count), pooled 2021–2024")
    ax.set_title(
        "Lung/trachea/larynx cancer deaths by wellbeing services county\n"
        "Pooled counts 2021–2024 · sex = both · Sourced: Statistics Finland (ksyyt)"
    )
    fig.tight_layout()
    path = OUT / "county_death_counts_2021_2024.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path


def write_md(paths: dict[str, Path], meta: dict) -> None:
    md = ROOT / "docs" / "MORTALITY_CHARTS.md"
    md.write_text(
        f"""# Mortality charts (Sourced only)

Generated by `scripts/plot_mortality_charts.py` from `raw/deaths.csv` and `raw/nordcan.csv`.

## What the dataset can and cannot show

| Cut | Available? |
|---|---|
| County × **crude** mortality (both sexes, all ages) | **Yes** — Statistics Finland ksyyt C32–C34 |
| County × **death counts** | **Yes** |
| County × **sex** | **No** in this extract (county rows are sex = T only) |
| County × **age** | **No** |
| Finland × sex × **age-standardised** rate | **Yes** (national only) |
| Nordic country × sex × age-specific / ASR | **Yes** — NORDCAN |

So “as specific as possible” here means: **county totals** for Finland’s map, and **country × sex × age** for Nordic comparison — not county×age×gender (that table does not exist in our files).

## Charts

### 1. County crude mortality (rate)
![county crude](charts/{paths['county_crude'].name})

### 2. County death counts (pooled)
![county counts](charts/{paths['county_counts'].name})

### 3. Finland age-standardised mortality by sex (national)
![asr sex](charts/{paths['fi_asr_sex'].name})

### 4. Nordic ASR mortality by country and sex ({meta['nordic_year']})
![nordic asr](charts/{paths['nordic_asr'].name})

### 5. Age-specific mortality Finland vs Sweden by sex ({meta['age_year']})
![age fi se](charts/{paths['age_fi_se'].name})

## Codes
- StatFin cause group: **C32–C34** (larynx + trachea + lung) — wider than lung-only.
- NORDCAN charts use NORDCAN lung mortality series as stored in `raw/nordcan.csv`.
""",
        encoding="utf-8",
    )


def main() -> None:
    style()
    regs = load_regions()
    groups = load_groups()
    p1 = chart_county_crude(regs)
    p2 = chart_county_deaths_count(regs)
    p3 = chart_national_asr_by_sex()
    p4, nordic_year = chart_nordic_asr_by_sex()
    p5, age_year = chart_age_specific_fi_vs_se(groups)
    write_md(
        {
            "county_crude": p1,
            "county_counts": p2,
            "fi_asr_sex": p3,
            "nordic_asr": p4,
            "age_fi_se": p5,
        },
        {"nordic_year": nordic_year, "age_year": age_year},
    )
    print("Wrote:")
    for p in (p1, p2, p3, p4, p5):
        print(" ", p)


if __name__ == "__main__":
    main()
