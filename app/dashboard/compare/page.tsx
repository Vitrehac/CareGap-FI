import type { Metadata } from "next";
import { Compare } from "@/components/dash/Compare";

export const metadata: Metadata = { title: "Compare plans: Liwe" };

export default function ComparePage() {
  return <Compare />;
}
