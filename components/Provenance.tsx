import type { Provenance } from "@/lib/types";

const STYLES: Record<Provenance, string> = {
  sourced: "bg-accent-soft text-accent border-accent/25",
  estimate: "bg-paper-raised text-ink-soft border-rule",
  unknown: "bg-alarm-soft text-alarm border-alarm/25",
};

const LABELS: Record<Provenance, string> = {
  sourced: "Sourced",
  estimate: "Estimate",
  unknown: "Unknown",
};

export function Tag({ kind }: { kind: Provenance }) {
  return (
    <span
      className={`inline-block shrink-0 border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STYLES[kind]}`}
    >
      {LABELS[kind]}
    </span>
  );
}

/**
 * A number on screen. Every one of these carries its provenance and the source
 * it came from, because unsupported figures are the fastest way to lose a judge.
 */
export function Figure({
  value,
  label,
  kind,
  source,
  tone = "normal",
}: {
  value: string;
  label: string;
  kind: Provenance;
  source: string;
  tone?: "normal" | "alarm";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-2">
        <span
          className={`font-display text-4xl leading-none ${
            tone === "alarm" ? "text-alarm" : "text-ink"
          }`}
        >
          {value}
        </span>
        <Tag kind={kind} />
      </div>
      <span className="text-sm font-medium text-ink">{label}</span>
      <span className="text-xs leading-snug text-ink-faint">{source}</span>
    </div>
  );
}
