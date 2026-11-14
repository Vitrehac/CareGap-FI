# Finding — inverse care in targeted lung cancer treatment

Computed 2026-11-14 from the team dataset (`raw/kela.csv`, `raw/deaths.csv`, `raw/dim_region.csv`).
Script: [`scripts/targeted_access.py`](scripts/targeted_access.py). Reproducible with `python scripts/targeted_access.py`.

## What we measured

For each wellbeing services county, people holding Kela reimbursement rights for targeted
lung cancer medicines (osimertinib, alectinib, brigatinib, lorlatinib, entrectinib, tepotinib,
selpercatinib, pralsetinib, erlotinib, afatinib/gefitinib), divided by lung/trachea/larynx
cancer deaths (C32–C34), pooled 2021–2024.

Kela issues an old and a new code for the same drug and the same people. The dataset README
warns against summing them; we take the larger of each pair per county-year. Without that
de-duplication every figure roughly doubles.

Population is derived as `deaths_count / crude_mortality_per_100k * 100000`.

## Result

National average: **28.7 reimbursement-years per 100 lung cancer deaths** (2706 / 9420).

Across the 21 counties with at least 150 pooled deaths (Åland and its 61 deaths excluded as too small):

| | per 100 deaths |
|---|---|
| Lowest (Lapland) | 18.2 |
| Bottom quartile mean | 18.9 |
| Median | 26.7 |
| Top quartile mean | 41.2 |
| Highest (South Karelia) | 52.4 |

Spread lowest to highest: **2.9x**. Quartile to quartile: **2.2x**.

Lowest five: Lapland 18.2, Kainuu 18.4, North Karelia 18.7, South Savo 19.2, East Uusimaa 20.1.
Highest five: South Karelia 52.4, Ostrobothnia 42.6, Southwest Finland 39.7, Kanta-Häme 36.9, Vantaa and Kerava 34.1.

## The part that matters

Access correlates **negatively** with need.

- vs lung cancer crude mortality: **r = −0.42**
- vs COPD reimbursement prevalence: **r = −0.38**

The counties losing the most people to lung cancer, and carrying the most chronic respiratory
disease, are the counties where fewest patients end up on targeted medicines. Lapland, Kainuu
and South Savo appear at the wrong end of all three measures.

Meanwhile regional five-year survival for major cancers is reported as statistically flat.
Survival looks equal; access does not.

## Confounds — state these before anyone asks

1. **Age structure.** Crude mortality is not age-standardised, and age-standardised figures are
   only published nationally in this dataset. Older populations have both higher crude mortality
   and lower eligibility for targeted therapy. Part of the gap is demography, not inequity.
2. **Biomarker prevalence.** EGFR and ALK alterations are more common in younger patients and
   never-smokers. Counties with heavier smoking histories genuinely have fewer eligible patients.
3. **Deaths are not incidence.** Mortality lags diagnosis and is a crude proxy for need.
4. **C32–C34 is wider than lung.** It includes larynx and trachea.
5. **Reimbursement rights are not delivered treatment**, and hospital-administered therapies do
   not appear in Kela outpatient data at all.
6. **Small numbers.** With 21 counties, r = −0.42 is suggestive, not significant. Single-year
   values swing hard in small counties (South Savo: 10.5 in 2022, 26.7 in 2024).

So this is a **prioritisation signal, not proof of inequity**. That phrasing goes in the UI.

## Why this is the product

The signal sits exactly where the challenge asks us to look — diagnosis and treatment initiation —
and the candidate mechanisms are all addressable:

- **Late presentation / delayed work-up (plausible, not proven causal).** A patient found with
  advanced disease in poor condition never starts targeted therapy. Upstream system feature:
  Finland’s GPs generally cannot refer to CT (Acta 2025; JTHO 2024; EU-JUST-CT); SE/DK/NO
  allow primary-care / filter CT. Satakunta already runs a direct primary-care CT pathway —
  press-only, unevaluated (`satakunta-kansa-2025`).
- **Molecular testing capacity.** No biomarker result means no targeted option. The IHE Cancer
  Dashboard independently recommends expanding multi-gene (NGS) testing capacity in Finland.
- **Measurement gap (phrase carefully).** FICAN/THL/FCR quality-registry pilot reports exist;
  what is missing is a mature clinical cancer quality register with cancer-specific pathway
  clocks comparable to DLCR / NLCR / SNLCR. Goal 3.2 calls for that; funding was cut.

Three recommendations, one finding, all sourced. Honesty check: `VERIFICATION.md`.

---

## Locked product thesis (post-verification, 2026-11-14)

**Keep (solid):**
- NORDCAN survival gap: Finland last / near-last for lung-cancer five-year relative survival.
- Primary-care CT restriction in Finland is real (Acta survey + JTHO + EU-JUST-CT).
- SE / DK / NO pathways allow primary-care or filter CT.
- Measurement gap is real if phrased as: no mature clinical lung quality register + no
  cancer-specific national pathway clocks (pilot work exists).

**Weaken (causal):**
- Do not claim that direct GP CT alone will shift stage or survival. Guldbrandt 2015
  cluster-RCT was null on stage and diagnostic interval (`guldbrandt-ldct-rct-2015`).
- Satakunta is interesting local practice, not proven impact.

**Product 2+1 (fundability answer):** County pilot = Satakunta-style direct primary-care CT
**plus** a measurement layer (pre-registered process endpoint, comparator, stop rules)
precisely *because* outcome evidence is weak and Satakunta is unevaluated.

### Do not claim on stage / pitch

- “Finland ~17% stage I vs >25% DK/NO” as a clean Acta / national-registry comparison.
- Acta 2025 itself measures national stage (it does not; it cites others).
- Leskelä 17% as Finland’s population stage I share (it is among a selected
  university-hospital NSCLC subsample with recorded stage only).
- FCR “localized ~5–6% of all” as equivalent to “17% stage I.”
- “Finland cannot measure anything” (FICAN/THL/FCR pilot exists).
- STUK ~19:1 chest X-ray:CT as causal proof of under-diagnosis.
- Satakunta outcomes, stage shift, or “lives saved.”
