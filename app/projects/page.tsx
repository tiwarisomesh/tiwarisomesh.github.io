import type { Metadata } from "next";
import { EntryCard } from "@/components/entry-card";
import { PageShell, Section } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Projects",
};

const projects = [
  {
    title: "Mixture of Experts Graph Transformer for Tau Identification",
    tags: ["Transformers", "MoE", "PyTorch"],
    status: "active" as const,
    github: "https://github.com/tiwarisomesh",
    body: "Writeup and code coming soon.",
  }
];

export default function ProjectsPage() {
  return (
    <PageShell
      title="Projects"
      lead="Research code, tools, and experiments."
      subtitle="Page Under Construction"
      topic="projects"
    >
      <Section title="Selected work" wide>
        <div className="grid gap-4">
          {projects.map(({ title, tags, body, status, github }) => (
            <EntryCard
              key={title}
              title={title}
              tags={tags}
              status={status}
              github={github}
            >
              {body}
            </EntryCard>
          ))}
        </div>
      </Section>

      <Section title="Other work">
        <p className="text-muted">
          Smaller projects, course assignments, and explorations will be listed here as they are made public.
        </p>
      </Section>
    </PageShell>
  );
}