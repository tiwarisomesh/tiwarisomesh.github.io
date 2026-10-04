import type { ReactNode } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface EntryCardProps {
  title: string;
  tags?: string[];
  href?: string;
  meta?: string;
  github?: string;
  status?: "active" | "complete" | "paused";
  children: ReactNode;
}

const states = {
  active: { text: "In progress", dot: "bg-success" },
  complete: { text: "Complete", dot: "bg-muted" },
  paused: { text: "Paused", dot: "bg-warning" },
};

const track = "M4 76C44 74 88 58 116 8";
const hits = [[34, 72], [64.5, 60], [92, 39.4]];

const iconLink =
  "flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-accent";

export function EntryList({ children }: { children: ReactNode }) {
  return <div className="ledger border-separator">{children}</div>;
}

export function EntryCard({ title, tags, href, github, status, children }: EntryCardProps) {
  const state = status ? states[status] : null;

  return (
    <article className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-separator p-5 transition-colors focus-within:border-accent/40 hover:border-accent/40">
      <svg
        aria-hidden="true"
        viewBox="0 0 120 80"
        fill="none"
        className="pointer-events-none absolute bottom-0 right-0 h-20 w-[120px] text-accent"
      >
        <path d={track} stroke="currentColor" strokeOpacity=".25" strokeDasharray="2 5" />
        <path
          d={track}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="1"
          className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-700 ease-out group-focus-within:[stroke-dashoffset:0] group-hover:[stroke-dashoffset:0] motion-reduce:transition-none"
        />
        {hits.map(([cx, cy]) => (
          <circle
            key={cx}
            cx={cx}
            cy={cy}
            r="2"
            fill="currentColor"
            className="opacity-0 transition-opacity delay-500 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
          />
        ))}
      </svg>

      <header className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-sans font-semibold leading-snug text-foreground">{title}</h3>
          {state ? (
            <p className="mt-1.5 flex items-center gap-2 font-sans text-xs text-muted">
              <span className={`size-2 rounded-full ${state.dot}`} />
              {state.text}
            </p>
          ) : null}
        </div>
        {href || github ? (
          <div className="flex shrink-0 items-center gap-1 font-sans">
            {github ? (
              <a href={github} aria-label={`${title} on GitHub`} className={iconLink}>
                <FaGithub size={16} />
              </a>
            ) : null}
            {href ? (
              <a href={href} aria-label={`View ${title}`} className={iconLink}>
                <FaExternalLinkAlt size={13} />
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="relative flex-1 text-sm leading-relaxed text-muted">{children}</div>

      {tags?.length ? (
        <ul className="relative flex flex-wrap gap-1.5 font-sans">
          {tags.map((tag) => (
            <li key={tag} className="rounded-md border border-separator px-2 py-0.5 text-xs text-muted">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}