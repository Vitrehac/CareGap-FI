# Roadmap — CareTwin FI

**Now:** Sat 14 Nov ~01:30 · **Freeze:** Sat ~20:00 · **Record only:** Sun morning · **Submit:** Sun 15 Nov 10:00 sharp  
**Bar:** 85–90 (aha + stop rule + capacity-blocked + evidence dial + Monday brief)

Roles: **AI** = code · **Dev** = click-test + commits · **BD** = story/mentors · **Media** = deck + 2:00 video

---

## Saturday 14 Nov

### Night build — 01:30 → 04:00 (AI + Dev)
| When | What | Done when |
|---|---|---|
| 01:30–02:15 | Scaffold Next.js + Tailwind + MIT + README stub + `ARCHITECTURE.md` | `npm run dev` works |
| 02:15–03:00 | `/data` facts that are already verified + Evidence dial component + footer disclaimer | Badges render |
| 03:00–04:00 | `/` aha split + `/sources` from `sources.json` | Hook screen clickable |

**Sleep / hard stop ~04:00–09:00** (dead code at 04:00 beats tired bugs).

### Morning — 09:00 → 13:00
| When | Who | What |
|---|---|---|
| 09:00–09:20 | All | Re-read `MVP.md` demo path; git status |
| 09:20–11:30 | AI | `/pathway` — 4 steps, primary→CT pulse, equity strip |
| 09:20–11:30 | BD | Pitch spine in `PITCH.md` (aha → locate → stop rule → ask) |
| 09:20–11:30 | Media | Visual refs + shot list for video = demo path |
| 11:30–13:00 | AI + Dev | `/simulate` core: 3 theatre presets + capacity math + stop rule state |

### Afternoon — 13:00 → 17:00
| When | Who | What |
|---|---|---|
| 13:00–13:30 | All | Lunch; Dev re-runs full click path |
| 13:30–15:30 | AI | Finish simulator + wire presets (National / Equity-first 5 / **Capacity-blocked**) |
| 15:30–17:00 | AI | `/brief` Monday packet (steps, capacity, stop rule, judge-trap lines) |
| 15:30–17:00 | BD | Mentor ask: “would a county use a stop rule?” one quote if possible |
| 15:30–17:00 | Media | Deck outline (PDF): problem → aha → demo stills → recommendation |

### Evening freeze — 17:00 → 20:00
| When | Who | What |
|---|---|---|
| 17:00–18:30 | AI + Dev | Hide any `pendingUrlConfirmation` numbers; polish aha; `DEMO.md` click script |
| 18:30–19:30 | AI | Vercel deploy; README with live link + `npm install && npm run dev` |
| 19:30–20:00 | All | **Feature freeze.** Full path once on production URL. No new features after 20:00 |

### Buffer — 20:00 → 22:00 (only if broken)
- Bugfixes + copy only. No new pages.
- Media: export draft deck PDF.
- Sleep by ~22:30.

---

## Sunday 15 Nov

### Morning polish + record — 07:00 → 09:30
| When | Who | What |
|---|---|---|
| 07:00–07:30 | All | Production URL still up? Run `DEMO.md` |
| 07:30–08:30 | Media + Dev | Record 2:00 video (aha 10s → pathway → Equity-first → **Blocked** → brief) |
| 07:30–08:30 | BD | Final speaker notes; technologies list |
| 08:30–09:15 | Media | Export video + PDF deck; screenshots into README |
| 09:15–09:40 | All | Rehearse pitch once with timer; backup: video if live demo fails |
| 09:40–09:55 | Dev | Final commit; public repo check; MIT; live link in README |
| **10:00** | All | **Submit:** Vercel link, repo, 2:00 video, PDF deck, tech list |

---

## Build order (code only)

```
1. Scaffold
2. Evidence dial + footer + /sources
3. / aha split
4. /pathway
5. /simulate + 3 presets + stop rule
6. /brief
7. Deploy + DEMO.md
8. Freeze → Sunday record
```

## Cut order if behind (protect 85)

1. Drop FI/EN, LLM, sparse-hub, print CSS  
2. Keep aha + blocked preset + brief stop rule at all costs  
3. If 17:00 and simulator half-done → ship **presets only** (no free-form county picker)

## Team parallel tracks

| Track | Sat focus | Sun focus |
|---|---|---|
| AI | Must features → deploy | Bugfixes only |
| Dev | Test after every slice; commit | Record support + repo hygiene |
| BD | `PITCH.md` + judge traps + buyer line | Rehearsal |
| Media | Shot list + deck | 2:00 video + PDF |

---

## Checkpoints

- [ ] **04:00 Sat** — scaffold + aha or `/sources` alive  
- [ ] **13:00 Sat** — pathway clickable  
- [ ] **17:00 Sat** — simulate presets work  
- [ ] **20:00 Sat** — production demo frozen  
- [ ] **09:30 Sun** — video + PDF + README ready  
- [ ] **10:00 Sun** — submitted  
