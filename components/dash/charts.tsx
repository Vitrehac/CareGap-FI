"use client";

import { useEffect, useRef, useState } from "react";

// Validated pair (dataviz validator, light surface): estimate green, actual blue; "no plan" is neutral gray.
export const SERIES = {
  estimate: "#1f8a5c",
  actual: "#3d63b8",
  none: "#9aa59f",
};

export type Series = { key: string; label: string; color: string; values: (number | null)[]; dashed?: boolean; area?: boolean };

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-soft">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-2">
          <svg width="18" height="8" aria-hidden>
            <line x1="1" y1="4" x2="17" y2="4" stroke={i.color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={i.dashed ? "3 4" : undefined} />
          </svg>
          {i.label}
        </span>
      ))}
    </div>
  );
}

/** multi-series line chart with a crosshair tooltip; one y-axis */
export function LineChart({
  labels,
  series,
  format = (v) => v.toLocaleString("en-GB", { maximumFractionDigits: 1 }),
  height = 220,
  yMin = 0,
}: {
  labels: string[];
  series: Series[];
  format?: (v: number) => string;
  height?: number;
  yMin?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = height;
  const pad = { l: 48, r: 22, t: 12, b: 26 };
  const all = series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const max = niceMax(Math.max(...all, yMin + 1));
  const n = labels.length;
  const x = (i: number) => pad.l + (n <= 1 ? (W - pad.l - pad.r) / 2 : (i * (W - pad.l - pad.r)) / (n - 1));
  const y = (v: number) => pad.t + (1 - (v - yMin) / (max - yMin)) * (H - pad.t - pad.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + f * (max - yMin));
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(W / 90))));

  const path = (vals: (number | null)[]) => {
    let d = "";
    let pen = false;
    vals.forEach((v, i) => {
      if (v === null) return (pen = false);
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  return (
    <div className="relative" ref={box}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        height={H}
        className="w-full"
        role="img"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (n - 1));
          setHover(Math.max(0, Math.min(n - 1, i)));
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#ebe1d4" strokeWidth="1" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-faint text-[11px]">
              {format(t)}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          i % every === 0 || i === n - 1 ? (
            <text key={l + i} x={x(i)} y={H - 6} textAnchor={i === n - 1 && n > 1 ? "end" : i === 0 && n > 1 ? "start" : "middle"} className="fill-ink-faint text-[11px]">
              {l}
            </text>
          ) : null,
        )}
        {series.map((s) =>
          s.area ? (
            <path key={s.key + "a"} d={`${path(s.values)}L${x(s.values.length - 1)} ${y(yMin)}L${x(0)} ${y(yMin)}Z`} fill={s.color} opacity="0.1" />
          ) : null,
        )}
        {series.map((s) => (
          <path key={s.key} d={path(s.values)} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dashed ? "4 5" : undefined} />
        ))}
        {series.map((s) => {
          const last = s.values.reduce<number>((a, v, i) => (v !== null ? i : a), -1);
          return last >= 0 ? <circle key={s.key + "e"} cx={x(last)} cy={y(s.values[last] as number)} r="4.5" fill={s.color} stroke="#fff" strokeWidth="2" /> : null;
        })}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="#c9bfb1" strokeWidth="1" />
            {series.map((s) => (s.values[hover] !== null ? <circle key={s.key + "h"} cx={x(hover)} cy={y(s.values[hover] as number)} r="4.5" fill={s.color} stroke="#fff" strokeWidth="2" /> : null))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 min-w-40 rounded-xl border border-rule bg-paper px-3 py-2 text-sm shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > n / 2 ? "-105%" : "5%"})` }}
        >
          <p className="font-semibold text-ink">{labels[hover]}</p>
          {series.map((s) =>
            s.values[hover] !== null ? (
              <p key={s.key} className="mt-0.5 flex items-center justify-between gap-4 text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
                <b className="text-ink">{format(s.values[hover] as number)}</b>
              </p>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

/** horizontal bars, value at the tip, hover highlights one row */
export function BarList({
  rows,
  format,
  highlight,
  highlightSet,
}: {
  rows: { key: string; label: string; value: number; sub?: string }[];
  format: (v: number) => string;
  highlight?: string;
  highlightSet?: Set<string>;
}) {
  const on = (k: string) => k === highlight || highlightSet?.has(k);
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.key} className="group grid grid-cols-[9.5rem_1fr] items-center gap-3 sm:grid-cols-[12rem_1fr]" title={`${r.label}: ${format(r.value)}${r.sub ? ` · ${r.sub}` : ""}`}>
          <span className={`truncate text-sm ${on(r.key) ? "font-semibold text-ink" : "text-ink-soft"}`}>{r.label}</span>
          <span className="flex items-center gap-2">
            <span
              className="h-3.5 rounded-r-[4px] transition-opacity group-hover:opacity-80"
              style={{ width: `${Math.max(1.5, (r.value / max) * 82)}%`, background: on(r.key) ? SERIES.estimate : "#b7d6c4" }}
            />
            <span className="whitespace-nowrap text-sm text-ink">{format(r.value)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** stacked horizontal bar for a journey (days per stage) */
export function JourneyBar({ stages, total, max }: { stages: { label: string; days: number; color: string }[]; total: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 gap-[2px]" style={{ width: `${(total / max) * 85}%` }}>
        {stages.map((s, i) => (
          <div
            key={s.label}
            title={`${s.label}: ${s.days} days`}
            className={`h-full ${i === 0 ? "rounded-l-[6px]" : ""} ${i === stages.length - 1 ? "rounded-r-[6px]" : ""}`}
            style={{ width: `${(s.days / total) * 100}%`, background: s.color }}
          />
        ))}
      </div>
      <span className="whitespace-nowrap text-sm font-semibold text-ink">{total} days</span>
    </div>
  );
}
