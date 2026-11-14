// Flat Nordic map (Natural Earth 1:50m via world-atlas) with two day-bars on one shared scale.
// Map styling mirrors components/CountyMap.tsx: land #c9e3d4, paper strokes.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { geoConicConformal, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import world from 'world-atlas/countries-50m.json';
import { c, font } from './tokens';
import { Check, text } from './ui';

// ── geometry (computed once) ───────────────────────────────
const all = (feature(world as never, (world as never as { objects: { countries: never } }).objects.countries) as unknown as FeatureCollection).features as Feature<Geometry>[];
const pick = (ids: string[]) => all.filter((f) => ids.includes(String(f.id)));
const FOCUS = pick(['752', '246']); // Sweden, Finland
const CONTEXT = pick(['578', '208', '233']); // Norway, Denmark, Estonia: faint context only

const projection = geoConicConformal()
  .parallels([58, 68])
  .rotate([-21, 0])
  .fitExtent([[620, 70], [1180, 1030]], { type: 'FeatureCollection', features: FOCUS });
const path = geoPath(projection);
const focusPaths = FOCUS.map((f) => path(f) ?? '');
const contextPaths = CONTEXT.map((f) => path(f) ?? '');
const pt = (lon: number, lat: number) => projection([lon, lat]) as [number, number];

export const CITY = {
  stockholm: pt(18.07, 59.33),
  helsinki: pt(24.94, 60.17),
  kajaani: pt(27.73, 64.23),
};

// ── shared day scale ───────────────────────────────────────
export const SCALE = { x0: 1180, pxPerDay: 8, barH: 28 };
const dx = (days: number) => days * SCALE.pxPerDay;

export type BarState = {
  y: number; // row centre
  from: [number, number]; // city dot
  leader: number; // 0..1 leader line drawn
  days: number; // current value (can be fractional while growing)
  color: string;
  label: React.ReactNode;
  labelOpacity: number;
  done?: number; // 0..1 check state
};

const Bar: React.FC<{ s: BarState }> = ({ s }) => {
  const { x0, barH } = SCALE;
  const w = dx(s.days);
  const shown = Math.round(s.days);
  const lx = s.from[0] + (x0 - s.from[0]) * s.leader;
  return (
    <>
      <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>
        {s.leader > 0 && <line x1={s.from[0]} y1={s.y} x2={lx} y2={s.y} stroke={c.inkFaint} strokeWidth={2} strokeDasharray="2 8" strokeLinecap="round" />}
        {w > 0 && <rect x={x0} y={s.y - barH / 2} width={Math.max(w, barH * 0.0001)} height={barH} rx={barH / 2} fill={s.color} />}
      </svg>
      {/* label above the bar */}
      <div style={{ position: 'absolute', left: x0, bottom: 1080 - (s.y - barH / 2 - 14), opacity: s.labelOpacity, ...text(36, 600, c.ink), lineHeight: 1.2 }}>{s.label}</div>
      {/* counter at the tip */}
      {s.leader >= 1 && (
        <div style={{ position: 'absolute', left: x0 + w + 20, top: s.y, transform: 'translateY(-50%)', display: 'flex', alignItems: 'baseline', gap: 10, ...text(64, 700, s.color) }}>
          {shown}
          <span style={{ ...text(36, 600, s.color) }}>days</span>
          {s.done !== undefined && s.done > 0 && (
            <span style={{ alignSelf: 'center', opacity: s.done, marginLeft: 6 }}>
              <Check size={44} draw={s.done} />
            </span>
          )}
        </div>
      )}
    </>
  );
};

const Dot: React.FC<{ p: [number, number]; color: string; r?: number; pulse?: number }> = ({ p, color, r = 11, pulse = 0 }) => (
  <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>
    {pulse > 0 && pulse < 1 && <circle cx={p[0]} cy={p[1]} r={r + 34 * pulse} fill="none" stroke={color} strokeWidth={3} opacity={0.6 * (1 - pulse)} />}
    <circle cx={p[0]} cy={p[1]} r={r} fill={color} stroke={c.paper} strokeWidth={4} />
  </svg>
);

const CityLabel: React.FC<{ p: [number, number]; children: React.ReactNode; size?: number; color?: string; dy?: number }> = ({ p, children, size = 36, color = c.ink, dy = 0 }) => (
  <div style={{ position: 'absolute', right: 1920 - p[0] + 22, top: p[1] + dy, transform: 'translateY(-50%)', ...text(size, 600, color) }}>{children}</div>
);

export const NordicMap: React.FC<{ pulse: number; bars: BarState[]; guide7: number; children?: React.ReactNode }> = ({ pulse, bars, guide7, children }) => (
  <AbsoluteFill style={{ background: c.sandSoft, fontFamily: font }}>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {contextPaths.map((d, i) => <path key={i} d={d} fill={c.rule} stroke={c.paper} strokeWidth={1.5} />)}
      {focusPaths.map((d, i) => <path key={i} d={d} fill={c.mapLand} stroke={c.paper} strokeWidth={2} />)}
      {/* shared scale: day-0 tick and the 7-day guide, drawn per row so they never cross a label */}
      {bars.map((b, i) => (
        <g key={i}>
          <line x1={SCALE.x0} y1={b.y - 26} x2={SCALE.x0} y2={b.y + 26} stroke={c.inkFaint} strokeWidth={2} opacity={b.leader} />
          <line x1={SCALE.x0 + dx(7)} y1={b.y - 26} x2={SCALE.x0 + dx(7)} y2={b.y + 26} stroke={c.accent} strokeWidth={2} strokeDasharray="5 6" opacity={guide7} />
        </g>
      ))}
    </svg>
      <Dot p={CITY.helsinki} color={c.inkFaint} r={7} />
      <CityLabel p={CITY.helsinki} size={32} color={c.inkFaint} dy={-30}>Helsinki</CityLabel>
      <Dot p={CITY.stockholm} color={c.accent} pulse={pulse} />
      <CityLabel p={CITY.stockholm}>Stockholm</CityLabel>
      <Dot p={CITY.kajaani} color={c.alarm} pulse={pulse} />
      <CityLabel p={CITY.kajaani}>Kajaani · Kainuu</CityLabel>
      {bars.map((b, i) => <Bar key={i} s={b} />)}
      {children}
    </AbsoluteFill>
);
