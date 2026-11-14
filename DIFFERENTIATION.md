# Differentiation — why CareTwin FI isn’t the AI-default

Written Sat 14 Nov ~00:30 after reverse-engineering what other Junction teams will ship when they paste the AstraZeneca brief into ChatGPT/Claude/Cursor.

## What almost everyone will build (AI-default pile)

Health hackathons in 2024–25 cluster hard ([Devpost galleries](https://health-hackx-27285.devpost.com/project-gallery?page=1), [OOP writeups](https://www.outofpocket.health/p/oops-2025-healthcare-ai-hackathon-projects)):

| Default product | Why AI suggests it | Why judges get bored |
|---|---|---|
| County choropleth + LLM “insights” | Challenge says “identify the gap” | Survival is flat across counties — map lies |
| Symptom / nurse chatbot CDS | “AI-powered”, feels clinical | MDR medical device; AstraZeneca red lines |
| Patient navigator / “know your risk” | Empathy story | Individual prediction = device + scary |
| Fake care-clock / early-warning | “Locate delays” | No open pathway clocks → pure theatre |
| Screening awareness app | Equity + testing rates | That’s mostly **Goal 2**, challenge is **Goal 3** |
| “Lives saved” calculator | Impact porn | Unethical + unprovable |

**Prompt reverse-psychology:** if 40 teams ask AI “solve equal cancer care Finland”, you get **dashboards, chatbots, triage, screening**. Your job is to ship the thing that prompt *doesn’t* naturally invent.

---

## What the research says the *real* unique gaps are

1. **Nordics beat Finland on pathway speed, not vibes** — lung symptom→treatment ~**155 days** FI vs ~107 SE / ~67 DK; ~41 days in primary care alone ([Yle MOT, Oct 2025](https://yle.fi/a/74-20251023)).
2. **Finland lacks a mature clinical cancer quality register with cancer-specific pathway clocks** (FICAN/THL/FCR pilot reports exist; national clocks comparable to DK/SE/NO do not) — so you cannot honestly run a national delay dashboard ([same MOT piece](https://yle.fi/a/74-20251023); Goal 3.2 in [National Cancer Strategy](https://fican.fi/wp-content/uploads/2026/01/National_Cancer_Strategy_2026-2035_Finland.pdf); see `VERIFICATION.md`).
3. **National standardised pathways are incomplete vs other Nordics** ([IHE Cancer Dashboard Finland](https://ihe.se/app/uploads/2026/04/IHE-Cancer-Dashboard-Finland_.pdf)) — Goal 3.1.
4. **A real local operating model already exists** — Satakunta primary-care direct CT (~170 patients; press-only, impact study described as ongoing, no peer-reviewed evaluation) — most teams will describe problems; few will **package a deployable, measured fix**.
5. **Primary-care CT access is the Nordic outlier** — Finland weak here ([Acta Oncol Nordic LC study](https://doi.org/10.2340/1651-226x.2025.42778); JTHO; EU-JUST-CT; IHE). Outcome evidence that GP-CT alone shifts stage/survival is weak (Guldbrandt 2015 RCT null).

---

## Our wedge (unique product definition)

**Not:** an AI that understands patients.  
**Yes:** a **Pathway Deployer** — software that treats an existing (unevaluated) Finnish pilot as a *versioned operating model* and asks: *can this wellbeing services county install it without creating a worse queue — and what must be measured because outcome proof is still missing?*

### Three uniqueness locks (non-negotiable)

1. **Unit of analysis = pathway template, not patient, not county colour**  
   Satakunta pathway = `v1.0` package (eligibility, handoff, imaging gate). Counties “install” it.

2. **Deployability > prediction**  
   Output is ops: CT slots, reporting capacity, phase order, equity targeting — and a **hard stop**: refuse rollout if capacity < demand. Other teams only show green success.

3. **Missing data is part of the product**  
   Others fake clocks. We show an **Evidence Void** panel: no mature clinical quality register with cancer-specific pathway clocks / incomplete stage capture (~48% missing in FCR lung pilot) → Goal 3.2 instrumentation is a first-class recommendation *next to* the CT pathway. That is politically current (MOT) and strategy-aligned. Almost no AI default will lead with “we refuse to invent the clock.”

### AI’s role (intentionally small)

One optional citation-bound brief writer. The innovation is **governance tooling**, not model magic. In an “AI hackathon”, refusing fake clinical AI is itself a differentiator — if you say it out loud.

---

## Positioning one-liner

> CareTwin FI is the install wizard for Finland’s missing national lung pathway: copy Satakunta where capacity allows, refuse where it doesn’t, and ship the measurement layer because outcome evidence is weak and a mature clinical quality register with pathway clocks still doesn’t exist.

---

## Kill list (things that make us look like everyone else)

- Choropleth as the hero  
- Patient chat  
- Individual risk scores  
- “AI triage who waits”  
- Lives saved  
- Screening-as-main-story  
- LLM that invents recommendations without source IDs  

---

## What “near perfect” means for *this* uniqueness

Perfect ≠ more screens. Perfect = every click reinforces the wedge:

| Screen | Must prove uniqueness |
|---|---|
| Home | Buyer = county/FICAN pathway lead; problem = slow pathway + missing national measurement |
| Pathway | Delay buckets (patient / primary / specialist) from sourced study — intervene where system can move |
| Deploy | Install Satakunta package + capacity gate + equity sequencing |
| Brief | Monday actions + stop rule + “instrument Goal 3.2” |
| Sources | Boring perfection; no soft URLs |

Aha-split map theatre is **optional garnish**, not the core. Core = **deployer + void + stop rule**.
