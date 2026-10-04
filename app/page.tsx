import type { ComponentProps } from "react";
import { DefList } from "@/components/about/DefList";
import { EntryCard, EntryList } from "@/components/entry-card";
import { Hero } from "@/components/home/hero";
import { MathBackdrop } from "@/components/home/event-backdrop";
import { Section } from "@/components/page-shell";

type Work = Omit<ComponentProps<typeof EntryCard>, "children"> & { body: string };

const work: Work[] = [
  {
    title: "Machine learning for anomaly detection",
    status: "active",
    tags: ["Unsupervised learning", "Beyond the Standard Model"],
    body: "Unsupervised architectures for finding rare beyond-Standard-Model event signatures. Writeup and code coming soon.",
  },
  {
    title: "Mixture of Experts Graph Transformer for Tau Identification",
    tags: ["Transformers", "Mixture of experts", "PyTorch"],
    status: "active" as const,
    body: "Writeup and code coming soon.",
  },
];

export default function Home() {
  return (
    <>
      <Hero>
        <MathBackdrop />
      </Hero>

      <div className="wrap grid gap-16 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
        <div className="space-y-16 gap-4">
          <Section title="Selected work" wide>
            <EntryList>
            <div className="grid gap-4">
              {work.map(({ body, ...props }) => (
                <EntryCard key={props.title} {...props}>
                  {body}
                </EntryCard>
              ))}
            </div>   
            </EntryList>
          </Section>
        </div>

        <aside className="space-y-12 lg:sticky lg:top-24 lg:self-start">
          <Section title="My Interests" wide>
            <DefList
              items={[
                ["Research", "hep-th, hep-ex, hep-ph, physics.data-an, cs.LG, astro-ph.CO"],
                ["Technology", "FOSS, Embedded Systems, Computer Vision, HPC"],
                ["Hobbies", "Music, Hiking, Science Communication"],
              ]}
            />
          </Section>
        </aside>
      </div>
    </>
  );
}