# Liwe pitch motion pack

Remotion project for the 2-minute pitch graphics. Self-contained: nothing outside `/video` is used or changed.

```bash
cd video
npm install
npm run studio     # live preview in Remotion Studio
npm run render     # stills + master + preview + segments.csv, prints the segment table
npm run render:stills   # fast review loop: stills + csv only
```

## Outputs (`out/`)
| File | What |
|---|---|
| `liwe_motion_pack.mov` | Master. ProRes 4444 with alpha. Overlays are transparent; HookMap, MapCallback and EndCard are opaque. |
| `liwe_motion_pack_preview.mp4` | Same timeline over mid-grey, with 5% / 10% safe-area guides. For judging placement only. |
| `segments.csv` | One row per segment with timecodes and frames. `end` is the out point (first frame after the segment). |
| `stills/` | One PNG per segment at its key frame (`key` in timings.json). |

## Re-timing to the voiceover
Edit `timings.json` only: a segment's `duration`, its `beats` (seconds from the segment start) or `fps` (25 or 30). The 1 s gaps, the CSV and the total length are recomputed on the next render.

## Names and links
`props.json`: lower-third names and roles, live URL (currently `LIVE_URL`, no deploy URL found in README or a Vercel config), repo URL, event line, default callout corner.

## Where things live
- `src/tokens.ts`: colours, radii, motion curves, copied from the app (`app/globals.css`, `components/dash/ui.tsx`, `components/CountyMap.tsx`, site header).
- `src/NordicMap.tsx`: Natural Earth 1:50m map (world-atlas + topojson-client + d3-geo) and the shared-scale day bars.
- `src/segments.tsx`: one component per segment; copy and data values live here.
- `src/timeline.ts`, `src/MotionPack.tsx`: ordering, gaps, preview background.
- Font: full Figtree variable file (`public/fonts`, OFL), the app's only typeface. The app ships subsets without → and ≤.
