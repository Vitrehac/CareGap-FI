// Shared building blocks: font, timing helpers, card, logo.
import React from 'react';
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { c, font, radius, border, ease, easeIn, dur, wordmark } from './tokens';

// Figtree is the app's only typeface (next/font in app/layout.tsx). Full variable file so → ≤ € ě render.
loadFont({ family: 'Figtree', url: staticFile('fonts/Figtree-wght.ttf'), weight: '300 900' });

/** Seconds since the start of the current <Sequence>. */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** 0→1 progress of a timed ease. */
export const prog = (t: number, start: number, length: number, easing = ease) =>
  interpolate(t, [start, start + length], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** Entrance at `start`, exit ending at `end`. Returns {p: entrance progress, o: combined opacity}. */
export const inOut = (t: number, end: number, start = 0, inLen = dur.in) => {
  const p = prog(t, start, inLen);
  const out = 1 - prog(t, end - dur.out, dur.out, easeIn);
  return { p, o: p * out, out };
};

export const text = (size: number, weight = 600, color = c.ink): React.CSSProperties => ({
  fontFamily: font,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.12,
  letterSpacing: size >= 56 ? '-0.02em' : '-0.005em',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
});

/** Flat card: bg-paper, border-rule, rounded-3xl. No shadow. */
export const Card: React.FC<{ style?: React.CSSProperties; tone?: 'default' | 'alarm'; children: React.ReactNode }> = ({ style, tone = 'default', children }) => (
  <div
    style={{
      background: tone === 'alarm' ? c.alarmSoft : c.paper,
      border: tone === 'alarm' ? `2px solid ${c.alarm}` : border,
      borderRadius: radius.card,
      padding: '28px 36px',
      ...style,
    }}
  >
    {children}
  </div>
);

const WAVE = 'M7 24c7 0 8 18 13 18s6-18 12-18 7 18 12 18 6-18 13-18';
const WAVE_LEN = 92;

/** The Liwe mark (components/mithril/Mark.tsx). `draw` 0..1 strokes it on. */
export const Mark: React.FC<{ size: number; draw?: number; color?: string }> = ({ size, draw = 1, color = c.accent }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block', overflow: 'visible' }}>
    <path d={WAVE} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={WAVE_LEN} strokeDashoffset={WAVE_LEN * (1 - draw)} />
  </svg>
);

/** Mark + "liwe" wordmark, proportions from the site header. */
export const Wordmark: React.FC<{ size: number; draw?: number }> = ({ size, draw = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * wordmark.gapRatio }}>
    <Mark size={size * wordmark.markRatio} draw={draw} />
    <span style={{ fontFamily: font, fontSize: size, fontWeight: wordmark.weight, letterSpacing: wordmark.tracking, color: c.ink, lineHeight: 1 }}>liwe</span>
  </div>
);

/** Simple check glyph (Figtree has no ✓). */
export const Check: React.FC<{ size: number; color?: string; bg?: string; draw?: number }> = ({ size, color = c.paper, bg = c.accent, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block' }}>
    <circle cx={20} cy={20} r={20} fill={bg} />
    <path d="M11 20.5 L17.5 27 L29 14" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={30} strokeDashoffset={30 * (1 - draw)} />
  </svg>
);
