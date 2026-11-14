import { Shell } from "@/components/dash/Shell";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Shell>{children}</Shell>;
}
