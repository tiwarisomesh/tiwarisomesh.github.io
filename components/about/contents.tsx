"use client";

import { useEffect, useState } from "react";

export function Contents({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) inBand.add(target.id);
          else inBand.delete(target.id);
        }
        const current = items.findLast(({ id }) => inBand.has(id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-96px 0px -40% 0px" },
    );
    for (const { id } of items) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="font-sans text-sm">
      <ol className="border-l border-separator">
        {items.map(({ id, title }, i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={() => setActive(id)}
              aria-current={id === active ? "location" : undefined}
              className="toc-link -ml-px flex gap-3 py-1.5 pl-4 text-muted hover:text-foreground"
            >
              <span className="toc-num w-3 tabular-nums">{i + 1}</span>
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}