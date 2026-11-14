# Legal posture — CareTwin FI

**Not legal advice.** Product decisions for Junction 2026 based on public EU/FI materials. Full URLs in `SOURCES.md` / `data/sources.json`.

## Intended purpose (write this into the product)

CareTwin FI is a **hackathon prototype for population-level pathway planning and education**. It does **not** diagnose, predict individual cancer risk, prioritise individual patients for treatment, or process real patient records.

## Why the rejected product was legally heavy

| Rejected idea | Main regimes |
|---|---|
| Individual cancer risk (age, profession…) | EU MDR → medical device software; MDCG 2019-11 examples include cancer risk calculators |
| “This patient waits / that patient goes first” | MDR clinical decision support + AI Act Annex III emergency healthcare triage |
| Doctor–patient–clinic live data network | Patient Act 785/1992, Client Data Act / Kanta, GDPR Art. 9, telemedicine = normal regulated care |
| Raw national patient datasets | Secondary Use Act 552/2019 (Findata) + secure environments; not for a public demo |

## Why CareTwin FI stays in the safer lane

MDCG 2019-11: software for **administration**, **population data**, or **epidemiological** use (not individual medical purpose) is generally **not** MDSW.  
We only use **published aggregates** (Sotkanet/NORDCAN/IHE/papers) and labelled estimates.

## On-screen rules

1. Footer: “Prototype, not a medical device.”
2. No patient identifiers; no “you have cancer / will get cancer.”
3. Impact = **Estimate** ranges; never “lives saved.”
4. Say “high-risk patients,” not blame language; frame system gaps, not nurse blame.
5. Optional LLM may only rephrase text that already has citation IDs.
