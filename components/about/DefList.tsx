import type { ReactNode } from "react";

export function DefList({ items, mono }: { items: [term: string, description: ReactNode][]; mono?: boolean }) {
  return (
    <dl className="@container divide-y divide-separator border-y border-separator">
      {items.map(([term, description]) => (
        <div key={term} className="grid gap-1 py-3.5 @md:grid-cols-[11rem_1fr] @md:gap-6">
          <dt className={`text-sm text-muted ${mono ? " text-accent" : "font-sans"}`}>{term}</dt>
          <dd className="max-w-prose">{description}</dd>
        </div>
      ))}
    </dl>
  );
}
