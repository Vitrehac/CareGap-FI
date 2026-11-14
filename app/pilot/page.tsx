import { Suspense } from "react";
import { PilotWorkbench } from "@/components/PilotWorkbench";

export const metadata = {
  title: "Experiment: CareGap FI",
  description:
    "Pick a county, configure a 12-month CT handoff experiment, and get a printable pilot brief with process clocks and a stop rule.",
};

export default function PilotPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="max-w-2xl border-b border-rule pb-8">
        <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          Build the county experiment
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          County → clocks → brief. Defaults are filled for Kainuu. Not AI
          diagnosis.
        </p>
      </header>
      <Suspense
        fallback={
          <p className="pt-10 text-sm text-ink-faint">Loading experiment…</p>
        }
      >
        <PilotWorkbench />
      </Suspense>
    </div>
  );
}
