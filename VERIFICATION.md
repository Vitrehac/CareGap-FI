# Adversarial verification — Finnish lung cancer / primary-care CT thesis

**Date:** 2026-11-14  
**Scope:** Stress-test of the Liwe / Equal Care Across Finland problem framing.  
**Method:** Primary sources preferred (peer-reviewed papers, national authority pathway documents, registry reports). Secondary sources labelled as such. Nothing unverified is stated as fact.

---

## 1. VERDICT

The **survival gap is real**: NORDCAN and multiple peer-reviewed Nordic comparisons consistently place Finland last (or near-last) for lung-cancer five-year relative survival, and Finland’s gains have been smaller than Denmark/Norway/Sweden. The **primary-care CT access gap is also real** as a system feature (Finland’s GPs generally cannot refer to CT; SE/DK/NO pathways explicitly allow primary-care CT as a filter step).  

However, the thesis is **weaker than the team’s notes imply on the causal chain**. The load-bearing Acta Oncologica 2025 paper is a **small HCP survey + expert workshop**, not a registry analysis of stage; its oft-quoted “17% stage I vs >25%” figure **mis-pairs a selected Finnish university-hospital subsample with incomplete staging against national Nordic quality-registry stage I rates**. Finland’s own Cancer Registry / FICAN quality-registry pilot shows **~48% missing stage** and reports only **~5% of all cases as localized** (not 17% stage I). The **only cluster-RCT** of GP direct access to chest CT (Denmark, Guldbrandt et al. 2015) found **no significant effect on stage or diagnostic interval**. Satakunta’s pathway has **no published formal evaluation** beyond journalism saying an impact study is ongoing. So: problem of poor survival and restricted primary-care CT access = real; “late diagnosis caused by no primary-care CT, proven by 17% stage I, fixed by letting GPs order CT” = **plausible but under-evidenced**, and easy for an oncology mentor to puncture.

---

## 2. Task A — Acta Oncologica Nordic LC 2025 (`acta-oncol-nordic-lc-2025`)

**Paper verified (open access):** Khalife G, Waris J, Bødtger UCS, et al. *Comparative study of lung cancer care and survival outcomes across the Nordic countries.* Acta Oncologica. 2025;64:734–741. DOI [10.2340/1651-226X.2025.42778](https://doi.org/10.2340/1651-226x.2025.42778). Pages 734–741.

### What the paper is (and is not)

- **Design:** Finnish expert workshop (n=6) → REDCap survey of Nordic HCPs → Nordic expert workshop (invited n=10).  
- **Analysed survey responses:** 42 (21 hospital, 10 primary care, 11 both). Coverage claimed: 30/58 Nordic healthcare regions. **Finland: 12 respondents covering 8/21 regions.**  
- It does **not** analyse NORDCAN microdata, stage registries, or patient-level pathways. Stage numbers are **cited from other papers**, not measured in this study.  
- Co-author **Susanna Nurmi-Rantala, MSD (Finland)** — industry affiliation on the author list (relevant for mentor scrutiny).

### Exact statements on primary care, CT, waits

**Abstract / Results (p. 734):**  
> “Four key differences in care practices between Finland and other Nordic countries were identified: (1) resources available in primary care units, (2) waiting times in primary care, (3) availability of novel treatments and (4) tracking of LC survival and mortality outcomes by the hospital. Finland has the lowest access to computed tomography (CT) from primary care, longest waiting times in primary care, and lacks a national outcome tracking system.”

**Access to imaging (Results, ~p. 737):**  
> “The availability of diagnostic imaging modalities in primary care was uniform across the Nordic countries except for CT scanning. Only one respondent from Finland reported that they have CT scan as an imaging option in primary care in the region. In other Nordic countries, CT scanning was more readily available (Figure 1). The Nordic experts agreed that the availability of CT scanning in primary care is likely to affect LC survival.”

**Waiting times (Table 2 mode of reported waits):**

| Step | Finland | Sweden | Denmark | Norway | Iceland |
|---|---|---|---|---|---|
| Appointment at health centre for LC symptoms (days) | 14 | 2–7 | 2–7 | 2–7 | 2–7 |
| Specialist consultation after GP (weeks) | 2–4 | 1–2 | 1–2 | 1–2 | 2–3 |
| LC diagnosis after specialist consultation (weeks) | 4 | 4 | 2–4 | 2–4 | 1–2 |
| Share meeting a doctor at first contact | 40–60% | 80–100% | 100% | 100% | 100% |

**Important internal caveat (Results, Waiting time):**  
> “The Nordic experts concurred that a few weeks difference in waiting times does not explain the difference in LC survival.”

Finnish experts also said the survey’s 14-day primary-care wait “might be optimistic” and that it often takes “up to a month” in many regions.

**Paper’s own explanation for Finland’s results (Discussion / CT scanning and early diagnosis, ~p. 738):**  
> “The most notable difference was Finland’s lack of CT scanning usage in primary care for patients with LC related symptoms. In Finland, CT scans are typically only accessible after referral to secondary care, often following a suspicious chest X-ray finding. … This is reflected in the comparatively low proportion of early-stage diagnoses in Finland, where only 17% of patients are diagnosed at stage I, compared to over 25% in Denmark and Norway [15, 22]. Nonetheless, stage at diagnosis is inconsistently recorded in Finnish cancer registries [22], which may indicate even greater underdetection of early-stage disease.”

**Causal humility (Conclusions, p. 740):**  
> “Although the differences in care practices discussed in this study may contribute to variations in survival rates, their causal relationships and precise impact require further investigation.”  
> “the differences identified as potentially impacting survival rates remain hypothetical”

Also flags: Swedish 1-year survival may be overestimated by 2–3 pp because SCR excludes death-certificate-initiated cases; ECOG missing for 70% of Finnish patients in cited work; male share of LC patients higher in Finland (60%) than other Nordics (45–51%).

### Exact stage distribution — what the paper reports vs what the citations show

**The Acta 2025 paper does not publish a country-by-country stage table of its own.** It only repeats “17% … stage I … over 25% in Denmark and Norway,” citing:

- **[15] Leskelä et al., Acta Oncol 2022** — *Trends in treatment of NSCLC in Finland 2014–2019*  
  Verified quote (full text): among patients at **four university hospitals** for whom stage could be found (**28% of 4047**, n=1133):  
  **Stage I 17%, II 12%, III 22%, IV 49%.**  
  → This is **not** a national population stage distribution. Massive missingness; university-hospital case-mix; NSCLC only.

- **[22] Gouliaev et al., Acta Oncol 2023** — *Lung cancer registries … comparison*  
  Verified **Table 2** (latest annual reports at time of that paper):

  | | Denmark DLCR 2021 | Finland FCR 2020 | Norway NLCR 2021 | Sweden SNLCR 2021 |
  |---|---|---|---|---|
  | Stage I (%) | **25.4** | *(not TNM)* **Local: 6** | **26.4** | **22.6** |
  | Stage II (%) | 8.3 | — | 7.5 | 7.0 |
  | Stage III (%) | 18.1 | — | 18.7 | 18.7 |
  | Stage IV (%) | 46.2 | Non-local: **47** | 44.7 | 50.8 |
  | Unknown (%) | 2.1 | **47** | 2.6 | 0.8 |

  Finland’s FCR does **not** report stage I; it reports localized / non-localized / unknown. **Gouliaev does not contain a Finnish “17% stage I” figure.**

### Does the team note misstate the paper?

**Partially yes.** The note accurately paraphrases what Acta 2025 *says*, including primary-care CT and the 17% / >25% line. But that line in the paper is itself a **weak citation mash-up**: a Finnish subsample of staged university-hospital NSCLC cases is treated as if it were Finland’s national stage I share, then compared to national quality-registry stage I rates from DK/NO. **Using “Finland ~17% stage I vs DK/NO >25%” as a hard Nordic fact would be embarrassing** if a mentor opens Gouliaev Table 2 or Leskelä’s methods. Safer: “Finland’s national registry still largely lacks usable TNM; among the minority of Finnish cases with stage recorded in selected hospital data, early-stage share looks low; DK/NO clinical registries report ~25–26% stage I with near-complete staging.”

---

## 3. Task B — Nordic precedent and evidence for GP/primary-care direct chest CT

### Sweden — SVF lungcancer filterfunktion

**Verified primary source:** Regionala cancercentrum — *Standardiserat vårdförlopp lungcancer*  
https://kunskapsbanken.cancercentrum.se/diagnoser/lungcancer/vardforlopp/

- On clinical suspicion, patient is referred to **imaging (filterfunktion)** before the SVF starts in full.  
- **Filterfunktion = lung X-ray *or* CT**, with answer back to the referrer on whether “välgrundad misstanke” is present.  
- Lead times in the national SVF: remiss decision → arrival 1 day; arrival → lung X-ray/DT **5 calendar days**; imaging → answer 1 day.  
- Regional primary-care guidance (e.g. Viss.nu Stockholm; Region Örebro) explicitly tells **vårdcentral / primary care to order DT thorax** on suspicion; Stockholm guidance increasingly prefers CT over chest X-ray because X-ray sensitivity for early disease is poor.  
- National short version still allows “lungröntgen eller DT.”

**Evaluation for stage or survival:**  
Could **not** find a peer-reviewed study that isolates the SVF filterfunktion / primary-care CT step and shows a causal effect on stage distribution or survival. Sweden publishes pathway lead-time attainment and NLCR outcomes nationally, but that is **monitoring**, not an impact evaluation of the filter CT rule. **Could not verify** a published stage/survival effect attributable to filterfunktion.

### Denmark — pakkeforløb + diagnostisk pakkeforløb / Diagnostic Centres

**Verified primary sources:**

1. Sundhedsstyrelsen — *Pakkeforløb for lungekræft* (Jan 2025 PDF): for persons >40 with relevant tobacco history and listed symptoms, the doctor should consider referral to **contrast CT of thorax and upper abdomen**. Suspicious imaging then triggers the lung cancer pathway.  
2. Sundhedsstyrelsen — *Diagnostisk pakkeforløb* (updated Dec 2023): GPs must have access to **direct referral** to relevant imaging including **diagnostic CT (CT-TAB: thorax, abdomen, pelvis)**; GP remains care coordinator for the initial work-up.  
3. Observational: Gouliaev A et al., BMC Cancer 2022 — increased diagnostic CT use associated with more stage IA detections (pathway study; not an RCT of GP access).  
4. BJGP Open 2026 (Region Zealand NSSC-CPP): GP direct ceCT-TAP; malignancy in **13%** of referred patients after referral volume rose ~5×; useful diagnostic yield but **does not prove stage shift for lung cancer specifically**.

**“Three-legged strategy” (Vedsted/Olesen literature):** organ-specific CPP for alarm symptoms; urgent investigation pathway for serious non-specific symptoms (Diagnostic Centres); GP-managed low-risk symptoms with access to tests. Secondary summaries (All.Can) cite improved 3-year relative survival after CPP rollout (lung 11%→20%); the primary comparative cohort (Jensen et al., BMC Cancer 2017) reports higher RS after CPP implementation but authors warn of **lead-time and selection bias**. That literature evaluates the **whole pathway reform**, not GP-CT alone.

### Norway — pakkeforløp lungekreft filterfunksjon

**Verified primary source:** Helsedirektoratet — Filterfunksjon  
https://www.helsedirektoratet.no/nasjonale-forlop/lungekreft/inngang-til-pakkeforlop-for-lungekreft/filterfunksjon

> “CT toraks, (ev. røntgen toraks front og side) tas uten opphold ved klinisk mistanke om lungekreft, selv om ev. rtg toraks er normalt.”

National handlingsprogram: on clinical suspicion the GP should request **CT thorax** (optionally chest X-ray); CT preferably within **2 weeks**; malignant CT findings → pakkeforløp. Fastlege can refer into the pathway.

**Evaluation:** Could **not** find a published evaluation isolating Norway’s filter CT on stage/survival. National pakkeforløp lead-time indicators exist (team already cites Helsedirektoratet QI; note current suspension caveat in `sources.json`).

### Published studies on GP/primary-care direct chest CT → stage / interval / survival

| Study | Design | Finding (verified) |
|---|---|---|
| **Guldbrandt et al., BMC Cancer 2015** (Aarhus cluster-RCT) | Direct LDCT from GP + CME vs usual care; 331 incident LC patients | **No statistically significant effect on stage at diagnosis or time to diagnosis.** Median diagnostic interval 36 vs 44 days (p=0.299). Localised stage ~41% overall; no between-group difference. |
| Guldbrandt / PLOS One 2014 (implementation arm) | 648 LDCT referrals | 15 lung cancers (2.3%); 60% of those localised — descriptive yield, not comparative outcome |
| Gouliaev et al., BMC Cancer 2022 | Observational CT pathway | More diagnostic CT ↔ more stage IA detections |
| UK ERS abstracts (Blackpool 2020; London 2025) | Service pilots | Faster pathway / low cancer yield (~1%); **not** survival/stage RCTs |
| Bradley et al., Br J Gen Pract 2025 | Observational: GP **chest X-ray** rate vs outcomes | Higher CXR use ↔ earlier stage and slightly better survival — **X-ray intensity, not CT access** |

**Bottom line for the intervention:** Nordic **policy precedent is strong** (SE/DK/NO all build primary-care-ordered CT into the filter/diagnostic step). **Outcome evidence that “letting GPs order CT improves stage or survival” is weak**; the best experimental evidence is **null**.

---

## 4. Task C — Strongest disconfirming evidence (mentor-embarrassment list)

### C1. Survival gap partly registration / case-mix, not only “late Finnish diagnosis”

**Verified:**

- **Sweden DCI bias:** Swedish Cancer Registry does not routinely include death-certificate-initiated cases. Andersson et al. Acta Oncol 2020: including DCI lung cases cut 1-year OS from **45% → 41%** in two regions; Pukkala et al. / NORDCAN notes ~2–3 pp overestimate of 1-year relative survival for lung. This inflates Sweden vs Finland comparisons — but **does not erase Finland’s lag vs Denmark and Norway**, which do use death-certificate sources.  
- **Acta 2025 itself** notes higher male share in Finland (60% vs ~45–51%), and that histology/stage reporting differs across Nordics. Men have worse LC survival everywhere.  
- **Gouliaev 2023** (AstraZeneca-funded): registry differences (relative vs overall survival; DCO/DCI; TNM completeness) “may bias comparative analyses.”  
- **NORDCAN survival studies** (Lung Cancer 2024): stage-adjusted Nordic comparison historically hard because TNM availability/coding differs; Finland historically weaker stage capture.

→ A mentor can accept “Finland is last” while rejecting “therefore our CT story is proven.”

### C2. The 17% stage I figure is the softest brick in the wall

- National FCR (Gouliaev Table 2): **Local 6%, unknown 47%** — not 17% stage I.  
- FCR/FICAN lung report 2019–2023 (syoparekisteri factsheet): stage missing **47.7%**; “vain pieni osa … paikallisena, **5% kaikista potilaista** ja **11%** niistä, joilta tieto on saatavissa.”  
- Leskelä 17% = share **among the 28% with recorded stage** in four university hospitals.  
- Acta’s claim that missing stage “may indicate even greater underdetection of early-stage disease” is **speculation**; missing stage can also hide late disease or poor documentation.

### C3. Primary-care CT restriction is real — but STUK 19:1 is not proof of the mechanism

**Supports the access claim:**

- EU-JUST-CT seven-country audit (Insights Imaging / EU project): explicit statement **“In Finland, general practitioners cannot refer to CT”** (also Estonia, Hungary).  
- Duodecim overview (*Radiologisen kuvantamisen perusteet*): CT/MRI “kuuluvat pääosin erikoissairaanhoitoon.”  
- Acta survey: only 1 Finnish respondent reported primary-care CT option.  
- JTHO 2024 (Task D): limited CT access at primary care is named as a pathway challenge.  
- Satakunta newspaper: previously CT generally required specialist assessment — consistent with the claim.

**Does not prove late diagnosis causation:**

- STUK 2024 **674,757 GD1AA vs 35,058 GD1AD (~19:1)** is a **national volume ratio**, not an appropriateness or delay metric. Chest X-ray is correctly first-line for many non-cancer indications; a high X-ray:CT ratio is expected even in systems with GP-CT access. **Do not use 19:1 as causal evidence of under-diagnosis.**  
- Acta’s Nordic experts said short wait differences alone don’t explain survival.  
- Turku/Satakunta thesis on diagnostic delay 2021–2022 (utupub abstract): referral from primary care to specialist care in ~2 weeks; **largest delay was inside specialist care** (~2 months referral→diagnosis). That cuts against “primary care is the bottleneck” for that region/period.

### C4. Alternative / complementary explanations for poor survival

Verified candidates a mentor will raise:

1. **Late stage / low curative intent** — FICAN 2026 communication: ~**27%** directed to curative treatment; Andersen et al. single-centre: stage IV ~**59%** unchanged 2007–2019 (Acta Oncol). Consistent with late presentation **or** aggressive biology — not uniquely CT access.  
2. **Treatment intensity / novel drugs** — Acta survey itself flags Finnish/Icelandic limits on some neoadjuvant IO/chemo; Leskelä shows rising but historically lower active treatment. Team’s own FINDING.md on targeted-therapy reimbursement geography is a **parallel** mechanism.  
3. **CT scanner density / funding** — OECD/Eurostat via IHE Dashboard: Finland fewest CT scanners per 100k in Nordics and far fewer CT exams than EU average — capacity constraint beyond referral rules.  
4. **Screening absence** — all Nordics late to LDCT screening; Denmark’s survival improvement preceded large-scale screening and tracked pathway reform + treatment change.  
5. **Smoking / histology / sex mix** — need care; Finland’s **female incidence is low** (team thesis point) which actually makes Finland’s **female survival still being last** more striking, not less — but male predominance and squamous/SCLC mix can still matter.

### C5. “Finland cannot measure the pathway” — overstated

**Still true:** Finland has **no operational national lung cancer clinical quality register** comparable to DLCR / NLCR / SNLCR. National Cancer Strategy and FICAN state a quality register is being explored; incomplete clinical notifications (~40% strategy text; stage missing ~48% in lung pilot).

**Already exists / emerging (easy mentor “gotcha”):**

- Finnish Cancer Registry publishes incidence, mortality, survival nationally and regionally.  
- **FICAN + THL + FCR Cancer quality registry project** has published lung reports: *Lung Cancer in Finland 2018–2022* and **2019–2023** (diagnostics, pathways, quality) — including regional comparisons, curative-intent share, stage completeness.  
  https://fican.fi/en/what-we-do/quality-and-monitoring/cancer-quality-registry-project/  
- THL publishes **generic** specialist-care waiting-time rules (assessment ≤21 days; treatment ≤180 days) and primary-care 14-day access stats — **not** lung-cancer-specific pathway clocks like DK forløbstider or SE SVF ledtider.  
- Some wellbeing services counties publish local waiting stats (all cancers lumped).

So say: **“Finland lacks a mature national lung quality register and cancer-specific pathway clocks,”** not “Finland cannot measure anything.”

### C6. Satakunta direct primary-care CT — no formal evaluation found

**Verified secondary reporting only:**

- Satakunnan Kansa (`satakunta-kansa-2025`) and later secondary rewrite (theintelligent.fi, Nov 2026): ~170 patients imaged; criteria ≥20 pack-years + symptoms; pilot 2022, routine 2024; **“vaikuttavuutta selvitetään parhaillaan tutkimuksessa.”**

**Could not find:** PubMed/Acta/FCR/THL peer-reviewed evaluation, registered trial results, or official wellbeing-services outcome report with stage/survival/diagnostic-interval endpoints. Treat as **interesting local practice, unevaluated.**

---

## 5. Task D — JTHO “Lung Cancer in Finland” (`jtho-lung-finland-2024`)

**Paper verified:** Andersén H, Aro M, Kaarteenaho R, et al. *Lung Cancer in Finland.* Journal of Thoracic Oncology. 2024;19(9):1265–1271. DOI [10.1016/j.jtho.2024.06.005](https://doi.org/10.1016/j.jtho.2024.06.005).

### Exact statements on primary-care CT / diagnostic pathway

**Diagnosis of LC in Finland:**  
> “In Finland, LC diagnosis is performed primarily in pulmonary clinics. Patients suspected of having LC are typically referred to these clinics for comprehensive evaluation. Nevertheless, one of the challenges in the diagnostic pathway is limited access to computed tomography scans at primary care centers, which are often the first point of contact for patients who exhibit symptoms (Fig. 3).”

**Future challenges:** 2023 survey of lung physicians — limited availability of specialists and diagnostic tools “such as computed tomography scans” in various parts of the country; uneven resources; low public awareness → delayed diagnoses; fragmented coordination; insufficient LC-specific funding.

**Does not claim:** that Finland has the worst Nordic survival *because* of CT access; does not give the 17% stage I statistic; does not assert GPs are legally forbidden from ordering CT (it states limited access as a pathway challenge). Aligns with, but is thinner than, Acta 2025 on the CT point.

**Other verified content useful for honesty:** survival ~25% women / slightly above 15% men (FCR 2021 era); surgery rates historically low teens nationally; Finnish Lung Cancer Program goals include screening study and **starting a Finnish Lung Cancer Care Registry** — i.e. authors themselves treat measurement as unfinished work.

---

## 6. New citations to add (`data/sources.json` schema)

```json
[
  {
    "id": "gouliaev-registries-2023",
    "category": "outcomes",
    "title": "Lung cancer registries in Denmark, Finland, Norway and Sweden: a comparison and proposal for harmonization",
    "url": "https://doi.org/10.1080/0284186X.2023.2172687",
    "publisher": "Acta Oncologica",
    "accessed": "2026-11-14",
    "notes": "Table 2 stage: DK I 25.4%, NO I 26.4%, SE I 22.6%; FI only Local 6% / Non-local 47% / Unknown 47%. Explains why Acta 2025 'FI 17% stage I' cannot come from this paper. AstraZeneca-funded. Critical for stage-claim honesty."
  },
  {
    "id": "leskela-nsclc-treatment-2022",
    "category": "outcomes",
    "title": "Trends in treatment of non-small cell lung cancer in Finland 2014–2019",
    "url": "https://doi.org/10.1080/0284186X.2022.2042474",
    "publisher": "Acta Oncologica",
    "accessed": "2026-11-14",
    "notes": "Actual source of '17% stage I': among 28% of 4047 university-hospital NSCLC patients with recorded stage (n=1133): I 17%, II 12%, III 22%, IV 49%. Not national population stage share. MSD co-authors."
  },
  {
    "id": "guldbrandt-ldct-rct-2015",
    "category": "nordic-pathway",
    "title": "The effect of direct access to CT scan in early lung cancer detection: an unblinded, cluster-randomised trial",
    "url": "https://doi.org/10.1186/s12885-015-1941-2",
    "publisher": "BMC Cancer",
    "accessed": "2026-11-14",
    "notes": "Only RCT of GP direct chest LDCT. Aarhus, 331 LC patients. No significant effect on stage at diagnosis or diagnostic interval. Strongest disconfirming evidence for 'CT access will fix stage/survival'."
  },
  {
    "id": "eu-just-ct-finland-gp",
    "category": "outcomes",
    "title": "Computed tomography referral guidelines adherence in Europe: insights from a seven-country audit",
    "url": "https://doi.org/10.1007/s00330-024-11325-y",
    "publisher": "European Radiology / EU-JUST-CT",
    "accessed": "2026-11-14",
    "notes": "Primary-source sentence: 'In Finland, general practitioners cannot refer to CT'. Strong independent confirmation of referral-rule claim (also Estonia, Hungary)."
  },
  {
    "id": "no-hdir-filterfunksjon-lc",
    "category": "nordic-pathway",
    "title": "Pakkeforløp lungekreft — Filterfunksjon",
    "url": "https://www.helsedirektoratet.no/nasjonale-forlop/lungekreft/inngang-til-pakkeforlop-for-lungekreft/filterfunksjon",
    "publisher": "Helsedirektoratet (Norway)",
    "accessed": "2026-11-14",
    "notes": "CT thorax (or chest X-ray) without delay on clinical suspicion, even if prior chest X-ray normal. Primary-care filter equivalent."
  },
  {
    "id": "dk-sst-lungekraeft-2025",
    "category": "nordic-pathway",
    "title": "Pakkeforløb for lungekræft (January 2025)",
    "url": "https://www.sst.dk/media/estk2oo1/pakkeforloeb-for-lungekraeft-jan-2025.pdf",
    "publisher": "Sundhedsstyrelsen (Denmark)",
    "accessed": "2026-11-14",
    "notes": "GP/referring doctor should consider contrast CT thorax+upper abdomen for listed symptoms in >40 with tobacco history; suspicious imaging opens lung pathway."
  },
  {
    "id": "dk-sst-diagnostisk-pakkeforloeb-2023",
    "category": "nordic-pathway",
    "title": "Diagnostisk pakkeforløb (updated December 2023)",
    "url": "https://www.sst.dk/media/1odjlxo2/diagnostisk-pakkeforloeb_final_-opdateret-dec-2023docx.pdf",
    "publisher": "Sundhedsstyrelsen (Denmark)",
    "accessed": "2026-11-14",
    "notes": "Requires GP direct access to diagnostic CT-TAB among other tests for non-specific serious symptoms pathway."
  },
  {
    "id": "andersson-sweden-dci-2020",
    "category": "outcomes",
    "title": "Estimates of lung and pancreatic cancer survival in Sweden with and without inclusion of death certificate initiated (DCI) cases",
    "url": "https://doi.org/10.1080/0284186X.2020.1826572",
    "publisher": "Acta Oncologica",
    "accessed": "2026-11-14",
    "notes": "Including DCI lung cases lowered 1-year OS 45%→41% in two Swedish regions. Disconfirms naive Sweden–Finland survival gap magnitude."
  },
  {
    "id": "fcr-fican-lung-2019-2023",
    "category": "outcomes",
    "title": "Lung Cancer in Finland 2019–2023 — diagnostics, care pathways and quality of care (FCR/FICAN quality registry pilot report)",
    "url": "https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html",
    "publisher": "Finnish Cancer Registry / FICAN / THL",
    "accessed": "2026-11-14",
    "notes": "Stage missing 47.7%; localized ~5% of all / ~11% of staged; ~27% curative-intent first treatment (FICAN English summary). Refutes 'Finland cannot measure anything' while confirming measurement is incomplete."
  },
  {
    "id": "fican-quality-registry-project",
    "category": "strategy",
    "title": "Cancer quality registry project",
    "url": "https://fican.fi/en/what-we-do/quality-and-monitoring/cancer-quality-registry-project/",
    "publisher": "FICAN",
    "accessed": "2026-11-14",
    "notes": "Joint FCR–THL–FICAN feasibility work toward national cancer quality register; lung reports 2018–2022 and 2019–2023 already published."
  },
  {
    "id": "jensen-cpp-prognosis-2017",
    "category": "nordic-pathway",
    "title": "Prognostic consequences of implementing cancer patient pathways in Denmark: a comparative cohort study of symptomatic cancer patients in primary care",
    "url": "https://doi.org/10.1186/s12885-017-3623-8",
    "publisher": "BMC Cancer",
    "accessed": "2026-11-14",
    "notes": "3-year RS improved after Danish CPP implementation (lung among cancers with significant change). Authors warn lead-time/selection bias. Evaluates whole three-legged reform, not GP-CT alone."
  }
]
```

**Also amend existing notes (recommended):**

- `acta-oncol-nordic-lc-2025`: replace “stage I share FI ~17% vs >25% DK/NO” with “survey study; cites Leskelä 17% among staged university-hospital NSCLC (28% coverage) and Gouliaev DK/NO registry stage I >25%; authors state causal link remains hypothetical; MSD co-author.”  
- `satakunta-kansa-2025`: add “no peer-reviewed evaluation found as of 2026-11-14; impact study described as ongoing in press only.”

---

## 7. Three questions for an AstraZeneca medical affairs expert today

1. **Stage truth standard:** Given FCR missing stage (~48%) and Leskelä’s 17% coming from only 28% of university-hospital NSCLC charts, what stage distribution do Finnish lung oncologists *actually* believe is real — and would AZ accept “17% stage I” on a slide, or insist on “unknown/localised/non-localised” plus curative-intent share (~27%)?

2. **Intervention evidence bar:** Nordic pathways already let GPs order CT, yet the Aarhus cluster-RCT of direct LDCT found no stage or interval benefit. Does AZ medical affairs treat primary-care CT access as a **necessary system-alignment reform** (process equity) or as an **outcome-proven lever** — and what endpoint would they require from Satakunta before scaling?

3. **Competing mechanisms:** Between (a) primary-care CT gatekeeping, (b) CT capacity/exams per capita, (c) incomplete molecular testing / targeted-therapy access (see team FINDING.md), and (d) absence of a national lung quality register with pathway clocks — which does AZ oncology/diagnostics see as the highest-leverage, fundable gap for Finland in the next 3–5 years?

---

## Verification status legend (for internal use)

| Claim element | Status |
|---|---|
| FI worst/near-worst Nordic LC survival | **Verified** (NORDCAN; Acta; IHE; Tichanek; etc.) |
| FI women lowest incidence yet poor survival | **Verified** directionally (NORDCAN / JTHO incidence figures); exact ASR 33.3 vs DK 83.0 **not re-pulled in this pass** — treat team extraction as pending live NORDCAN check |
| +0.5 vs +6.5 pp survival gain FI vs SE | **Could not verify in this pass** from primary fetch — confirm on NORDCAN before UI |
| STUK GD1AA 674757 / GD1AD 35058 | **Accepted as team-parsed open data** (in `sources.json`); not re-counted here |
| Primary-care CT generally unavailable in FI | **Verified** (Acta survey; JTHO; EU-JUST-CT; Duodecim; Satakunta press) |
| SE/DK/NO allow primary-care CT in filter/diagnostic step | **Verified** (national pathway docs) |
| GP-CT improves stage/survival | **Not supported** by RCT; observational/yield evidence only |
| FI 17% stage I vs DK/NO >25% | **Misframed** — see Task A |
| No FI cancer pathway measurement at all | **Overstated** — quality-registry pilot exists; cancer-specific national clocks still absent |
| Satakunta formally evaluated | **Not found** |

---

*End of verification report.*
