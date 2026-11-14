// The master timeline: every segment in order, separated by GAP seconds of nothing.
// Transparent by default; `preview` adds a mid-grey background and safe-area guides.
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { segments } from './timeline';
import { registry } from './segments';

const SafeGuides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {/* action safe 5% / title safe 10% */}
    <div style={{ position: 'absolute', inset: '5%', border: '1px solid rgba(255,255,255,0.35)' }} />
    <div style={{ position: 'absolute', inset: '10%', border: '1px dashed rgba(255,255,255,0.25)' }} />
  </AbsoluteFill>
);

export const MotionPack: React.FC<{ preview?: boolean }> = ({ preview = false }) => (
  <AbsoluteFill style={{ background: preview ? '#808080' : 'transparent' }}>
    {segments.map((seg) => {
      const C = registry[seg.name];
      if (!C) throw new Error(`No component for segment "${seg.name}" (check timings.json)`);
      return (
        <Sequence key={seg.name} name={`${seg.order}. ${seg.name}`} from={seg.from} durationInFrames={seg.frames}>
          <C seg={seg} />
        </Sequence>
      );
    })}
    {preview && <SafeGuides />}
  </AbsoluteFill>
);
