import type { Metadata } from "next";
import { NewPlan } from "@/components/dash/NewPlan";

export const metadata: Metadata = { title: "New plan: Liwe" };

export default function NewPlanPage() {
  return <NewPlan />;
}
