// One component per segment. Each receives its own Seg (duration + beats from timings.json).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import props from '../props.json';
import type { Seg } from './timeline';
import { c, safe, easeInOut, ease } from './tokens';
import { Card, Mark, Wordmark, inOut, prog, text, useT } from './ui';
import { CITY, NordicMap, type BarState } from './NordicMap';

type P = { seg: Seg };
const counter = (t: number, start: number, length: number, to: number, from = 0) => from + (to - from) * prog(t, start, length, easeInOut);

// ── 1) HookMap ─────────────────────────────────────────────
export const HookMap: React.FC<P> = ({ seg }) => {
  const t = useT();
  const b = seg.beats;
  const title = prog(t, b.title, 0.45);
  const sw = counter(t, b.swGrow, b.swGrowDur, 7);
  const swDone = prog(t, b.swGrow + b.swGrowDur, 0.35);
  const bars: BarState[] = [
    {
      y: CITY.stockholm[1], from: CITY.stockholm, leader: prog(t, b.swLeader, 0.45), days: sw,
      color: swDone > 0 ? c.accent : c.inkFaint, done: swDone, labelOpacity: prog(t, b.swLeader, 0.4),
      label: 'CT answer · target ≤ 7 days',
    },
    {
      y: CITY.kajaani[1], from: CITY.kajaani, leader: prog(t, b.kjLeader, 0.45),
      days: 55 * prog(t, b.kjGrow, b.kjGrowDur, ease), color: c.alarm, labelOpacity: prog(t, b.kjLeader, 0.4),
      label: <>Referral → diagnosis<br />~55 days (one study)</>,
    },
  ];
  return (
    <NordicMap pulse={prog(t, b.pulse, 1.1, ease)} bars={bars} guide7={swDone}>
      <div style={{ position: 'absolute', left: safe.x, top: safe.y, opacity: title, translate: `0 ${(1 - title) * 16}px` }}>
        <Card style={{ padding: '36px 44px' }}>
          <div style={{ ...text(80, 700), lineHeight: 1.08 }}>Same cough.<br />Different wait.</div>
        </Card>
      </div>
    </NordicMap>
  );
};

// ── 10) MapCallback ────────────────────────────────────────
export const MapCallback: React.FC<P> = ({ seg }) => {
  const t = useT();
  const b = seg.beats;
  const shrink = prog(t, b.reset, b.resetDur, easeInOut);
  const grow = prog(t, b.grow, b.growDur, easeInOut);
  // sequential swap: old label out (0.2 s), then new label in (0.3 s); never both at once
  const oldOut = prog(t, b.reset, 0.2);
  const newIn = prog(t, b.reset + b.resetDur, 0.3);
  const kjDays = grow > 0 ? 7 * grow : 55 * (1 - shrink);
  const bars: BarState[] = [
    { y: CITY.stockholm[1], from: CITY.stockholm, leader: 1, days: 7, color: c.accent, done: 1, labelOpacity: 1, label: 'CT answer · target ≤ 7 days' },
    {
      y: CITY.kajaani[1], from: CITY.kajaani, leader: 1, days: kjDays, color: grow > 0 ? c.accent : c.alarm, labelOpacity: 1,
      label: (
        <div style={{ position: 'relative' }}>
          <div style={{ opacity: 1 - oldOut }}>Referral → diagnosis<br />~55 days (one study)</div>
          <div style={{ position: 'absolute', left: 0, bottom: 0, opacity: newIn }}>Liwe plan · ~7 days to CT report<br />(estimate)</div>
        </div>
      ),
    },
  ];
  return <NordicMap pulse={0} bars={bars} guide7={1} />;
};

// ── overlays ───────────────────────────────────────────────
type Corner = 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right';
const place = (corner: Corner): React.CSSProperties => ({
  position: 'absolute',
  ...(corner.includes('top') ? { top: safe.y } : { bottom: safe.y }),
  ...(corner.includes('right') ? { right: safe.x } : { left: safe.x }),
});

/** Number callout. Default top-right so it never covers the app UI you punch into. */
const Callout: React.FC<P & { value: React.ReactNode; caption: string; position?: Corner }> = ({ seg, value, caption, position = props.calloutPosition as Corner }) => {
  const t = useT();
  const { p, o } = inOut(t, seg.duration);
  return (
    <AbsoluteFill>
      <div style={{ ...place(position), opacity: o, translate: `0 ${(1 - p) * 16}px` }}>
        <Card>
          <div style={text(96, 700)}>{value}</div>
          <div style={{ ...text(32, 500, c.inkSoft), marginTop: 10 }}>{caption}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const Callout_Survival: React.FC<P> = ({ seg }) => (
  <Callout seg={seg} value={<><span style={{ color: c.alarm }}>17.9</span> vs 31.3</>} caption="5-year survival, men · NORDCAN" />
);
export const Callout_Diagnosis: React.FC<P> = ({ seg }) => (
  <Callout seg={seg} value={<>83 → <span style={{ color: c.accent }}>49</span> days</>} caption="time to diagnosis · estimate" />
);
export const Callout_CTReport: React.FC<P> = ({ seg }) => (
  <Callout seg={seg} value={<span style={{ color: c.accent }}>~7 days</span>} caption="public visit → CT report · estimate" />
);
export const Callout_Cost: React.FC<P> = ({ seg }) => <Callout seg={seg} value="€165" caption="per person scanned" />;

/** The only callout with a stronger entrance: slides in from the right while its alarm rule wipes down. */
export const Callout_BudgetCut: React.FC<P> = ({ seg }) => {
  const t = useT();
  const { p, o } = inOut(t, seg.duration, 0, 0.5);
  const rule = prog(t, 0.15, 0.4);
  return (
    <AbsoluteFill>
      <div style={{ ...place(props.calloutPosition as Corner), opacity: o, translate: `${(1 - p) * 64}px 0` }}>
        <Card tone="alarm" style={{ display: 'flex', gap: 28, paddingLeft: 28 }}>
          <div style={{ width: 8, borderRadius: 4, background: c.alarm, scale: `1 ${rule}`, transformOrigin: 'top' }} />
          <div>
            <div style={text(96, 700, c.alarm)}>22 days <span style={{ color: c.ink }}>&gt; 10-day target</span></div>
            <div style={{ ...text(32, 500, c.inkSoft), marginTop: 10 }}>funding cut</div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/** Lower third: name + role, lower-left, slides in from the left. */
const LowerThird: React.FC<P & { who: { name: string; role: string } }> = ({ seg, who }) => {
  const t = useT();
  const { p, o } = inOut(t, seg.duration);
  return (
    <AbsoluteFill>
      <div style={{ ...place('bottom-left'), opacity: o, translate: `${(p - 1) * 32}px 0` }}>
        <Card style={{ display: 'flex', gap: 24, padding: '24px 40px 24px 26px' }}>
          <div style={{ width: 8, borderRadius: 4, background: c.accent }} />
          <div>
            <div style={text(52, 700)}>{who.name}</div>
            <div style={{ ...text(32, 500, c.inkSoft), marginTop: 6 }}>{who.role}</div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
export const LowerThird_P1: React.FC<P> = ({ seg }) => <LowerThird seg={seg} who={props.p1} />;
export const LowerThird_P2: React.FC<P> = ({ seg }) => <LowerThird seg={seg} who={props.p2} />;
export const LowerThird_P3: React.FC<P> = ({ seg }) => <LowerThird seg={seg} who={props.p3} />;

/** Logo: mask wipe left to right + scale 96→100% + fade, lower-left. */
export const LogoReveal: React.FC<P> = ({ seg }) => {
  const t = useT();
  const { p, o } = inOut(t, seg.duration, 0, 0.5);
  const mask = prog(t, 0, 0.5);
  return (
    <AbsoluteFill>
      <div style={{ ...place('bottom-left'), opacity: o, scale: String(0.96 + 0.04 * p), transformOrigin: 'left bottom' }}>
        <Card style={{ padding: '28px 44px 32px 36px' }}>
          <div style={{ clipPath: `inset(0 ${(1 - mask) * 100}% 0 0)` }}>
            <Wordmark size={96} draw={prog(t, 0, 0.5)} />
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const GoalCard: React.FC<P> = ({ seg }) => {
  const t = useT();
  const { p, o } = inOut(t, seg.duration);
  return (
    <AbsoluteFill>
      <div style={{ ...place(props.calloutPosition as Corner), opacity: o, translate: `0 ${(1 - p) * 16}px` }}>
        <Card style={{ padding: '32px 40px' }}>
          <div style={text(32, 650, c.accent)}>Goal 3 · National Cancer Strategy 2026–2035</div>
          <div style={{ ...text(52, 700), marginTop: 14, lineHeight: 1.15 }}>Nordic-level survival<br />for cancers like lung cancer</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const Tagline: React.FC<P> = ({ seg }) => {
  const t = useT();
  const { p, o } = inOut(t, seg.duration);
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', bottom: 150, opacity: o, translate: `0 ${(1 - p) * 16}px` }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '26px 48px 26px 36px', borderRadius: 999 }}>
          <Mark size={72} />
          <div style={text(64, 700)}>Liwe. Find lung cancer sooner.</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ── 14) EndCard ────────────────────────────────────────────
export const EndCard: React.FC<P> = () => {
  const t = useT();
  const step = (d: number) => {
    const p = prog(t, d, 0.4);
    return { opacity: p, translate: `0 ${(1 - p) * 14}px` };
  };
  const names = [props.p1.name, props.p2.name, props.p3.name].join(' · ');
  return (
    <AbsoluteFill style={{ background: c.sandSoft, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={step(0)}><Wordmark size={150} draw={prog(t, 0, 0.6)} /></div>
        <div style={{ ...text(64, 650, c.ink), marginTop: 40, ...step(0.25) }}>Find lung cancer sooner.</div>
        <div style={{ display: 'flex', gap: 48, marginTop: 64, ...step(0.5) }}>
          <span style={text(36, 600, c.accent)}>{props.liveUrl}</span>
          <span style={text(36, 600, c.inkSoft)}>{props.repoUrl}</span>
        </div>
        <div style={{ width: 120, height: 2, background: c.rule, margin: '44px 0 36px', ...step(0.65) }} />
        <div style={{ ...text(32, 500, c.inkSoft), ...step(0.75) }}>{props.event}</div>
        <div style={{ ...text(32, 500, c.inkFaint), marginTop: 14, ...step(0.85) }}>{names}</div>
      </div>
    </AbsoluteFill>
  );
};

export const registry: Record<string, React.FC<P>> = {
  HookMap, LowerThird_P1, Callout_Survival, LogoReveal, LowerThird_P2, Callout_Diagnosis, Callout_CTReport,
  Callout_Cost, Callout_BudgetCut, MapCallback, LowerThird_P3, GoalCard, Tagline, EndCard,
};

