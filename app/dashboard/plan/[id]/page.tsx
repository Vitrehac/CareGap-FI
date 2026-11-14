import { Suspense } from "react";
import type { Metadata } from "next";
import { PlanView } from "@/components/dash/PlanView";

export const metadata: Metadata = { title: "Plan: Liwe" };

export default function PlanPage() {
  return (
    <Suspense fallback={<p className="p-8 text-ink-faint">Loading plan…</p>}>
      <PlanView />
    </Suspense>
  );
}
