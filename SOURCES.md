# Sources — CareTwin FI

Master citation list for the demo. Machine-readable twin: [`data/sources.json`](data/sources.json).  
**Rule:** every on-screen number must map to an `id` below (or be tagged Estimate / Mock with assumptions file).

Accessed / compiled: **2026-11-13**. Do not invent URLs or figures; if unsure, leave blank and ask.

---

## A. Strategy & challenge

| ID | Title | URL | Use in product |
|---|---|---|---|
| `fican-strategy-2026` | National Cancer Strategy 2026–2035 (Finland) | https://fican.fi/wp-content/uploads/2026/01/National_Cancer_Strategy_2026-2035_Finland.pdf | Goal 3 indicators & sub-objectives |
| `thl-ohjaus-21-2016` | THL Ohjaus 21/2016 — target times for care | *(cite official THL Ohjaus 21/2016 document; confirm URL before UI)* | Context for “treated within target times” |

---

## B. Outcomes, Nordics, pathway (clinical / health-econ)

| ID | Title | URL | Use in product |
|---|---|---|---|
| `ihe-dashboard-finland-2026` | IHE Cancer Dashboard Finland | https://ihe.se/app/uploads/2026/04/IHE-Cancer-Dashboard-Finland_.pdf | Nordic survival context; CT scanners/exams; primary-care CT access |
| `nordcan` | NORDCAN (cancer stats) | https://nordcan.iarc.fr/ | Underlying survival comparisons (via IHE/NORDCAN figures we paste — do not invent) |
| `acta-oncol-nordic-lc-2025` | Comparative study of lung cancer care and survival across the Nordic countries | https://doi.org/10.2340/1651-226x.2025.42778 | Survey: primary-care waits + CT access; stage line is cited mash-up — see Leskelä / Gouliaev |
| `jtho-lung-finland-2024` | Lung Cancer in Finland (JTO) | https://doi.org/10.1016/j.jtho.2024.06.005 | Pathway; limited CT in primary care |
| `aalto-lc-pathway-delays` | Delays in the diagnostic pathway of lung cancer… (Aalto) | https://aaltodoc.aalto.fi/bitstreams/7a3fc0ca-7013-48df-bc69-29fb7183dc50/download | Delay sources; CT availability argument |
| `satakunta-kansa-2025` | Sata-alue direct CT pathway (~170 patients) | https://www.satakunnankansa.fi/satakunta/art-2000012403607.html | Pilot facts; impact study ongoing (press only; unevaluated) |
| `gouliaev-registries-2023` | Lung cancer registries DK/FI/NO/SE comparison | https://doi.org/10.1080/0284186X.2023.2172687 | FI Local 6% / Unknown 47%; DK/NO stage I ~25–26% — stage-claim honesty |
| `leskela-nsclc-treatment-2022` | Trends in NSCLC treatment Finland 2014–2019 | https://doi.org/10.1080/0284186X.2022.2042474 | Source of “17% stage I”: among staged university-hospital subsample only |
| `guldbrandt-ldct-rct-2015` | Direct GP access to CT — cluster-RCT | https://doi.org/10.1186/s12885-015-1941-2 | Null on stage / diagnostic interval |
| `eu-just-ct-finland-gp` | CT referral guidelines adherence (seven-country audit) | https://doi.org/10.1007/s00330-024-11325-y | “In Finland, GPs cannot refer to CT” |
| `no-hdir-filterfunksjon-lc` | Pakkeforløp lungekreft — Filterfunksjon | https://www.helsedirektoratet.no/nasjonale-forlop/lungekreft/inngang-til-pakkeforlop-for-lungekreft/filterfunksjon | NO primary-care CT filter |
| `dk-sst-lungekraeft-2025` | Pakkeforløb for lungekræft (Jan 2025) | https://www.sst.dk/media/estk2oo1/pakkeforloeb-for-lungekraeft-jan-2025.pdf | DK GP/referrer CT on suspicion |
| `dk-sst-diagnostisk-pakkeforloeb-2023` | Diagnostisk pakkeforløb (Dec 2023) | https://www.sst.dk/media/1odjlxo2/diagnostisk-pakkeforloeb_final_-opdateret-dec-2023docx.pdf | DK GP direct diagnostic CT-TAB |
| `andersson-sweden-dci-2020` | Swedish lung survival with/without DCI cases | https://doi.org/10.1080/0284186X.2020.1826572 | DCI bias shrinks naive SE–FI gap |
| `fcr-fican-lung-2019-2023` | Lung Cancer in Finland 2019–2023 (quality registry pilot) | https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html | Stage missing ~48%; localized ~5% of all |
| `fican-quality-registry-project` | Cancer quality registry project | https://fican.fi/en/what-we-do/quality-and-monitoring/cancer-quality-registry-project/ | FCR–THL–FICAN pilot exists; mature register still missing |
| `jensen-cpp-prognosis-2017` | Prognostic consequences of Danish CPP | https://doi.org/10.1186/s12885-017-3623-8 | Whole-pathway reform effect; not GP-CT alone |
| `cancer-finland-2024` | Cancer in Finland 2024 (regional survival flat — as briefed) | *(confirm official Finnish Cancer Registry / report URL before UI)* | “Regional survival flat” claim |
| `bmj-ph-equity-2025` | BMJ Public Health 2025 — education/language gaps (as briefed) | *(confirm exact article URL before UI)* | Equity strip |
| `torkki-acta-2025` | Torkki et al., Acta Oncologica 2025 — primary-care bottleneck (as briefed) | *(confirm DOI/URL before UI)* | ~2 weeks primary care; nurse first contact |

---

## C. Sotkanet / THL open indicators

Base: https://sotkanet.fi/ · REST CSV example:  
`https://sotkanet.fi/rest/1.1/csv?indicator=3625&years=2023&genders=total`  
Regions: `https://sotkanet.fi/rest/1.1/regions`

| ID | Indicator | Code | Topic |
|---|---|---|---|
| `sotkanet-3620` | Screening-related | 3620 | Screening (Goal 2 context / equity only) |
| `sotkanet-3621` | Screening-related | 3621 | Screening |
| `sotkanet-6103` | Screening-related | 6103 | Screening |
| `sotkanet-3625` | 5-yr survival breast | 3625 | Survival (note: breast ≠ poor-prognosis Goal 3 core) |
| `sotkanet-3626` | 5-yr survival cervical | 3626 | Survival |
| `sotkanet-3627` | 5-yr survival bowel | 3627 | Survival |
| `sotkanet-10024` | Cancer mortality | 10024 | Goal 3 mortality context |

Fetch once → `/data/sotkanet/`. If API returns 403, paste published values and still cite indicator + Sotkanet.

---

## D. Law & regulation (product boundary)

| ID | Title | URL | Use |
|---|---|---|---|
| `mdcg-2019-11` | MDCG 2019-11 — Qualification & classification of software (MDR/IVDR) | https://health.ec.europa.eu/system/files/2025-06/mdcg_2019_11_en.pdf | What is / isn’t MDSW; Rule 11; cancer risk example |
| `mdr-2017-745` | Regulation (EU) 2017/745 Medical Devices | https://eur-lex.europa.eu/eli/reg/2017/745/oj | Device definition |
| `ai-act-2024-1689` | Regulation (EU) 2024/1689 AI Act | https://eur-lex.europa.eu/eli/reg/2024/1689/oj | High-risk AI |
| `ai-act-annex-iii` | AI Act Annex III (service desk) | https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3 | Triage / essential healthcare services |
| `ec-mdr-aia-qa` | Commission Q&A — MDR/IVDR and AI Act | https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en | MDAI high-risk conditions |
| `fimea-ai-md` | Fimea — Using AI in medical devices | https://fimea.fi/en/medical-devices/using-artificial-intelligence-in-medical-devices | FI competent authority view |
| `pmc-cdss-mdr` | CDSS and new regulatory frameworks (viewpoint) | https://pmc.ncbi.nlm.nih.gov/articles/PMC10105190/ | Rule 11 class floor explanation |
| `findata-legislation` | Findata — Secondary Use Act legislation | https://findata.fi/en/services-and-instructions/legislation/ | Act 552/2019; no marketing use |
| `findata-permits` | Findata — Permits | https://findata.fi/en/permits/ | When permit needed |
| `lvv-secondary-env` | LVV — Secure operating environments (secondary use) | https://lvv.fi/en/healthcare-and-social-welfare/operating-environments | Astori / secure env |
| `tietosuoja-healthcare` | Data Protection Ombudsman — Health care FAQ | https://tietosuoja.fi/en/faq-health-care | Confidentiality; Kanta sharing consent |
| `kanta-repository` | Kanta — Patient Data Repository | https://www.kanta.fi/en/professionals/patient-data-repository | How real sharing works |
| `ibanet-telemed-fi` | IBA healthcare telemedicine survey — Finland (Krogerus) | https://www.ibanet.org/document?id=Healthcare-Telemedicine-Survey-Finland | Telemedicine = normal care; Patient Act |
| `lvv-etapalvelut` | LVV — Remote services in social and health care | https://lvv.fi/sosiaali-ja-terveydenhuolto/etapalvelut | Remote care requirements |
| `ai-act-prohibited-guide` | Commission guidelines on prohibited AI practices | https://ai-act-service-desk.ec.europa.eu/sites/default/files/2026-01/guide-prohibited_en.pdf | Art. 5 context |
| `pmc-ai-act-healthcare` | Navigating the EU AI Act for Healthcare | https://pmc.ncbi.nlm.nih.gov/articles/PMC11319791/ | Annex III triage note |

---

## E. Team-briefed figures (pin to a source before UI ship)

These appeared in the team challenge brief. **Do not show in UI until matched to a row above or a verified URL.**

- Finland lowest Nordic 5-yr survival; lung 17% men / 29% women vs Norway 30% / 37% → prefer `ihe-dashboard-finland-2026` / NORDCAN.
- Regional 5-yr survival flat (prostate, breast, colorectal, lung) → `cancer-finland-2024`.
- ~2 weeks to primary-care appointment; 40–60% first see nurse; CT waits → `torkki-acta-2025` / `acta-oncol-nordic-lc-2025`.
- ~~Do not pitch~~ “FI ~17% stage I vs >25% DK/NO” as a clean Acta/registry fact. Leskelä 17% = staged university-hospital NSCLC subsample; FCR has ~47% unknown stage and localized ~5–6% of all (`leskela-nsclc-treatment-2022`, `gouliaev-registries-2023`, `fcr-fican-lung-2019-2023`). See `VERIFICATION.md`.
- Satakunta ≥20 pack-years + symptoms; ~170 patients; impact study ongoing → `satakunta-kansa-2025` (UI: “high-risk patients”).
- ~15% Satakunta colon-cancer emergency surgery → need dedicated source before UI.
- Colorectal screening 2025: domestic languages 74.3% vs other 54.2%; basic ed 61.3% vs tertiary 79.2% → `bmj-ph-equity-2025`.
- ~13 300 cancer deaths/year; Goal 3 −10% → `fican-strategy-2026` / `sotkanet-10024`.

---

## Citation UX

- Chip **Sourced** → opens source card (`id`, title, URL, date).
- Chip **Estimate** → links `data/model-assumptions.json`.
- Chip **Mock** → `Mock: grounded in [source id]`.
