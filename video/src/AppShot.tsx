// Fullscreen footage of the real Liwe app, built from 2x captures (capture/capture.cjs).
// Anti-shimmer rules: the camera only moves during short eases and is perfectly still otherwise
// (no constant drift), and every position and size is snapped to whole pixels.
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion';
import rects from './app-rects.json';
import { c, easeInOut } from './tokens';
import { prog, useT } from './ui';

export type Cam = { t: number; x: number; y: number; z: number }; // page px at screen centre, zoom (1 = app at 100%)
export type View = { src: string; at: number; cam: Cam[] }; // a screenshot state, crossfaded in at `at`
export type Mark = { rect: [number, number, number, number]; from: number; to?: number; tone?: 'accent' | 'alarm'; view?: number };
export type Pointer = { t: number; x: number; y: number; click?: boolean };

const pageH = (src: string) => (rects as Record<string, { pageH: number }>)[src].pageH;
const clamp = (k: Cam, h: number): Cam => {
  const hw = 960 / k.z, hh = 540 / k.z;
  return { ...k, x: Math.min(Math.max(k.x, hw), 1920 - hw), y: Math.min(Math.max(k.y, hh), h - hh) };
};

function camAt(keys: Cam[], t: number, h: number): Cam {
  const ks = keys.map((k) => clamp(k, h));
  if (t <= ks[0].t) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b.t) {
      const p = easeInOut((t - a.t) / (b.t - a.t));
      const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * p); // zoom feels linear in log space
      return clamp({ t, x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, z }, h);
    }
  }
  return ks[ks.length - 1];
}

const toScreen = (cam: Cam) => (x: number, y: number) => ({ x: 960 + (x - cam.x) * cam.z, y: 540 + (y - cam.y) * cam.z });

const Highlight: React.FC<{ m: Mark; cam: Cam; t: number }> = ({ m, cam, t }) => {
  const a = prog(t, m.from, 0.3) * (m.to === undefined ? 1 : 1 - prog(t, m.to, 0.25));
  if (a <= 0) return null;
  const s = toScreen(cam)(m.rect[0], m.rect[1]);
  const pad = 8;
  const col = m.tone === 'alarm' ? c.alarm : c.accent;
  return (
    <div style={{
      position: 'absolute', left: Math.round(s.x - pad), top: Math.round(s.y - pad),
      width: Math.round(m.rect[2] * cam.z + 2 * pad), height: Math.round(m.rect[3] * cam.z + 2 * pad),
      border: `4px solid ${col}`, borderRadius: 18, opacity: a,
    }} />
  );
};

const Cursor: React.FC<{ keys: Pointer[]; cam: Cam; t: number }> = ({ keys, cam, t }) => {
  let x = keys[0].x, y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t <= b.t) { const p = easeInOut((t - a.t) / Math.max(1e-6, b.t - a.t)); x = a.x + (b.x - a.x) * p; y = a.y + (b.y - a.y) * p; break; }
    if (t > b.t) { x = b.x; y = b.y; }
  }
  const s = toScreen(cam)(x, y);
  const click = [...keys].reverse().find((k) => k.click && k.t <= t);
  const dt = click ? t - click.t : 9;
  const press = dt < 0.2 ? 0.9 : 1;
  const ring = Math.min(1, dt / 0.45);
  const fade = interpolate(t, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <>
      {dt < 0.45 && <div style={{ position: 'absolute', left: Math.round(s.x - 30 * ring), top: Math.round(s.y - 30 * ring), width: Math.round(60 * ring), height: Math.round(60 * ring), borderRadius: '50%', border: `3px solid ${c.accent}`, opacity: 1 - ring }} />}
      <svg width={34} height={40} viewBox="0 0 30 34" style={{ position: 'absolute', left: Math.round(s.x - 4), top: Math.round(s.y - 3), opacity: fade, scale: String(press), transformOrigin: '4px 3px' }}>
        <path d="M3 2 L3 26 L9.5 20 L14 30.5 L18.5 28.5 L14 18.5 L23 18.5 Z" fill={c.ink} stroke={c.paper} strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** One camera per view; views crossfade, so a view can also be the same screenshot from a new angle (an edit cut). */
export const AppShot: React.FC<{ views: View[]; marks?: Mark[]; pointer?: Pointer[]; children?: React.ReactNode }> = ({ views, marks = [], pointer, children }) => {
  const t = useT();
  const XF = 0.3;
  const active = views.reduce((acc, v, i) => (t >= v.at ? i : acc), 0);
  const cams = views.map((v) => camAt(v.cam, t, pageH(v.src)));
  return (
    <AbsoluteFill style={{ background: c.sandSoft, overflow: 'hidden' }}>
      {views.map((v, i) => {
        const o = i === 0 ? 1 : prog(t, v.at, XF);
        if (o <= 0 || i > active) return null;
        const cam = cams[i];
        const o0 = toScreen(cam)(0, 0);
        return (
          <Img key={i} src={staticFile(`app/${v.src}.png`)} style={{
            position: 'absolute', left: Math.round(o0.x), top: Math.round(o0.y), opacity: o,
            width: Math.round(1920 * cam.z), height: Math.round(pageH(v.src) * cam.z), maxWidth: 'none',
          }} />
        );
      })}
      {marks.map((m, i) => <Highlight key={i} m={m} cam={cams[m.view ?? active]} t={t} />)}
      {pointer && <Cursor keys={pointer} cam={cams[active]} t={t} />}
      {children}
    </AbsoluteFill>
  );
};
