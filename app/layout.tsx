import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flowstate — Focused project management",
  description: "A responsive Kanban workspace for SaaS product teams, built with Next.js, TypeScript and Supabase.",
  keywords: ["Kanban", "SaaS", "Next.js", "TypeScript", "Supabase", "frontend portfolio"],
  openGraph: {
    title: "Flowstate — Focused project management",
    description: "Plan, prioritize and ship work in a focused Kanban workspace.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
