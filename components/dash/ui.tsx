"use client";

import type { ReactNode } from "react";
import { Tip } from "@/components/mithril/Tip";
import { VERDICT } from "@/lib/engine";

export function Page({ title, sub, actions, children }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] text-ink">{title}</h1>
          {sub && <div className="mt-1 text-ink-soft">{sub}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function Card({ title, aside, children, className = "" }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-rule bg-paper p-5 sm:p-6 ${className}`}>
      {(title || aside) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-semibold text-ink">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function Kpi({ label, value, sub, tip, tone = "ink", big }: { label: string; value: ReactNode; sub?: ReactNode; tip?: { title: string; body: ReactNode }; tone?: "ink" | "accent" | "blue"; big?: boolean }) {
  const color = tone === "accent" ? "text-accent" : tone === "blue" ? "text-[#3d63b8]" : "text-ink";
  return (
    <div className="rounded-3xl border border-rule bg-paper p-5">
      <p className="text-sm font-semibold text-ink-soft">{tip ? <Tip align="left" title={tip.title} body={tip.body}>{label}</Tip> : label}</p>
      <p className={`font-display mt-2 leading-none ${big ? "text-[clamp(2.6rem,5vw,3.6rem)]" : "text-[2.2rem]"} ${color}`}>{value}</p>
      {sub && <p className="mt-2 text-sm text-ink-faint">{sub}</p>}
    </div>
  );
}

export function VerdictPill({ v }: { v: keyof typeof VERDICT }) {
  const t = VERDICT[v];
  const cls = t.tone === "good" ? "bg-accent-soft text-accent" : t.tone === "warn" ? "bg-[#fbf0d9] text-[#8a5a00]" : "bg-alarm-soft text-[#b13d29]";
  const icon = t.tone === "good" ? "M5 12.5l4 4 10-10" : t.tone === "warn" ? "M12 7v6M12 17h.01" : "M7 7l10 10M17 7 7 17";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
        <path d={icon} />
      </svg>
      {t.label}
    </span>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-sm text-ink-faint">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export function NumberInput({ value, onChange, prefix, suffix, step = 1, min = 0 }: { value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; step?: number; min?: number }) {
  return (
    <span className="flex items-center rounded-2xl border border-rule bg-paper px-3 focus-within:border-accent">
      {prefix && <span className="text-ink-faint">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        className="w-full min-w-0 bg-transparent px-2 py-2.5 text-ink outline-none"
      />
      {suffix && <span className="whitespace-nowrap text-sm text-ink-faint">{suffix}</span>}
    </span>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[] }) {
  return (
    <div className="inline-flex rounded-full border border-rule bg-paper p-1" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${value === o.value ? "bg-accent text-paper" : "text-ink-soft hover:text-ink"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
