import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "About" };


export default function AboutPage() {
  return (
    <PageShell
      title="About"
      lead="I will be adding more information about myself, my research, and my work here soon."
      subtitle="Page under construction"
      topic="about"
    >
      <div className="space-y-16">
      </div>
    </PageShell>
  );
}