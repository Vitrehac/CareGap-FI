# Google Sheet → CareTwin mapping

**Sheet:** [Rakovina plic ve Finsku — data a profil rizika](https://docs.google.com/spreadsheets/d/1ta7d4isTyBSuIla1tEsTvw-cU_-8wj4PkBRAHjoBizk/edit?gid=713623530#gid=713623530)  
**Updated:** 2026-11-13 · Machine-oriented lung data vault (risk model + regional facts)

## Hard rule

| Use in demo | Do **not** ship in demo |
|---|---|
| Population / county / pathway tables | Individual probability UI (`model_spec`, PLCOm2012 person inputs, “your 6-year risk”) |
| Goal 3 targets, NORDCAN, Sotkanet, lit pathway numbers | Triage / LDCT eligibility for a named person |
| `foreign_parameters.finland_availability` as **Evidence Void** | Anything that says “this patient should be scanned / wait” |

Individual risk math in the sheet is useful **offline research**; putting it in the product = MDR medical-device lane we rejected.

---

## Tabs (from workbook)

README · model_spec · model_test_cases · model_constants · risk_factor_weights · plcom2012_coefficients · goal3_targets · lit_values · foreign_parameters · data_source_catalog · dim_indicator · dim_region · dim_group · dim_source · fact_statfin_deaths · fact_nordcan · fact_kela_reimbursement · fact_nocca_occupation · fact_sotkanet_01..05 · fact_paavo_* 

---

## What feeds CareTwin (Pathway Deployer)

| Sheet tab | Product use |
|---|---|
| `goal3_targets` | Goal 3 strip (T01 lung +14 pp, T04 mortality −10%, pathway times T11–T13) |
| `fact_nordcan` | Nordic survival / incidence baseline (sourced gap) |
| `fact_sotkanet_*` | County/muni aggregates for deploy context (not individual RR) |
| `dim_region` | Wellbeing services county list + hierarchy |
| `lit_values` | Single pathway facts (delays, Satakunta-type numbers) |
| `foreign_parameters` | Nordic pathway benchmarks + **Finland availability** → Evidence Void |
| `data_source_catalog` | `/sources` enrichment |
| `fact_statfin_deaths` | Mortality context (note C32–C34 caveat in README) |
| `fact_paavo_*` | Equity / postal socioeconomic context (aggregate only) |

## Leave in the vault (not UI)

`model_spec` · `plcom2012_coefficients` · `risk_factor_weights` · `model_constants` · `model_test_cases` · per-person radon/smoking calculator · occupation SIR as individual multiplier (README caveat: double-counts smoking)

Optional later (population only, careful copy): `fact_nocca_occupation` as “counties with high-SIR occupation mix → equity-first deploy” — **not** “welders get cancer score.”

---

## Uniqueness boost from this sheet

`foreign_parameters` already encodes what Finland **cannot** feed into UK-style risk tools (`permit_only`, `no`, `aggregate_only`). That is the Evidence Void: we don’t fake PLCOm on Finns; we show the data wall and deploy Satakunta + Goal 3.2 measurement instead.
