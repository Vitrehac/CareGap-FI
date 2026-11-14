# Docs map (Liwe)

Canonical vs ignore for judges and new contributors. Nothing here authorises deleting research assets.

## Start here (demo + pitch)

| File | Why |
|---|---|
| [../MASTER.md](../MASTER.md) | **Living brain dump** — roadmap, thesis, evidence holes, pitch, data map (keep updating) |
| [../README.md](../README.md) | Single entry point: proof table, quickstart, limits |
| [../DEMO.md](../DEMO.md) | Exact 45–60s click path |
| [../BRAND.md](../BRAND.md) | Name, voice, claims to repeat / avoid |
| [Liwe-FI-brief.pdf](Liwe-FI-brief.pdf) | Cold planning brief for mentors / handout |

## Evidence (pitch-safe facts)

| File | Why |
|---|---|
| [../FINDING.md](../FINDING.md) | Team dataset finding + locked thesis |
| [../VERIFICATION.md](../VERIFICATION.md) | Adversarial check: what is solid vs soft |
| [../REGISTER_COMPARE.md](../REGISTER_COMPARE.md) | Nordic clocks vs FI; missing clocks ≠ no register |
| [../SOURCES.md](../SOURCES.md) | Human citation list |
| [../data/sources.json](../data/sources.json) | Machine twin behind `/sources` |

## Product (scope and look)

| File | Why |
|---|---|
| [../MVP.md](../MVP.md) | Must / should / won’t (older route names may differ from shipped `/` `/pilot` `/sources`) |
| [../DECISIONS.md](../DECISIONS.md) | Locked product thesis and won’t-claim list |
| [../DESIGN.md](../DESIGN.md) | Tokens, layout, motion |

## Optional / internal (safe to skip)

| File | Notes |
|---|---|
| [../IDEA.md](../IDEA.md) | Early problem framing (pre-Liwe naming) |
| [../LEGAL.md](../LEGAL.md) | MDR / AI Act posture (summary also in README Safety) |
| [../DIFFERENTIATION.md](../DIFFERENTIATION.md) | Why not another dashboard / chatbot |
| [../DATA_SHEET.md](../DATA_SHEET.md) | Google Sheet → product mapping |
| [../ROADMAP.md](../ROADMAP.md) | Hour-by-hour hackathon schedule |
| [../HACKATHON.md](../HACKATHON.md) | Phase checklist |
| [../AGENTS.md](../AGENTS.md) | Next.js agent tooling note |
| [Liwe-FI-brief.md](Liwe-FI-brief.md) | Markdown source for the PDF |
| [generate_brief_pdf.py](generate_brief_pdf.py) | PDF build script |

## Keep, but not judge-facing

| Path | Notes |
|---|---|
| `scripts/` | Research and regenerate pipelines (`gen_app_data.py`, `targeted_access.py`, …). Demo does not require running them. |
| `raw/` | Source extracts. Do not delete; do not ship as the UI. |
| `node_modules/`, `.next/` | Build artefacts |

## Cruft note

Older filenames still say Liwe in places (`MVP.md`, `LEGAL.md`, `IDEA.md`, …). Brand lock is **Liwe** ([BRAND.md](../BRAND.md)). Prefer README + DEMO + BRAND for anything public-facing. Do not mass-delete duplicates; use this map instead.
