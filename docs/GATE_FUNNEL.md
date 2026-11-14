# Diagnostic gates — what conversion rates we can source

Checked 2026-11-14. **Do not invent Finnish GP→specialist→CT percentages.**  
This file lists every gate we looked for and what exists.

## The Finnish funnel (qualitative — Sourced pathway descriptions)

```
Patient delay
    → Primary care contact (often nurse first in FI survey)
        → Chest X-ray (usual GP tool)
            → Specialist referral (CT usually NOT orderable by GP)
                → Specialist triages referral
                    → CT thorax (+/− upper abdomen)
                        → Further work-up / rule-out / cancer
```

| Gate | Finland figure | Status |
|---|---|---|
| GP may order chest CT | Generally **no** (EU-JUST-CT; Acta 2025; JTHO 2024) | Sourced rule |
| Share of symptomatic visits that become specialist referrals | **Unknown** nationally | Hole |
| Share of specialist referrals that get a CT | **Unknown** nationally | Hole |
| Time: referral handled → CT (example pathway) | Tays/Pirha: CT often **1–2 weeks** after referral handled; referral triaged **1–3 working days** | Sourced local pathway text — not a conversion % |
| Where delay bites (Turku/Satakunta thesis 2021–22) | Primary→specialist ~**2 weeks**; **largest lag inside specialist care** (~**2 months** referral→diagnosis) | Sourced abstract — cuts against “only the GP gate matters” |
| Acta survey waits (expert mode) | Specialist after GP **2–4 weeks** FI vs **1–2** SE/DK/NO; diagnosis after specialist **~4 weeks** FI | Survey, not registry |

**Implication:** Opening GP→CT removes one gate. It does **not** automatically fix the specialist-side delay Turku measured. Our slots/week Estimate also does **not** equal “extra CTs beyond what specialists already order.”

---

## Gates with published numbers (mostly not Finland)

### A. Inside a formal lung cancer pathway — ruled out vs cancer
| Gate | Rate | Source |
|---|---|---|
| DK lung pakkeforløb (B26): suspicion **ruled out** during work-up | **58%** (2025 annual); **59%** in Q4 2025 | SST *Monitorering af forløbstider* 2025 |
| → Pathways per confirmed cancer (our Estimate input) | **1 / (1−0.58) ≈ 2.38** | Derived from SST — **Denmark**, applied to FI deaths as Estimate |

This is **after** the patient is already in a cancer patient pathway — **not** the rate at which a Finnish specialist accepts a GP referral for CT.

### B. GP → fast-track / imaging among people who later had lung cancer (denominator = cancers)
| Gate | Rate | Source |
|---|---|---|
| DK: GP involved in pathway | **68%** | Guldbrandt / BMC HSR 2015 lineage |
| DK: referred GP → fast-track (of all LC) | **27%** | Same family |
| DK: of GP-involved, fast-track used | **~41%** | Same |
| DK (newer survey): first referral = diagnostic imaging | **48%** of GP-start LC pathways | PMC13234914 (2025/26) |
| DK: first referral = specific lung CCP | **16%** | Same |
| DK: ≥1 chest X-ray in 90 days before diagnosis | **85.6%**; **≥2 X-rays** **33.6%** | BMC HSR 2015 |

These describe **cancer patients’ routes**, not the forward probability that a GP referral becomes a CT.

### C. GP direct CT — cancer yield (denominator = CT ordered by GP)
| Setting | Lung cancer among GP-CT | Other | Source |
|---|---|---|---|
| DK direct LDCT (Guldbrandt implementation) | **2.3%** (15/648); **~50%** needed further work-up; **6.8%** severe lung disease | Referral **0.18 / 1000 adults / month** | PLOS One 2014 |
| Same programme: GP → **fast-track** PPV | **10.2%** lung cancer (33/335) | Much higher selectivity | Same / thesis |
| UK London borough GP direct chest CT (2024, 6 mo) | **~1%** lung (3/305); **+2%** other cancers; **30%** other lung disease | Median 14 days to scan | ERS 2025 abstract |
| UK ACE / Nottingham-style direct CT after normal CXR | **~2.4%** lung pick-up | BJGP commentary | BJGP 2019 |
| DK NSSC (non-specific symptoms) ceCT-TAP from GP | Malignancy **13%** (2019) after volume **×5** since 2013 (was 20%) | Not lung-only | BJGP Open 2025/26 |

**Pitch use:** GP-direct chest CT is a **low-PPV** test (~1–2% lung cancer). Fast-track / specialist pathways run ~**10%** PPV. Opening the gate trades **volume** for **access**. Capacity planning must assume many negative CTs.

### D. Sweden — filter design (times, not conversion %)
| Gate | Figure | Source |
|---|---|---|
| Suspicion → imaging filter | X-ray **or** CT; unclear X-ray → **should get CT** | SVF lungcancer |
| Design times | Remiss→arrival 1 d; arrival→X-ray/CT **5** d; result **1** d | SVF |
| Published attainment | Mostly **suspicion→treatment** clocks, not GP→CT conversion % | NLCR / Vården i siffror |

No sourced national “% of primary-care filter imaging that is CT” or “% that become välgrundad misstanke” pulled into this vault yet.

### E. Finland local pathway (Tays / Pirha) — process, not yield
Once a **suspected lung cancer referral** reaches pulmonology: triage **1–3 working days**; investigations usually start with **chest + upper abdomen CT within 1–2 weeks** of triage.  
→ Suggests: **for referrals labelled LC suspicion, CT is the default next step** — but that is **not** a national % of all GP respiratory referrals, and it says nothing about how many GP patients never get referred.

---

## What our `ctPerWeekEst` actually assumes

```
county deaths/year
  × FI incidence/mortality (~1.30)     → estimated cancers/year
  × 1/(1−0.58)  from DK ruled-out      → estimated "pathways"/year
  / 52                                 → CT slots/week Estimate
```

**Missing from that chain:** Finnish rates for  
GP symptom visit → X-ray → specialist referral → specialist says yes to CT.

So 2.4 slots/week in Kainuu is **not** “extra CT beyond today’s specialist orders.” It is “if every estimated cancer pathway looked like a DK-style work-up volume.”

---

## Sensitivity framing for the pitch (honest)

| If the Finnish specialist gate today is… | Then opening GP→CT mostly… |
|---|---|
| Soft (almost everyone referred for LC suspicion already gets CT) | **Moves timing earlier**; volume shock smaller; still need reporting capacity |
| Hard (many referrals never get CT / long queue before CT) | **Adds volume**; low PPV (~1–2% from DK/UK GP-CT) means many negatives |
| Unknown (Finland) | **Measure orders + waits in the pilot** — do not pretend we know |

Turku/Satakunta delay work leans toward **specialist-side** time as the big lag in that sample — so GP→CT alone may not be the whole fix.

---

## Still missing after this sweep (ask AZ / FICAN)

1. Finnish **% of GP respiratory cancer-suspicion referrals that receive CT within 30 days** (by HVA).  
2. Finnish **PPV of specialist LC referrals** (cancer / referrals).  
3. Satakunta **before/after** CT volume and waits (still unpublished).  
4. County-level **thorax CT supply** (STUK is national only).

---

## Citations to prefer on stage

- SST 2025 lung B26: 58% ruled out — https://www.sst.dk/media/b5llddpn/monitorering-af-forloebstider-paa-kraeftomraadet-aarsopgoerelse-for-2025.pdf  
- Guldbrandt PLOS One LDCT yield 2.3% — https://doi.org/10.1371/journal.pone.0112162  
- Pirha/Tays pathway — pirha.fi lung referral page  
- Acta Oncologica Nordic waiting/CT access survey — PMC12160590  
- VERIFICATION.md Turku delay note  
