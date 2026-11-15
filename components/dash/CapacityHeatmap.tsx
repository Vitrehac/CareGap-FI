"use client";

import { useState } from "react";
import { counties } from "@/lib/data";
import { capacityShare } from "@/components/pilot/model";
import { num } from "@/lib/engine";

const CLAY: Rgb = [244, 214, 186];
const ALARM: Rgb = [168, 48, 36];
type Rgb = [number, number, number];

function mix(a: Rgb, b: Rgb, t: number): string {
  const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(a[0] + (b[0] - a[0]) * t)}${h(a[1] + (b[1] - a[1]) * t)}${h(a[2] + (b[2] - a[2]) * t)}`;
}

export function heatFill(share: number, lo: number, hi: number) {
  const t = hi <= lo ? 0.5 : Math.min(1, Math.max(0, (share - lo) / (hi - lo)));
  return mix(CLAY, ALARM, t);
}

export function CapacityHeatmap({ planned = [] }: { planned?: string[] }) {
  const rows = counties
    .filter((c) => !c.tooSmall && c.path)
    .map((c) => ({ c, share: capacityShare(c.ctPerWeekEst, c) }));
  const lo = Math.min(...rows.map((r) => r.share));
  const hi = Math.max(...rows.map((r) => r.share));
  const [hover, setHover] = useState<string | null>(null);
  const active = rows.find((r) => r.c.slug === hover) ?? null;

  return (
    <div>
      <svg viewBox="250 0 520 1000" role="img" aria-label="Finland heatmap. Darker red means the lung pathway would use more of that county's chest CT." className="mx-auto h-auto w-full max-h-[32rem]">
        {rows.map(({ c, share }) => {
          const on = planned.includes(c.slug);
          return (
            <path
              key={c.slug}
              d={c.path}
              fill={heatFill(share, lo, hi)}
              stroke={on ? "#1d2b25" : "#faf6f0"}
              strokeWidth={on ? 4 : 1.5}
              className="cursor-pointer outline-none"
              tabIndex={0}
              onMouseEnter={() => setHover(c.slug)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(c.slug)}
              onBlur={() => setHover(null)}
            >
              <title>{`${c.name}: ${num(share * 100, 1)}% of estimated chest CT`}</title>
            </path>
          );
        })}
      </svg>
      <div className="mt-3 flex items-center gap-3 text-xs text-ink-soft">
        <span>{num(lo * 100, 0)}%</span>
        <span className="h-2 flex-1 rounded-full" style={{ background: `linear-gradient(90deg, ${mix(CLAY, ALARM, 0)}, ${mix(CLAY, ALARM, 1)})` }} />
        <span>{num(hi * 100, 0)}%</span>
      </div>
      <p className="mt-2 text-xs text-ink-faint">Every county’s full lung pathway is above the 5% stop. Colour shows how far above. Estimate.</p>
      <p className="mt-1 min-h-5 text-sm text-ink">
        {active ? `${active.c.name} · ${num(active.share * 100, 1)}% · ${num(active.c.ctPerWeekEst, 1)} scans a week` : "Hover a county"}
      </p>
    </div>
  );
}
