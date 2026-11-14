// Builds the master timeline from timings.json: segments in order, `gap` seconds of nothing between them.
import timings from '../timings.json';

export type SegType = 'fullscreen' | 'overlay';
export type Seg = {
  order: number;
  name: string;
  type: SegType;
  script: string;
  duration: number; // s
  key: number; // s, key frame for review stills
  beats: Record<string, number>;
  from: number; // frame
  frames: number;
};

export const FPS: number = timings.fps;
export const GAP: number = timings.gap;
export const f = (s: number) => Math.round(s * FPS);

export const segments: Seg[] = (() => {
  let cursor = 0;
  return timings.segments.map((s, i) => {
    const seg: Seg = {
      order: i + 1,
      name: s.name,
      type: s.type as SegType,
      script: s.script,
      duration: s.duration,
      key: s.key,
      beats: (s as { beats?: Record<string, number> }).beats ?? {},
      from: cursor,
      frames: f(s.duration),
    };
    cursor += seg.frames + f(GAP);
    return seg;
  });
})();

const last = segments[segments.length - 1];
export const TOTAL_FRAMES = last.from + last.frames;
