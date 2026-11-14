// One component per segment. Each receives its own Seg (duration + beats from timings.json).
// Copy and data values live here; they are the sourced figures from the brief, nothing else.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import props from '../props.json';
import type { Seg } from './timeline';
import { c, safe, easeInOut, ease } from './tokens';
import { Card, Mark, Wordmark, inOut, prog, text, useT } from './ui';
import { CITY, NordicMap, type BarState } from './NordicMap';
import { AppShot } from './AppShot';

type P = { seg: Seg };
const counter = (t: number, start: number, length: number, to: number, from = 0) => from + (to - from) * prog(t, start, length, easeInOut);

// ── Map: Uppsala vs Kajaani on one day scale (follows the spoken hook) ──
export const HookMap: React.FC<P> = ({ seg }) => {
  const t = useT();
  const b = seg.beats;
  const sw = counter(t, b.swGrow, b.swGrowDur, 7);
  const swDone = prog(t, b.swGrow + b.swGrowDur, 0.35);
  const bars: BarState[] = [
    {
      y: CITY.uppsala[1], from: CITY.uppsala, leader: prog(t, b.swLeader, 0.45), days: sw,
      color: swDone > 0 ? c.accent : c.inkFaint, done: swDone, labelOpacity: prog(t, b.swLeader, 0.4),
      label: 'CT answer within days',
    },
    {
      y: CITY.kajaani[1], from: CITY.kajaani, leader: prog(t, b.kjLeader, 0.45),
      days: 55 * prog(t, b.kjGrow, b.kjGrowDur, ease), color: c.alarm, labelOpacity: prog(t, b.kjLeader, 0.4),
      label: <>Referral → diagnosis<br />~55 days (one study)</>,
    },
  ];
  return <NordicMap pulse={prog(t, b.pulse, 1.1, ease)} bars={bars} guide7={swDone} />;
};

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
    { y: CITY.uppsala[1], from: CITY.uppsala, leader: 1, days: 7, color: c.accent, done: 1, labelOpacity: 1, label: 'CT answer within days' },
    {
      y: CITY.kajaani[1], from: CITY.kajaani, leader: 1, days: kjDays, color: grow > 0 ? c.accent : c.alarm, labelOpacity: 1,
      label: (
        <div style={{ position: 'relative' }}>
          <div style={{ opacity: 1 - oldOut }}>Referral → diagnosis<br />~55 days (one study)</div>
          <div style={{ position: 'absolute', left: 0, bottom: 0, opacity: newIn }}>Liwe plan · day limits set<br />(estimate)</div>
        </div>
      ),
    },
  ];
  return <NordicMap pulse={0} bars={bars} guide7={1} />;
};

// ── callouts ───────────────────────────────────────────────
type Corner = 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right';
const place = (corner: Corner): React.CSSProperties => ({
  position: 'absolute',
  ...(corner.includes('top') ? { top: safe.y } : { bottom: safe.y }),
  ...(corner.includes('right') ? { right: safe.x } : { left: safe.x }),
});

/** Number callout card. `from`/`to` in seconds within the segment; `strong` = the alarm style with the firmer entrance. */
const Callout: React.FC<{ value: React.ReactNode; caption: string; from: number; to: number; position?: Corner; strong?: boolean }> = ({ value, caption, from, to, position = props.calloutPosition as Corner, strong }) => {
  const t = useT();
  const { p, o } = inOut(t, to, from, strong ? 0.5 : undefined);
  if (o <= 0) return null;
  const rule = prog(t, from + 0.15, 0.4);
  return (
    <div style={{ ...place(position), opacity: o, translate: strong ? `${(1 - p) * 64}px 0` : `0 ${(1 - p) * 16}px` }}>
      <Card tone={strong ? 'alarm' : 'default'} style={strong ? { display: 'flex', gap: 28, paddingLeft: 28 } : { border: `2px solid ${c.inkFaint}` }}>
        {strong && <div style={{ width: 8, borderRadius: 4, background: c.alarm, scale: `1 ${rule}`, transformOrigin: 'top' }} />}
        <div>
          <div style={text(96, 700, strong ? c.alarm : c.ink)}>{value}</div>
          <div style={{ ...text(32, 500, c.inkSoft), marginTop: 10 }}>{caption}</div>
        </div>
      </Card>
    </div>
  );
};

export const Callout_Survival: React.FC<P> = ({ seg }) => (
  <AbsoluteFill><Callout from={0} to={seg.duration} value={<><span style={{ color: c.alarm }}>17.9</span> vs 31.3</>} caption="5-year survival, men · NORDCAN" /></AbsoluteFill>
);

// ── the software (real app captures) ───────────────────────
/** Pick a county on the map, set scans a week. */
export const App_NewPlan: React.FC<P> = ({ seg }) => {
  const b = seg.beats;
  const cam = [{ t: 0, x: 960, y: 540, z: 1 }, { t: 0.5, x: 960, y: 540, z: 1 }, { t: 1.5, x: 1000, y: 506, z: 1.4 }];
  return (
    <AppShot
      views={[{ src: 'new_a', at: 0, cam }, { src: 'new_b', at: b.county, cam }, { src: 'new_c', at: b.scans, cam }]}
      pointer={[
        { t: 0, x: 1250, y: 760 }, { t: b.county - 0.5, x: 900, y: 283 }, { t: b.county - 0.25, x: 900, y: 283, click: true },
        { t: b.scans - 0.5, x: 580, y: 409 }, { t: b.scans - 0.25, x: 580, y: 409, click: true }, { t: seg.duration, x: 700, y: 470 },
      ]}
      marks={[{ rect: [1085, 195, 215, 420], from: b.county + 0.2 }]}
    />
  );
};

/** Time to diagnosis on the fast route. */
export const App_Diagnosis: React.FC<P> = ({ seg }) => {
  const b = seg.beats;
  return (
    <AppShot views={[{ src: 'plan', at: 0, cam: [{ t: 0, x: 900, y: 1000, z: 1.25 }, { t: 1.4, x: 680, y: 1118, z: 2.4 }] }]}
      marks={[{ rect: [490, 1032, 562, 68], from: b.callout + 0.5 }]}>
      <Callout from={b.callout} to={seg.duration} position="bottom-left" value={<>83 → <span style={{ color: c.accent }}>49</span> days</>} caption="time to diagnosis · estimate" />
    </AppShot>
  );
};

/** Visit → CT report, then cost per person, on the pilot-target card. */
export const App_CTReportCost: React.FC<P> = ({ seg }) => {
  const b = seg.beats;
  return (
    <AppShot views={[{ src: 'plan', at: 0, cam: [{ t: 0, x: 900, y: 700, z: 1.3 }, { t: 1.0, x: 662, y: 804, z: 2.3 }] }]}
      marks={[{ rect: [771, 722, 260, 80], from: b.ct + 0.2, to: b.cost - 0.3 }, { rect: [488, 722, 260, 80], from: b.cost + 0.2 }]}>
      <Callout from={b.ct} to={b.cost - 0.1} position="bottom-right" value={<span style={{ color: c.accent }}>day limits set</span>} caption="public visit → CT report · estimate" />
      <Callout from={b.cost + 0.15} to={seg.duration} position="bottom-right" value="€165" caption="per person scanned" />
    </AppShot>
  );
};

/** Cut the yearly funding in the plan inputs: the CT report slips to 22 days. */
export const App_BudgetCut: React.FC<P> = ({ seg }) => {
  const b = seg.beats;
  const inputs = [{ t: 0, x: 1000, y: 2560, z: 1.6 }];
  return (
    <AppShot
      views={[
        { src: 'cut_a', at: 0, cam: inputs },
        { src: 'cut_b', at: b.type, cam: inputs },
        { src: 'cut_b', at: b.reveal, cam: [{ t: b.reveal, x: 1080, y: 760, z: 1.6 }] },
      ]}
      pointer={[{ t: 0, x: 1350, y: 2700 }, { t: b.type - 0.6, x: 900, y: 2534 }, { t: b.type - 0.35, x: 900, y: 2534, click: true }, { t: b.reveal, x: 940, y: 2560 }]}
      marks={[
        { rect: [818, 2511, 239, 46], from: b.type + 0.1, to: b.reveal - 0.1, tone: 'alarm', view: 1 },
        { rect: [771, 722, 260, 80], from: b.alert, tone: 'alarm', view: 2 },
        { rect: [1104, 732, 556, 32], from: b.alert + 0.3, tone: 'alarm', view: 2 },
      ]}>
      <Callout strong from={b.alert} to={seg.duration} position="bottom-right" value={<>22 days <span style={{ color: c.ink }}>&gt; 10-day target</span></>} caption="funding cut" />
    </AppShot>
  );
};

/** Weekly tracking against the plan (demo feed). */
export const App_Tracking: React.FC<P> = () => (
  <AppShot views={[{ src: 'actual', at: 0, cam: [{ t: 0, x: 960, y: 540, z: 1 }, { t: 0.6, x: 960, y: 540, z: 1 }, { t: 1.8, x: 1080, y: 470, z: 1.45 }] }]}
    marks={[{ rect: [780, 188, 292, 134], from: 2.2 }]} />
);

// ── brand overlays ─────────────────────────────────────────
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

export const EndCard: React.FC<P> = () => {
  const t = useT();
  const step = (d: number) => {
    const p = prog(t, d, 0.4);
    return { opacity: p, translate: `0 ${(1 - p) * 14}px` };
  };
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
      </div>
    </AbsoluteFill>
  );
};

export const registry: Record<string, React.FC<P>> = {
  HookMap, Callout_Survival, LogoReveal, App_NewPlan, App_Diagnosis, App_CTReportCost, App_BudgetCut, App_Tracking,
  MapCallback, GoalCard, Tagline, EndCard,
};
