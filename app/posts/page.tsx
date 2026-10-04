import type { Metadata } from "next";
import { PageShell, Section } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Posts",
};

const upcoming = [
  {
    number: "01",
    title: "Placeholder Post",
    description:
      "Posts coming soon.",
    tags: ["ML"],
    status: "Draft",
  },
];

export default function PostsPage() {
  return (
    <PageShell
      title="Posts"
      lead="Notes, research write-ups, tutorials, and my ramblings (perhaps not) worth writing down."
      subtitle="Page Under Construction"
      topic="posts"
    >
      <Section title="Notes" wide>
        <div className="border-y border-separator">
          {upcoming.map(
            ({ number, title, description, tags, status }, index) => (
              <article
                key={title}
                className="group grid gap-5 border-b border-separator py-7 last:border-b-0 md:grid-cols-[3rem_1fr_auto]"
              >
                <span className=" text-xs text-muted">
                  {number}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent md:text-2xl">
                      {title}
                    </h2>

                    <span className="rounded-full border border-separator px-2 py-0.5  text-[9px] uppercase tracking-[0.12em] text-muted">
                      {status}
                    </span>
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                    {description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent-soft px-2.5 py-1  text-[10px] text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="hidden self-center  text-sm text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent md:block">
                  →
                </span>
              </article>
            ),
          )}
        </div>

        <p className="mt-5 text-sm leading-6 text-muted">
          These notes are being written alongside research and coursework. Finished pieces will appear here as they become ready.
        </p>
      </Section>
    </PageShell>
  );
}