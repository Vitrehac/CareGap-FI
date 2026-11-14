// Design tokens copied from the web app (app/globals.css, components/dash/ui.tsx,
// components/CountyMap.tsx, app/(site)/layout.tsx). Do not invent new colours here.
import { Easing } from 'remotion';

export const c = {
  ink: '#1d2b25',
  inkSoft: '#46574f',
  inkFaint: '#74857c',
  paper: '#ffffff',
  paperRaised: '#f8f2ea',
  rule: '#ebe1d4',
  sand: '#efe2cf',
  sandSoft: '#faf6f0', // page background
  accent: '#1f8a5c',
  accentSoft: '#e3f3ea',
  alarm: '#d4553f',
  alarmSoft: '#fdeee9',
  mapLand: '#c9e3d4', // CountyMap county fill
  mapAlarmLand: '#f3c4b8', // CountyMap flagged fill
};

export const font = 'Figtree, "Helvetica Neue", Arial, sans-serif';

// Radii: cards rounded-3xl (24px), pills rounded-full. Borders are border-rule; 2px at video scale.
export const radius = { card: 24, pill: 999 };
export const border = `2px solid ${c.rule}`;

// Safe margins (5% action-safe horizontally).
export const safe = { x: 96, y: 80 };

// Motion: short eases only, no overshoot.
export const ease = Easing.bezier(0.22, 1, 0.36, 1); // ease-out (entrances)
export const easeIn = Easing.bezier(0.4, 0, 1, 1); // exits
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1); // data bars
export const dur = { in: 0.4, out: 0.25 };

// Wordmark spec from the site header: mark h-8 next to "liwe" at 1.6rem, weight 750, tracking -0.035em, gap 0.5rem.
export const wordmark = { markRatio: 1.25, weight: 750, tracking: '-0.035em', gapRatio: 0.31 };
