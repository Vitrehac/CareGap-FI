# MVP — CareTwin FI (85–90 bar)

**One-sentence MVP:** In under 90 seconds, a FICAN / wellbeing services county pathway lead sees that equal counties ≠ equal chances, locates the primary-care→CT bottleneck, runs a Satakunta rollout under capacity limits (including a blocked failure case), and leaves with a Monday-morning action brief that has a stop rule — every number tagged Sourced / Estimate / Unknown.

**Buyer (say this in pitch):** FICAN and wellbeing services county pathway leads deciding whether to copy Satakunta this year.

---

## Features (organised)

| Feature | Priority |
|---|---|
| **Pathway Deployer:** Satakunta model as installable pathway package for counties | Must |
| Nordic delay / Goal 3 gap with Sourced badges (incl. ~155d pathway context if cited) | Must |
| 4-step pathway locate (pulse on primary → CT) | Must |
| **Evidence Void:** no mature clinical quality register with cancer-specific pathway clocks / no fake patient clocks — recommend Goal 3.2 instrumentation | Must |
| **Stop rule:** demand > CT/staff → blocked (do not announce pathway yet) | Must |
| **Demo theatre:** National phased / Equity-first 5 / Capacity-blocked | Must |
| Equity sequencing (language / education) inside deploy, not a side chart | Must |
| **Evidence dial:** Sourced / Estimate / Unknown | Must |
| Monday brief = install steps + capacity + stop rule + measure-next + citations | Must |
| Judge-trap copy: not a dashboard; not a medical device; no fake Satakunta proof | Must |
| Aha map split (*equal counties ≠ equal chances*) | Should |
| `/sources` vault from `data/sources.json` | Must |
| Disclaimer footer every page | Must |
| Precomputed data only (no spinners on recorded path) | Must |
| Print-friendly brief | Should |
| FI/EN toggle | Should |
| Optional LLM rephrase of brief (env key; demo works without) | Should |
| Sparse-area / shared CT hub note (Goal 3.5) | Should |
| Doctor–patient messaging | Won’t |
| Individual cancer risk prediction | Won’t |
| AI treatment priority / who waits | Won’t |
| Live EHR / clinic network / auth / DB | Won’t |
| Live Sotkanet or live LLM on stage | Won’t |
| Invented Satakunta outcomes / “lives saved” | Won’t |
| Screening as Goal 3 core | Won’t |
| Drug / treatment regimen tips | Won’t |

---

## Demo click path (record this)

1. `/` — Aha split (10s hook)
2. `/pathway` — Locate primary→CT + equity
3. `/simulate` — Click **Equity-first 5**, then **Capacity-blocked**
4. `/brief` — Monday packet with stop rule
5. `/sources` — Trust

---

## Done = 85–90 ready

- [ ] Aha split lands without explanation  
- [ ] Failure preset works and is in the video  
- [ ] Brief has stop rule + named buyer language  
- [ ] No soft/unverified numbers on screen (`pendingUrlConfirmation` cleared or hidden)  
- [ ] Live Vercel + 90s path with zero spinners  
