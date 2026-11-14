import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Mascot } from "@/components/Mascot";
import "./globals.css";

// One friendly, highly readable typeface for everything
const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Liwe: catch lung cancer sooner",
  description:
    "Plan, fund and track faster lung-cancer diagnosis in Finnish wellbeing-services counties — see how many lives an investment saves, and whether it actually does.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="min-h-screen font-sans">
        {children}
        <Mascot />
      </body>
    </html>
  );
}
