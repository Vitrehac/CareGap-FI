# Design: CareGap FI

**Direction locked:** 2026-11-14 (clarity + brand pass)  
**Aesthetic:** Baltic planning instrument. A wellbeing-services brief you would print for Monday — cool form paper, midnight ink, one signal blue, one alarm red. Not teal SaaS, not purple glow, not cream+terracotta, not broadsheet density.

**Source of truth for tokens:** `app/globals.css`

---

## One-sentence look

A county planning instrument: brand-first quiet hero, numbered story spine, and a large printable pilot brief as the payoff.

---

## Colour (3 + neutrals)

| Token | Hex | Role |
|---|---|---|
| Ink | `#101820` | Text, wordmark |
| Ink soft | `#3A4A58` | Supporting copy |
| Ink faint | `#6A7A88` | Meta, helpers |
| Paper | `#E6EBF0` | Page ground (cool instrument wash) |
| Paper raised | `#F7F9FB` | Interactive / brief surface |
| Rule | `#B8C4D0` | Dividers, map strokes |
| Accent (Baltic) | `#1E4D8C` | Primary actions, selected county, sourced tags |
| Accent soft | `#D8E4F2` | Selected chips, progress active |
| Alarm | `#A61C1C` | Finland survival, capacity trip, gap marker |
| Alarm soft | `#F3E0DE` | Stop-rule fail surface |

Charts: Accent for peers, Alarm for Finland / blocked. No second chromatic accent.

---

## Typography (2 families)

| Role | Family | Why |
|---|---|---|
| Display / brand / H1–H2 | **Newsreader** | Serious Nordic editorial serif; reads as a planning brief, not a startup landing |
| UI / body / numbers | **Schibsted Grotesk** | Nordic media grotesque; tabular nums for slots and ranks |

Scale: hero brand ~3–3.5 rem · H1 ~2.25 rem · H2 ~1.35 rem · body 1 rem / 1.55 · meta 0.75–0.8125 rem. Tracking floor −0.03 em on display.

---

## Layout principles

1. **Story spine everywhere.** Gap → County → Experiment → Brief. Sticky “You are here” progress on every page.
2. **Brand-first first viewport on `/`.** Wordmark + one plain-language line + one CTA into the experiment. No map, survival bars, clocks, or toggles above the fold.
3. **One job per section.** One headline. Kill competing panels.
4. **Defaults pre-filled.** County Kainuu; 12-month duration; Satakunta-style route on; endpoint ≤10 days. Advanced controls collapsed.
5. **Brief is the payoff.** Full-width, large type, printable calm — not a form sidebar.
6. **Cards only for interaction.** Narrative stays open on paper; the brief is a document surface, not a card stack.
7. **Provenance always visible.** Sourced / Estimate / Unknown beside figures; short helper under controls.

---

## Motion (2–3 intentional)

1. Hero mark draws the open clock arc once on load (`prefers-reduced-motion`: static).
2. Survival bars grow width on first view below the fold.
3. Pilot brief crossfades when configuration changes.

No scroll parallax, no hover glow stacks, no per-card entrance spam.

---

## Logo usage

Mark: `public/caregap-mark.svg` — open clock ring with a missing arc (the unmeasured handoff) and a single alarm gap tick.  
Wordmark: `public/caregap-wordmark.svg` — CareGap + FI in Newsreader weights.

Clear space ≥ 0.5× mark height. One-colour ink or Baltic accent on paper. No glow, gradients, or teal fills. Below 24 px: mark alone.

---

## Footer / legal chrome

Every page: “Prototype, not a medical device.” Aggregate public data only. No diagnosis, triage, or drug advice.
