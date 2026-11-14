import type { Metadata } from "next";
import { DataSources } from "@/components/dash/DataSources";

export const metadata: Metadata = { title: "Data sources: Liwe" };

export default function DataPage() {
  return <DataSources />;
}
