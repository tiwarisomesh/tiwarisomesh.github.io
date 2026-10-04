"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import { AttentionMatrix } from "./attention-matrix";

type Item = { label: string; href: string };

export function MobileNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-2">
        <AttentionMatrix compact />
        <ThemeSwitch />

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-10 place-items-center rounded-full border border-separator transition hover:border-accent hover:text-accent"
        >
          <span className="relative h-3.5 w-4">
            <i
              className={`absolute left-0 top-0 h-px w-4 bg-current transition ${
                open ? "top-1.5 rotate-45" : ""
              }`}
            />
            <i
              className={`absolute left-0 top-1.5 h-px w-4 bg-current transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <i
              className={`absolute left-0 top-3 h-px w-4 bg-current transition ${
                open ? "top-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-[72px] overflow-hidden border-b border-separator bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">

            {/* header */}
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className=" text-[9px] uppercase tracking-[0.25em] text-accent">
                  Navigation
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  Mobile Menu
                </h2>
              </div>
            </div>

            {/* attention visualization */}
            <div className="mb-6 flex items-center gap-5 rounded-xl border border-separator bg-surface/30 p-4">
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }, (_, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-[1px] bg-accent"
                    style={{
                      opacity:
                        0.08 +
                        (((i * 17 + 23) % 100) / 100) * 0.65,
                    }}
                  />
                ))}
              </div>

              <div className="min-w-0">
                <p className=" text-[9px] uppercase tracking-widest text-accent">
                  Attention matrix here just for fun
                </p>
                <p className="mt-1 text-xs text-muted">
                  Until I think something better to put here
                </p>
              </div>
            </div>

            {/* navigation */}
            <nav className="border-t border-separator">
              {items.map((item, i) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center justify-between border-b border-separator py-4 transition ${
                      active
                        ? "text-accent"
                        : "text-foreground hover:text-accent"
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="mr-5  text-[9px] text-muted">
                        0{i + 1}
                      </span>
                      <span className="text-base">{item.label}</span>
                    </span>

                    <span
                      className={` text-xs transition-transform ${
                        active
                          ? "translate-x-0 opacity-100"
                          : "opacity-30 group-hover:translate-x-1 group-hover:opacity-100"
                      }`}
                    >
                      {active ? "●" : "→"}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* footer */}
            <div className="mt-6 flex items-center justify-between  text-[8px] uppercase tracking-[0.18em] text-muted">
              <span>IISER Mohali</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}