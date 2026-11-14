# CareGap FI — MASTER (living file)

**Update this file whenever something important changes.**  
Team: NoTokens · Junction 2026 · AstraZeneca “Equal Care Across Finland”  
Last updated: **2026-11-14 ~12:30 EET**

> Judges/new humans: start at [README.md](README.md) + [DEMO.md](DEMO.md).  
> This file is the **continuous brain dump** so agents and teammates don’t lose context across chats.

---

## 0. One-liner

**CareGap FI** packages a **measured county experiment**: Satakunta-style direct primary-care chest CT + process clocks + capacity stop-rule — not AI diagnosis, not “lives saved.”

Tagline: *Measure the CT handoff first.*  
Hero line: *A ready-made pilot for one wellbeing services county.*

---

## 1. Roadmap right now

### Status (hackathon clock)

| Phase | Status |
|---|---|
| 0–3 Idea / legal / MVP | Done |
| 4 Business model lite | **Open** (optional for challenge) |
| 5–7 Brand + UI + build (`/` `/pilot` `/sources`) | Done |
| 8 Polish + feature freeze (~Sat 20:00) | **Next** |
| 9 README | Done (Vercel URL still TBD) |
| 10 Pitch story `PITCH.md` | **Todo** |
| 11 PDF deck | **Todo** |
| 12 Demo video 2:00 | **Todo** |
| 13 Rehearsal + submit Sun 10:00 | **Todo** |

### Next concrete moves (priority order)

1. **Freeze the demo** — no new features; fix clarity bugs only; hard-refresh check of DEMO.md path.  
2. **Vercel deploy** — put live URL in README.  
3. **Write `PITCH.md`** — use 5-sentence spine below + mentor notes.  
4. **Deck + 2:00 video** from DEMO.md (include stop-rule fail on Helsinki).  
5. **Optional:** business lite (who pays = HVA imaging / planning budget).  
6. **Submit** Sun 15 Nov **10:00 EET**.

### Do not reopen without a good reason

- Patient triage / risk AI / drug recommendations (MDR / AZ optics).  
- Fake national pathway clocks.  
- “17% stage I vs >25%” as clean Acta fact.  
- Claiming Satakunta cut waits or saved lives.

### 2026-11-14 afternoon — Mithril skin + data downloads (branch `mithril-skin`)
- Visual layer swapped to the Mithril look (dark ctOS + ASCII); content, UX, copy, data and stop-rule logic unchanged. See DESIGN.md note.
- `/sources` now opens with **Download the data**: every raw extract (`raw/`) and chart (`docs/charts/`) as a download with owner, contents and what it feeds. Copies live in `public/data/` (re-copy if the pipeline regenerates `raw/`). Metadata: `lib/downloads.ts`.
- WhatsApp files posted in Notokens after 13:00 were checked: all 12 data files + 5 charts are identical to `raw/` and `docs/charts/` (same names, sizes, dimensions).

---

## 2. Product thesis (locked)

### Keep (solid)
- NORDCAN: FI men 5y relative survival **17.9%** (16.7–19.2) vs SE **31.3%** (30.0–32.7), diagnosed 2020–2024; FI women also last despite low incidence.  
- Primary-care CT restriction in Finland is real (Acta 2025 survey; JTHO 2024; EU-JUST-CT: “GPs cannot refer to CT”).  
- SE/DK/NO pathways build primary-care / filter CT in by design.  
- Measurement gap = missing **cancer pathway clocks** (not “no register”). FICAN/THL/FCR pilot exists; peers publish day-clocks to treatment.

### Weaken
- GP-CT alone → stage/survival: **not proven** (Guldbrandt 2015 cluster-RCT null).  
- Satakunta: **press only**, unevaluated.  
- STUK ~19:1 X-ray:CT = volume ratio, **not** proof of under-diagnosis.

### Product = 2+1
1. Satakunta-style **direct primary-care CT** (narrow symptomatic group).  
2. **Measurement layer** (pre-registered process endpoint, comparator, stop-rule).  
Fundability answer: Satakunta isn’t proven → who pays? A county pays a few weekly slots **to learn**.

### Default demo county
- **Kainuu** = need #1 in seed + ~**2.4 CT slots/week** Estimate (absolute small).  
- **Not** because local CT supply is proven easier: STUK has **no county CT capacity**; per 100k pop, Kainuu demand intensity is **higher** than Helsinki.  
- **Satakunta** = precedent (rule already changed).  
- **Helsinki** = capacity stop-rule trip in demo (~13.6 slots/week Estimate).

---

## 3. How the county “test” works

1. Turn on GP→CT for defined group (~12 months).  
2. Comparator county keeps usual rules.  
3. Primary endpoint: median days first symptomatic visit → CT report **≤ 10** (Estimate, SVF-anchored).  
4. Stop if other radiology waits worsen.  
5. Clocks ideally from **EHR + Kanta** imaging/referral docs later (roadmap) — not a new doctor form.  
6. Scale or stop on clocks + queues — **not** on 12-month survival.

Legal: prototype, **not a medical device**. Population planning / education only. No real patient records in the demo.

---

## 4. Pitch assets (copy-paste)

### 5-sentence pitch
Finnish men survive lung cancer at **17.9%** over five years against Sweden’s **31.3%** — and peers let primary care into the CT filter step while Finnish health-centre doctors usually still need a specialist gate. Satakunta already opened direct CT from primary care, but that change was never properly measured, so nobody can honestly say “copy this nationwide.” CareGap FI packages the next county as a **12‑month experiment**: size a few CT slots a week (Kainuu-scale is about **2.4**), pick a comparator, pre-register days-to-CT-report, and stop if other radiology waits blow up. Doctors shouldn’t get a new form — clocks should ride systems they already use; the weekend demo is the brief and the rules, not a live EHR hookup. We are not promising stage shift or lives saved this year — we are offering a **realistic, capacity-checked way to learn whether easier CT access is worth scaling**.

### Mentor questions (AZ)
1. Who owns the CT order rule (HVA / hospital / national)?  
2. What endpoint makes a 12-month pilot credible?  
3. Whose budget pays ~2–3 CT slots/week?  
4. If GPs could order CT tomorrow, what breaks next?  
5. On-record sentence: is limited primary-care CT a real constraint?

### Mentor convo notes (2026-11-14)
- Survival numbers landed (“this is bad / things to do”).  
- They care **why** delay happens; clean split hard to find.  
- They volunteered ~50/~50 day split — **unsourced until they name the report**.  
- Liked experiment framing; pinging colleague for quote.  
- Avoid repeating “thousands of lives” / “only positive.”

---

## 5. Evidence holes we discovered (be honest on stage)

### Capacity
- National thorax CT 2024: **35,058** (~**674/week**) — STUK, Sourced.  
- Pilot Estimates: Kainuu **2.4**/wk; Satakunta **7.3**; Helsinki **13.6**.  
- **No county CT supply** in STUK extract → absolute “small” ≠ “% of local capacity.”  
- Radiologist reporting may bind before scanners.

### GP → specialist → CT gate
- **Finnish conversion % not published.**  
- Our slots/week = deaths × FI inc/mort × DK **58% ruled-out** → ~2.38 pathways/cancer — **not** Finnish specialist yes-rate.  
- GP-direct CT cancer yield (DK/UK): ~**1–2.3%**; fast-track PPV ~**10%**.  
- Turku delay thesis: biggest lag **inside specialist care**.  
- Detail: [docs/GATE_FUNNEL.md](docs/GATE_FUNNEL.md).

### Registers
- Peers publish pathway **day-clocks**; FI publishes incidence/survival + quality **pilot** (stage often missing).  
- Detail: [REGISTER_COMPARE.md](REGISTER_COMPARE.md).

---

## 6. Data & charts map

### App seed
- `data/counties.json` — counties, need, CT Estimates, SVG paths  
- `data/sources.json` — citations for `/sources`

### Raw research vault
`raw/` — `deaths.csv`, `nordcan.csv`, `kela.csv`, `stuk_2024.xlsx`, dims, `hva.geojson`, …

### Charts (regenerate: `python scripts/plot_mortality_charts.py`)
`docs/charts/`
- `county_crude_mortality_2021_2024.png`  
- `county_death_counts_2021_2024.png`  
- `finland_asr_mortality_by_sex.png`  
- `nordic_asr_mortality_by_sex_2024.png`  
- `age_specific_mortality_FI_vs_SE_2024.png`  

Index: [docs/MORTALITY_CHARTS.md](docs/MORTALITY_CHARTS.md)  
County rates = both sexes, all ages. Sex/age = country level only.

### Cold brief
- `docs/CareGap-FI-brief.pdf` (+ `.md` + `generate_brief_pdf.py`)

---

## 7. App & demo

- Run: `npm run dev` → http://localhost:3000  
- Path: `/` → Configure experiment → County (Kainuu) → Experiment → Brief → optional `/sources`  
- Script: [DEMO.md](DEMO.md)  
- Brand: [BRAND.md](BRAND.md) · [DESIGN.md](DESIGN.md) — Baltic navy planning instrument  

---

## 8. Doc index (everything else)

| File | Role |
|---|---|
| [README.md](README.md) | Judge entry |
| [docs/DOCS_MAP.md](docs/DOCS_MAP.md) | Start-here vs ignore |
| [FINDING.md](FINDING.md) | Dataset finding + locked thesis |
| [VERIFICATION.md](VERIFICATION.md) | Adversarial stress-test |
| [DECISIONS.md](DECISIONS.md) | Won’t-claim list |
| [MVP.md](MVP.md) | Scope (route names may be stale) |
| [LEGAL.md](LEGAL.md) | MDR / Kanta posture |
| [HACKATHON.md](HACKATHON.md) | Phase checklist |
| [ROADMAP.md](ROADMAP.md) | Older hour-by-hour (partially stale) |
| **This file `MASTER.md`** | **Continuous source of truth** |

---

## 9. Changelog (append only)

### 2026-11-14
- Locked CareGap FI brand; cold PDF; interactive then clarity+brand overhaul of `/` `/pilot`.  
- Verification: stage-I mash-up scrubbed; causal CT weakened; clocks phrasing fixed.  
- Register compare + mortality charts + gate funnel research.  
- Mentor chat: experiment framing OK; quote pending; avoid overclaim.  
- Created this MASTER file as continuous store.

### (append new dated bullets below)

### 2026-11-14 (later) — alternative pilots ranked
Stay on GP→CT + clocks as the Junction lead. Other credible pilots if dig deeper / post-hackathon:
1. **Clocks-only** (Kanta/EHR timestamps, no access-rule change) — fills Satakunta evidence hole.  
2. **Specialist-side SLA** (referral→CT→MDT) — Turku lag inside specialist care.  
3. **Equivocal X-ray → mandatory CT** (SVF-style) — smaller than full GP-CT.  
4. **Radiology report SLA** — reporting bottleneck.  
5. **NGS / biomarker turnaround** — IHE + FINDING inverse care (downstream; AZ-sensitive).  
6. **Primary-care access** (14-day waits) — Acta; weaker LC-specificity.  
7. **National lung quality register clocks** — system, not county weekend demo.  
8. **Symptom awareness** — soft. Avoid weekend: screening LDCT programme, triage AI.
