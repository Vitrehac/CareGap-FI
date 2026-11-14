# Demo: CareGap FI (happy path)

**Length:** ~45–60 seconds. **Voice:** county experiment you configure, not a stats poster.  
**Seed:** `data/counties.json` + `data/sources.json` only.  
**Run:** `npm run dev` → http://localhost:3000

## Story spine (say this once)

There’s a CT handoff gap → pick a county → configure a 12-month experiment → get a pilot brief.

## Click path (record this)

1. **Open `/`** (0–10 s)
   - First viewport only: **CareGap FI** + *Measure the CT handoff first.* + one plain line (*County pilot configurator for Finland’s missing primary-care CT clock.*)
   - Point at sticky progress: **Gap → County → Experiment → Brief**
   - Optional 3 s scroll: survival bars (FI 17.9 vs SE 31.3) — one beat, then back up.
   - **Click Configure a 12-month experiment** (lands on `/pilot` with Kainuu).

2. **`/pilot` — County** (10–20 s)
   - Progress shows County. Kainuu is pre-selected.
   - Click the map once if you want (or leave Kainuu). Point at **~2.4 CT slots/week** (Estimate).
   - Optional fail beat: City of Helsinki → capacity blocked, then back to Kainuu.
   - Scroll or click progress to **Experiment**.

3. **`/pilot` — Experiment** (20–40 s)
   - Satakunta-style direct CT is **on**; duration **12 months**; endpoint **≤10 days**.
   - Toggle direct CT off → on (demand returns).
   - Open **Advanced**: Narrow → Satakunta-style → Broader; watch slots/week move.
   - Optional: trip stop rule with Helsinki or Broader, then return to Kainuu pass.
   - Do **not** dwell in advanced controls.

4. **`/pilot` — Brief** (40–55 s)
   - Scroll to the large **Pilot brief**. This is the Monday screenshot: county, comparator, demand, endpoint, stop rule.
   - Say: Satakunta is unevaluated; we sell a measured experiment, not survival miracles.

5. **Close** (55–60 s)
   - Footer: *Prototype, not a medical device.* Stop.

## Optional mentor digression (only if asked)

- **Nordic clocks** on `/` (`#nordic-clocks`): SE → DK → NO → FI for what managers can open today.
- **`/sources`**: provenance vault; every figure Sourced / Estimate / Unknown.

## Do not say on stage

- Stage shift, lives saved, or Satakunta clinical outcomes
- “Finland ~17% stage I”
- “Finland cannot measure anything”
- MDR device / diagnose / drug advice

## Backup

If live demo fails: screenshots of `/` (quiet hero), `/pilot` County (Kainuu), `/pilot` Brief (pass) + Helsinki stop-rule fail.
