"use client";

import { useEffect, useState } from "react";

const cells = [
  0.15, 0.72, 0.28, 0.12, 0.08,
  0.63, 0.18, 0.81, 0.31, 0.14,
  0.19, 0.67, 0.22, 0.76, 0.36,
  0.09, 0.24, 0.71, 0.17, 0.84,
  0.06, 0.13, 0.35, 0.79, 0.21,
];

export function AttentionMatrix({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(7);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % cells.length);
    }, 900);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`group flex items-center gap-2 ${
        compact ? "scale-90" : ""
      }`}
      aria-label="Transformer attention matrix"
    >
      <div className="grid grid-cols-5 gap-[2px]">
        {cells.map((value, i) => (
          <span
            key={i}
            className={`size-[4px] rounded-[1px] transition-all duration-500 ${
              i === active ? "scale-150 bg-accent" : "bg-accent"
            }`}
            style={{ opacity: 0.12 + value * 0.7 }}
          />
        ))}
      </div>

      <span className="hidden  text-[8px] uppercase tracking-[0.16em] text-muted sm:block">
        ATTN · H04
      </span>
    </div>
  );
}