# CareGap FI

**A ready-made pilot for one wellbeing services county**

Junction 2026 · team NoTokens · cold-reader brief (2 pages)

---

## What this is

CareGap FI is a planning prototype that helps a Finnish wellbeing services county (*hyvinvointialue*) decide whether to run a measured experiment: let primary care refer selected patients straight to chest CT, and publish the pathway clock that Finland still does not report nationally.

It is not an AI diagnosis tool, not a patient chatbot, and not a medical device.

## Who it is for

Wellbeing services county pathway leads and FICAN planners who must choose whether to copy (or refuse) a Satakunta-style direct primary-care CT pathway this year.

Czech parallel for orientation: a *praktický lékař* generally cannot send a patient straight to CT. The Finnish primary-care doctor faces the same gate.

## The problem

**Nordic survival gap (Sourced).** For lung cancer in men, Finland’s five-year age-standardised relative survival is **17.9%** (95% CI 16.7–19.2) for diagnoses in 2020–2024. Sweden is **31.3%** (30.0–32.7). Finland sits last among the Nordics; the intervals do not overlap. Source: NORDCAN (C33–C34).

**Primary-care CT access (Sourced).** In Finland, a health-centre doctor can usually order a chest X-ray, but CT typically waits for a specialist referral. Peer Nordic pathways build primary-care or filter CT into the route by design (Acta Oncologica Nordic LC survey 2025; JTO Finland 2024; EU-JUST-CT; Swedish SVF / Danish pakkeforløb / Norwegian filterfunksjon).

**What peers publish vs Finland (Sourced).** Sweden, Denmark and Norway publish cancer-specific **pathway clocks**: share of lung pathways meeting day targets from pathway start / remiss to first treatment, often by region or hospital. Finland publishes cancer registration outcomes and a lung quality-registry *pilot* (stage completeness, treatment mix, regional shares). What a county manager still cannot open is “days from GP referral to CT report” or “% of lung pathways within X days to treatment start.” Missing clocks is not the same as “no register.” Detail: `REGISTER_COMPARE.md`.

## What the product is

A county experiment package. We are not asserting that Satakunta already works.

The pathway piece copies Satakunta-style direct primary-care chest CT for selected high-risk symptomatic patients. Local press describes about 170 patients and an impact study as ongoing; there is no peer-reviewed evaluation yet (Sourced: Satakunnan Kansa 2025).

The measurement piece pre-registers a process endpoint a county can actually collect: time from primary-care CT order to CT report.

The stop rule is hard: if expected demand exceeds CT and reporting capacity, do not announce the pathway. Shipping a longer queue counts as failure.

The demo software is an install wizard for that package (capacity check, equity sequencing notes, Monday brief, and an Evidence Void panel that refuses to invent national clocks Finland does not publish).

## What success looks like

| Claim type | Definition |
|---|---|
| Process success (Estimate) | Median (or agreed percentile) ≤ **10 calendar days** from primary-care CT order to CT report, for the pilot cohort |
| Operational stop | Rollout blocked when projected demand > available CT slots + reporting capacity |
| Learning success | Comparator pathway logged; stop-rule decisions documented; numbers labelled Sourced / Estimate / Unknown |

Ten days is a **pilot design target** (Estimate), chosen to sit near Swedish filter design times (5 days imaging + 1 day answer in SVF guidance) with room for local reporting. It is not a national standard Finland has already adopted.

## What we do not claim

We do not claim the pilot will move Finland’s stage mix, and we do not print “lives saved.” Satakunta press coverage is not an outcome study.

The only cluster-RCT of GP direct access to chest CT (Denmark, Guldbrandt et al. 2015) found no significant effect on stage at diagnosis or diagnostic interval (Sourced). That is why the product sells a measured rollout rather than a cure story.

We also refuse the “Finland ~17% stage I” line. That number is a selected university-hospital NSCLC subsample with recorded stage (Leskelä 2022), not a clean national stage I share. FCR/FICAN pilot data show large stage missingness; do not mash it against DK/NO registry stage I rates.

## Prototype disclaimer

Hackathon prototype for population-level pathway planning and education. Aggregate public data only. Not a medical device. Does not assess, diagnose, or triage any individual. Does not recommend medicines. Every figure is labelled **Sourced**, **Estimate**, or **Unknown**.

## Light citations

NORDCAN · Acta Oncologica 2025 (Nordic LC survey) · JTO 2024 (Lung Cancer in Finland) · EU-JUST-CT · REGISTER_COMPARE (SE NLCR/SVF, DK SST/DLCR, NO Helsedirektoratet, FI FCR/FICAN) · Satakunta press 2025 · Guldbrandt et al. BMC Cancer 2015 · Leskelä et al. 2022 (stage subsample warning)
