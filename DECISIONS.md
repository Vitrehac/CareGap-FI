# Decisions — NoTokens / Liwe

## Product lock (2026-11-13; thesis scrubbed 2026-11-14 per `VERIFICATION.md`)

**We build:** Liwe — a Goal 3 *pathway + Satakunta rollout* decision cockpit for wellbeing services counties / FICAN.  
**Quality bar:** 85–90 = Pathway Deployer wedge (see DIFFERENTIATION.md): install Satakunta package + capacity stop rule + Evidence Void (no fake national clocks) + Monday brief. Aha-map is optional garnish, not the core.  
**We do not build:** patient–doctor network, individual cancer prediction, treatment-queue triage, or hero choropleth dashboards.

### Locked thesis (what we may say)

1. **Survival gap is real** — NORDCAN / Nordic comparisons place Finland last or near-last for lung-cancer five-year relative survival.
2. **Primary-care CT restriction is real** — Finnish GPs generally cannot refer to CT (Acta 2025 survey; JTHO 2024; EU-JUST-CT). SE/DK/NO pathways allow primary-care / filter CT.
3. **Measurement gap is real, carefully phrased** — FICAN/THL/FCR quality-registry pilot exists; missing is a mature clinical cancer quality register with cancer-specific pathway clocks (not “Finland cannot measure anything”).
4. **Causal chain is weak** — Guldbrandt 2015 cluster-RCT of GP direct LDCT was null on stage and diagnostic interval; Satakunta is press-only / unevaluated. Do not pitch “GP CT → stage shift → survival” as proven.
5. **Product is 2+1 because evidence is weak** — county pilot = Satakunta-style direct primary-care CT **+** measurement layer (pre-registered process endpoint, comparator, stop rules). That is the fundability answer, not a claim that Satakunta already works.

### Why (build rationale)

1. AstraZeneca scores **recommendations** hardest; regional survival is statistically flat → dashboards fail.
2. Sourced system feature is **primary care → CT access**, not unequal counties — but outcome evidence for that lever alone is weak, so the demo sells a *measured* rollout, not a miracle cure.
3. Satakunta already runs a real direct-CT pathway (~170 patients; impact study described as ongoing in press only) → credible “what to copy,” not “what is proven.”
4. EU/FI law: individual risk + triage ≈ medical device (MDR Rule 11) and high-risk AI (AI Act); population/pathway planning on public data stays outside MDSW (MDCG 2019-11).

### Do not claim on stage / pitch

- “~17% stage I in Finland vs >25% DK/NO” as a clean Acta/registry comparison.
- Leskelä 17% as national population stage I (selected university-hospital NSCLC subsample with recorded stage).
- Acta 2025 as a stage-registry analysis (it is an HCP survey; stage numbers are citations).
- “Finland has no cancer quality register at all” (pilot reports exist).
- Satakunta clinical outcomes, stage shift, or “lives saved.”
- STUK X-ray:CT volume ratio as causal evidence of under-diagnosis.

## Name

**Liwe** locked 2026-11-14 (see `BRAND.md`). Former working name Liwe retired for pitch surfaces.

## Stack

Next.js App Router + TypeScript + Tailwind + static `/data` JSON + Vercel. No DB, no auth. Optional one LLM route for brief rephrase only.

## Data honesty

- Public / published sources only in the demo.
- Sotkanet: fetch-once if possible; else curated published figures with citation.
- Mock only if labelled `Mock: grounded in [source]`.
- Never invent Satakunta clinical outcomes or “lives saved.”
- Stage claims must follow `VERIFICATION.md` framing (FCR missingness / Leskelä subsample), not the misframed Acta mash-up.

## Legal posture

Footer: “Prototype, not a medical device.” Intended purpose = **system planning / education for a hackathon**, not diagnosis, prognosis, or care prioritisation of individuals. See `LEGAL.md` and `SOURCES.md`.
