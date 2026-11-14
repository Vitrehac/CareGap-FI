import type { Metadata } from "next";
import { PlansOverview } from "@/components/dash/PlansOverview";

export const metadata: Metadata = { title: "Plans: Liwe" };

export default function DashboardPage() {
  return <PlansOverview />;
}
