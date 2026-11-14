import { Suspense } from "react";
import { PilotWizard } from "@/components/pilot/PilotWizard";

export const metadata = {
  title: "Scenario: Liwe",
  description:
    "Pick a county, choose how to change the lung-cancer pathway, and see how many days and lives it saves.",
};

export default function PilotPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Suspense fallback={<p className="pt-10 text-sm text-ink-faint">Loading…</p>}>
        <PilotWizard />
      </Suspense>
    </div>
  );
}
