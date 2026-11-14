import { Tag } from "@/components/Provenance";
import { sources, sourcesByCategory } from "@/lib/sources";
import Link from "next/link";
import { statSync } from "node:fs";
import { join } from "node:path";
import { DOWNLOADS, type Download } from "@/lib/downloads";

const KIND_LABELS: Record<Download["kind"], string> = {
  data: "Datasets",
  chart: "Charts",
  reference: "Reference tables",
};

function fileSize(href: string) {
  try {
    const bytes = statSync(join(process.cwd(), "public", href)).size;
    return bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} kB`;
  } catch {
    return "";
  }
}

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
  title: "Sources: Liwe",
  description:
    "Provenance vault: every published source behind Liwe figures, tagged by category.",
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
          Every number in Liwe comes from here.
        </p>
      </header>

      {/* the files every figure was computed from — downloadable as-is */}
      <section id="data" className="mt-10 scroll-mt-28">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Download the data</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
          The public extracts and charts the figures were computed from, exactly as the research
          pipeline uses them. Aggregate data only; no patient-level records.
        </p>
        {(["data", "chart", "reference"] as const).map((kind) => (
          <div key={kind} className="mt-8">
            <h3 className="label text-ink-faint">{KIND_LABELS[kind]}</h3>
            <ul className="mt-3 divide-y divide-rule border-t border-b border-rule">
              {DOWNLOADS.filter((d) => d.kind === kind).map((d) => (
                <li key={d.file} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-sm font-semibold text-ink">{d.title}</p>
                    <p className="mt-1 text-xs text-ink-faint">
                      {d.url ? (
                        <a href={d.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                          {d.owner} ↗
                        </a>
                      ) : (
                        d.owner
                      )}
                    </p>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
                      {d.contents} <span className="text-ink-faint">Used for: {d.usedFor}</span>
                    </p>
                  </div>
                  <a
                    href={d.href}
                    download
                    className="hack label mt-2 inline-flex items-center justify-between gap-4 border border-rule bg-paper/60 px-4 py-2.5 text-ink-soft sm:mt-0 sm:min-w-[15rem]"
                  >
                    <span>{d.file}</span>
                    <span className="nums text-ink-faint">{fileSize(d.href)} ↓</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <h2 className="font-display mt-16 text-2xl text-ink sm:text-3xl">Citations</h2>
      {sources.length === 0 ? (
        <p className="mt-10 border border-rule bg-paper-raised px-4 py-3 text-sm text-ink-soft">
          No sources loaded. Seed{" "}
          <code className="text-xs">data/sources.json</code> before demo.
        </p>
      ) : (
        <div className="mt-8 space-y-12">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <ul className="mt-4 divide-y divide-rule border-t border-b border-rule">
                {grouped[cat].map((s) => (
                  <li key={s.id} className="py-4">
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="border border-accent/25 bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
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
          className="hack label border border-rule bg-paper/60 px-5 py-3 text-ink-soft"
        >
          Back to the experiment
        </Link>
        <Link
          href="/"
          className="hack label border border-rule bg-paper/60 px-5 py-3 text-ink-soft"
        >
          Back to the gap
        </Link>
      </div>
    </div>
  );
}
