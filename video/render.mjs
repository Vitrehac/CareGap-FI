// npm run render         → stills, master (ProRes 4444 + alpha), preview (H.264), segments.csv, table
// npm run render:stills  → stills + csv only (fast review loop)
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const stillsOnly = process.argv.includes('--stills-only');
const browserExecutable = fs.existsSync('/opt/pw-browsers') ? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell' : undefined;
const OUT = path.resolve('out');
fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true });

// Same maths as src/timeline.ts, so the CSV always matches the render.
const timings = JSON.parse(fs.readFileSync('timings.json', 'utf8'));
const { fps, gap } = timings;
const fr = (s) => Math.round(s * fps);
let cursor = 0;
const segs = timings.segments.map((s, i) => {
  const start = cursor, frames = fr(s.duration);
  cursor += frames + fr(gap);
  return { order: i + 1, ...s, start, end: start + frames, frames };
});
const tc = (frame) => {
  const ff = frame % fps, total = Math.floor(frame / fps);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(Math.floor(total / 3600))}:${p(Math.floor(total / 60) % 60)}:${p(total % 60)}:${p(ff)}`;
};

// CSV (end = exclusive out point, i.e. the first frame after the segment)
const rows = [['order', 'name', 'start_timecode', 'end_timecode', 'start_frame', 'end_frame', 'duration_s', 'type', 'intended_script_line']];
for (const s of segs) rows.push([s.order, s.name, tc(s.start), tc(s.end), s.start, s.end, s.duration, s.type, `line ${s.script}`]);
fs.writeFileSync(path.join(OUT, 'segments.csv'), rows.map((r) => r.join(',')).join('\n') + '\n');

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const comp = (preview) => selectComposition({ serveUrl, id: 'LiweMotionPack', inputProps: { preview }, browserExecutable });

// Stills: one key frame per segment, rendered on the grey preview background.
const pc = await comp(true);
for (const s of segs) {
  const frame = s.start + Math.min(s.frames - 1, fr(s.key));
  const file = path.join(OUT, 'stills', `${String(s.order).padStart(2, '0')}_${s.name}.png`);
  await renderStill({ composition: pc, serveUrl, output: file, frame, inputProps: { preview: true }, browserExecutable });
}
console.log(`stills → out/stills (${segs.length})`);

if (!stillsOnly) {
  const progress = (label) => ({ progress }) => { if (Math.round(progress * 100) % 10 === 0) process.stdout.write(`\r${label} ${Math.round(progress * 100)}%  `); };
  const master = await comp(false);
  await renderMedia({
    composition: master, serveUrl, outputLocation: path.join(OUT, 'liwe_motion_pack.mov'), inputProps: { preview: false }, browserExecutable,
    codec: 'prores', proResProfile: '4444', imageFormat: 'png', pixelFormat: 'yuva444p10le', onProgress: progress('master'),
  });
  console.log('\nmaster → out/liwe_motion_pack.mov');
  await renderMedia({
    composition: pc, serveUrl, outputLocation: path.join(OUT, 'liwe_motion_pack_preview.mp4'), inputProps: { preview: true }, browserExecutable,
    codec: 'h264', crf: 16, pixelFormat: 'yuv420p', imageFormat: 'png', onProgress: progress('preview'),
  });
  console.log('\npreview → out/liwe_motion_pack_preview.mp4');
}

console.table(segs.map((s) => ({ '#': s.order, name: s.name, in: tc(s.start), out: tc(s.end), 'dur s': s.duration, type: s.type, line: s.script })));
console.log(`Total: ${tc(segs.at(-1).end)} (${(segs.at(-1).end / fps).toFixed(1)} s, ${segs.at(-1).end} frames @ ${fps} fps)`);
