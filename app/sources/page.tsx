import { Tag } from "@/components/Provenance";
import { sources, sourcesByCategory, sourcesMeta } from "@/lib/sources";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  strategy: "Strategy",
  outcomes: "Outcomes",
  pilot: "Pilot / local practice",
  equity: "Equity",
  "nordic-pathway": "Nordic pathways",
  capacity: "Capacity",
  legal: "Legal",
  other: "Other",
};

export const metadata = {
  title: "Sources: CareGap FI",
  description:
    "Provenance vault: every published source behind CareGap FI figures, tagged by category.",
};

export default function SourcesPage() {
  const grouped = sourcesByCategory();
  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-2xl border-b border-rule pb-10">
        <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          Provenance vault
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Every UI figure must land here as Sourced, or be labelled Estimate /
          Unknown. {sourcesMeta.title ? `${sourcesMeta.title}. ` : ""}
          Compiled {sourcesMeta.compiled ?? "for Junction 2026"}. Rule:{" "}
          {sourcesMeta.rule ?? "Do not invent URLs or statistics."}
        </p>
        <p className="mt-3 text-sm text-ink-faint">
          {sources.length} records · tags follow source categories in{" "}
          <code className="rounded bg-paper-raised px-1.5 py-0.5 text-xs">
            data/sources.json
          </code>
        </p>
      </header>

      {sources.length === 0 ? (
        <p className="mt-10 border border-rule bg-paper-raised px-4 py-3 text-sm text-ink-soft">
          No sources loaded. Seed{" "}
          <code className="text-xs">data/sources.json</code> before demo.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <ul className="mt-4 divide-y divide-rule border-t border-b border-rule">
                {grouped[cat].map((s) => (
                  <li key={s.id} className="py-4">
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="rounded border border-accent/25 bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                        {cat}
                      </span>
                      <code className="text-[11px] text-ink-faint">{s.id}</code>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-ink">
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-rule underline-offset-2 hover:text-accent"
                        >
                          {s.title}
                        </a>
                      ) : (
                        <>
                          {s.title}{" "}
                          <span className="ml-1 inline-flex align-middle">
                            <Tag kind="unknown" />
                          </span>
                        </>
                      )}
                    </h3>
                    <p className="mt-1 text-xs text-ink-faint">
                      {s.publisher}
                      {s.accessed ? ` · accessed ${s.accessed}` : ""}
                      {!s.url ? " · URL pending confirmation" : ""}
                    </p>
                    {s.notes && (
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
                        {s.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-3 border-t border-rule pt-8">
        <Link
          href="/pilot"
          className="rounded-md border border-rule bg-paper-raised px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          Back to the experiment
        </Link>
        <Link
          href="/"
          className="rounded-md border border-rule bg-paper-raised px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          Back to the gap
        </Link>
      </div>
    </div>
  );
}
