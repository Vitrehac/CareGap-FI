# Nordic lung pathway / quality-register display vs Finland

**Compiled:** 2026-11-14  
**Method:** Official authority pages and published PDFs (plus local `data/sources.json`). No invented stats.

## What this means for the CareGap pitch

Finland **does** publish cancer registration outcomes (incidence, mortality, survival) and now a **quality-registry pilot** for lung (stage completeness, curative-intent share, regional treatment mixes). The CareGap measurement gap is narrower and sharper: peers publish **cancer-specific pathway clocks** (days from pathway start / remiss to first treatment, by modality and region/hospital, against explicit targets). Finland’s published tables still do **not** let a wellbeing-services county manager read “days from GP referral to CT report” or “% of lung pathways within X days to treatment start.” Missing clocks ≠ missing register.

---

## Sweden (SE)

**Sources**

| Name | URL |
|---|---|
| Standardiserat vårdförlopp (SVF) lungcancer — ledtider | https://kunskapsbanken.cancercentrum.se/diagnoser/lungcancer/vardforlopp/ |
| Nationella lungcancerregistret (NLCR) — *Lungcancer — Nationell kvalitetsrapport för 2024* (Dec 2025) | https://cancercentrum.se/download/18.7d1de12419afcbb274f2d4c8/1765795067212/20251212_nlcr_nationell_rapport2024.pdf |
| NLCR interactive public report | https://statistik.incanet.se/Lunga/ |
| Vården i siffror — remiss→läkemedel within 40 days | https://vardenisiffror.se/sv/indikatorer/ledtid-fran-remissankomst-till-lakemedelsbehandling-vid-lungcancer |

**What you see on the page/report**

- **SVF description:** filterfunktion = lung X-ray *or* CT before full pathway; recommended pre-SVF times (remiss decision→arrival 1 day; arrival→imaging **5** days; imaging→answer **1** day). National follow-up clocks (80% target): välgrundad misstanke→start of drug treatment **40** calendar days; →surgery/radiotherapy **44** days; →palliative symptom treatment **30** days. Optional local codes include first specialist visit and MDK.
- **NLCR annual PDF + interactive dashboard:** coverage (~98%), stage, treatment, EGFR testing by hospital, **ledtider** tables/figures: share starting treatment within SVF times; median days remiss arrival→treatment by hospital; remiss→first visit.
- **Vården i siffror:** public process indicator for % drug treatment within 40 days (NLCR source; target ≥80%).

**Example figures (cited)**

1. Against 80% target, **36%** started drug treatment within **40** days from remiss arrival; **10%** started surgery or radiotherapy within **44** days (NLCR 2024 report, data extract 2025-09-26). Hospital share for drug pathway **8%–68%**.
2. Median remiss→any active treatment varies **28–98** days by unit; national median surgery ~**74** days, radiotherapy longer (~**80** days to median for the surgery/RT group in report narrative).
3. Registry coverage ~**98%** / interactive site ~**97%** of diagnosed cases.

**Can a county (region) manager answer days from GP to CT report?**  
**No** as a routinely published GP→CT attainment KPI. Filter **design** times exist (5+1 days), but the headline public tables are **remiss / välgrundad misstanke → treatment start** (and remiss→first visit), not county-level “GP order → CT report” clocks.

---

## Denmark (DK)

**Sources**

| Name | URL |
|---|---|
| SST — *Monitorering af forløbstider på kræftområdet: Årsopgørelse for 2025* (landing) | https://www.sst.dk/udgivelser/2026/monitorering-af-forloebstider-paa-kraeftomraadet-aarsopgoerelse-for-2025 |
| Same report PDF | https://www.sst.dk/media/b5llddpn/monitorering-af-forloebstider-paa-kraeftomraadet-aarsopgoerelse-for-2025.pdf |
| SST — *Pakkeforløb for lungekræft* (Jan 2025) — standard times | https://www.sst.dk/media/estk2oo1/pakkeforloeb-for-lungekraeft-jan-2025.pdf |
| Dansk Lunge Cancer Register — Årsrapport 2024 | https://www.sundk.dk/media/g4jjmajz/dlcr-aarsrapport-2024-offentliggjort-version-25-06-2025.pdf |

**What you see on the page/report**

- **SST forløbstider (quarterly + annual):** national and **by region**, % of pathways from *henvisning til pakkeforløb* to *start of initial treatment* within standard time, split by **kirurgi / medicinsk / stråle** for lung (B26). Tables flag regions under the national 1st quartile; also share of pathways where cancer suspicion is ruled out.
- **Pakkeforløb PDF:** exact standard calendar-day clocks (see examples).
- **DLCR:** clinical quality register — incidence, stage-related quality, **1-/2-/5-year survival by region**, treatment/process indicators (complement to SST clocks, not a substitute).

**Example figures (cited)**

1. Standard total times (SST pakkeforløb Jan 2025, Tabel 1): henvisning→initial treatment **44** days (surgery), **41** (drug), **45** (radiotherapy); sub-clocks e.g. henvisning→first attendance **6** days, first attendance→end of work-up **24** days.
2. Lung B26 **2025** attainment (SST årsopgørelse §4.23): surgery within standard **77%** national (Sjælland **53%**, Syddanmark **86%**); drug **86%** national (Sjælland **73%**, Syddanmark **94%**); radiotherapy **70%** national (Sjælland **49%**, Syddanmark **85%**). Suspicion ruled out in **58%** of lung pathway episodes.
3. DLCR 2024: national 5-year survival **25.3%** (2019 cohort); regions **23.3%–28.5%**; 1-year survival **58.7%** (2023 cohort).

**Can a county (region) manager answer days from GP to CT report?**  
**No** for that exact primary-care imaging clock in the SST tables. **Yes** for “% of lung pathways from pathway referral to treatment start within 41–45 days,” **national + by region**, every year/quarter.

---

## Norway (NO)

**Sources**

| Name | URL |
|---|---|
| Helsedirektoratet QI — Pakkeforløp for 24 organspesifikke kreftformer | https://www.helsedirektoratet.no/statistikk/kvalitetsindikatorer/kreft-behandling-og-overlevelse/pakkeforl%C3%B8p-for-26-organspesifikke-kreftformer |
| Pakkeforløp lungekreft — Filterfunksjon | https://www.helsedirektoratet.no/nasjonale-forlop/lungekreft/inngang-til-pakkeforlop-for-lungekreft/filterfunksjon |
| Forløpstider (handlingsprogram table) | https://nlcg.no/wp-content/uploads/230106-Nasjonalt-handlingsprogram-for-lungekreft-mesoteliom-og-thymom.pdf |
| FHI — Pakkeforløp for kreft (Power BI / NPR) | https://www.fhi.no/he/npr/statistikk-npr/pakkeforlop-for-kreft/ |
| Helse Vest internal audit of pakkeforløp (2024 lung OF tables) | https://www.helse-vest.no/4a5cbd/contentassets/7b08f25571d846ffbcbcf40af13cf76a/internrevisjon-av-pakkeforlop-for-kreft.pdf |

**What you see on the page/report**

- **Defined clocks (OF1–OF4)** for lung: henvisning mottatt→first attendance (**7** days); →end of work-up (**21**); →treatment start (**14** surgery/RT, **7** drug); total henvisning→treatment (**42** surgery/RT, **35** drug). Target: **70%** of pathways within standard time.
- **Helsedirektoratet QI page (live):** states **no regional health authority** met the 70% target in **2023–2025**; **national disease-specific charts currently suspended** pending NPR reporting-error correction (Helse Midt journal-system issues affect 2022–2025).
- **FHI:** Power BI dashboard of pathway time indicators (when published); news citing FHI reported **65%** of *all* cancer pathways within standard time in **2024** (Dagens Medisin 16 Jan 2025 — secondary).
- **Filterfunksjon:** CT thorax (or chest X-ray) without delay on clinical suspicion — pathway *policy*, not a published day-count table by county.

**Example figures (cited)**

1. National target **70%** within standard forløpstid; **no RHF** reached it **2023–2025** (Helsedirektoratet QI page, accessed 2026-11-14). Live page: detailed national lung % **not currently published** (suspension notice).
2. Helse Vest audit, lung **2024** OF4 (henvisning→treatment within 42/35 days): Bergen **57%**, Stavanger **57%**, Førde **68%**, Fonna **54%** — none at 70%.
3. Clock lengths as above (handlingsprogram Table 1).

**Can a county (HF/RHF) manager answer days from GP to CT report?**  
**No** as a published GP→CT KPI. **Yes in principle** for specialist-pathway OF clocks (and regionally yes where audits/FHI still show numbers); **national live QI tables for lung are presently blank/suspended**.

---

## Finland (FI)

**Sources**

| Name | URL |
|---|---|
| FCR/FICAN/THL — *Lung Cancer in Finland 2019–2023* (HTML factsheet) | https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html |
| FICAN — Cancer quality registry project | https://fican.fi/en/what-we-do/quality-and-monitoring/cancer-quality-registry-project/ |
| Finnish Cancer Registry / NORDCAN (incidence & survival context) | https://nordcan.iarc.fr/ |

**What IS shown**

- Population lung cases **2019–2023** (n=**14 873**): age/sex, histology, method of confirmation, **stage-data completeness**, MDT coding coverage, first-year **curative / non-curative / palliative** treatment shares, 1-year overall survival by sex and treatment group — with breakdowns by **yhteistyöalue** and **hyvinvointialue**.
- Honest pathway-adjacent content: treatment *mix* and documentation quality (e.g. stage missing, MDT codes), not timed referral clocks.

**What is NOT shown**

- No national/regional **days** from GP referral → CT report → specialist → treatment start for lung.
- Methods state **primary-care (avohoito) visits are not in the dataset**.
- No SVF/pakkeforløb-style “% within X days” lung KPI by wellbeing services county.

**Example of what a published FI table looks like**

From Taulukko 4 (stage classification, all new lung cancers 2019–2023):

| Levinneisyysluokitus | n | % |
|---|---:|---:|
| TNM | 4055 | 27.3 |
| Sanallinen | 860 | 5.8 |
| Stage | 249 | 1.7 |
| Syre-levinneisyys | 2612 | 17.6 |
| **Ei tietoa** | **7097** | **47.7** |

Also: localized disease ~**5%** of all / ~**11%** of those with usable stage info; curative-intent first treatment **27.0%** (4009/14873); 1-year OS women **47%** vs men **37%**.

**Can a wellbeing-services county manager answer days from GP to CT report?**  
**No.**

---

## Compact comparison

| Country | Primary public product | Pathway clocks published? | Example metric a manager can open today | GP → CT report days by county? |
|---|---|---|---|---|
| **SE** | NLCR + SVF + Vården i siffror | **Yes** — remiss/suspicion → treatment (40/44 d, 80% target); hospital/region views | 2024: **36%** drug ≤40 d; **10%** surgery/RT ≤44 d | **No** (filter design times only) |
| **DK** | SST forløbstider + DLCR | **Yes** — henvisning → treatment by modality **+ region** | 2025 lung: surgery **77%** / drug **86%** / RT **70%** within 44/41/45 d | **No** |
| **NO** | Helsedirektoratet QI + FHI Power BI | **Yes by design** (OF1–OF4); **national live tables suspended** (NPR error) | Target **70%**; Helse Vest 2024 lung OF4 e.g. Bergen/Stavanger **57%** | **No** |
| **FI** | FCR + FICAN quality-registry **pilot** | **No** cancer-specific day clocks | Stage missing **47.7%**; curative-intent **27%**; regional treatment mixes | **No** |

---

## Pitch-safe one-liner

**Peers publish % of lung pathways meeting day-clocks to treatment (by region/hospital); Finland’s newest lung quality report still publishes stage completeness and treatment mix — not referral→CT→treatment days by wellbeing services county.**

---

## Citation discipline

- All numbers above are from the linked primary PDFs/HTML (or clearly labelled secondary for NO 65% all-cancers news).
- Norway national lung % (e.g. older “57% national” notes in team vault) **should not be asserted from the live Helsedirektoratet QI page** while publication is suspended; use clocks + target + Helse Vest OF4 instead.
- No new `data/*.json` extract added: figures are already noted under `data/sources.json` nordic-pathway IDs; inventing a parallel dataset would risk drift from PDF wording.
