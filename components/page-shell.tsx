import type { ReactNode, CSSProperties } from "react";
import katex from "katex";
import { BlueprintBackdrop } from "./projects/blueprint";

const render = (tex: string) =>
  katex.renderToString(tex, {
    throwOnError: false,
    output: "html",
  });

interface PlacedEquation {
  tex: string;
  style: CSSProperties;
}

const EQUATIONS: Record<string, PlacedEquation[]> = {
  about: [
    {
      tex: String.raw`h^{(\ell)} = \sigma\big(W^{(\ell)} h^{(\ell-1)} + b^{(\ell)}\big)`,
      style: { left: "20%", top: "20%" },
    },
    {
      tex: String.raw`h^{(\ell)}_{i,j,c'} = \sigma\!\left(\sum_{c}\sum_{u,v} K_{u,v,c,c'}\; h^{(\ell-1)}_{i+u,\, j+v,\, c} \;+\; b_{c'}\right)`,
      style: { right: "10%", bottom: "20%" },
    }
  ],
  posts: [
    {
      tex: String.raw`(i\gamma^\mu\partial_\mu - m)\psi = 0`,
      style: { left: "20%", top: "20%" },
    },
    {
      tex: String.raw`\mathcal{L}_{\mathrm{QCD}} = -\frac{1}{4}G_{\mu\nu}^aG^{a\mu\nu} + \sum_f\bar{q}_f (i\gamma^\mu D_\mu-m_f)q_f
`,
      style: { right: "10%", bottom: "20%" },
    }
  ],
  default: [
    {
      tex: String.raw`F = ma`,
      style: { right: "15%", bottom: "50%" },
    },
    {
      tex: String.raw`E = mc^2`,
      style: { left: "15%", top: "50%" },
    }
  ],
};

function BannerEquations({ topic }: { topic: string }) {
  const eqs = EQUATIONS[topic] ?? EQUATIONS.default;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden text-muted xl:block"
    >
      {eqs.map(({ tex, style }) => (
        <div
          key={tex}
          className="absolute whitespace-nowrap text-[0.82rem] opacity-35"
          style={style}
          dangerouslySetInnerHTML={{ __html: render(tex) }}
        />
      ))}
    </div>
  );
}

function PageBackdrop({ topic }: { topic: string }) {
  if (topic === "projects") {
    return <BlueprintBackdrop />;
  }
  return <BannerEquations topic={topic} />;
}

export function PageShell({
  title,
  lead,
  subtitle,
  topic,
  children,
}: {
  title?: string;
  lead?: string;
  subtitle?: string;
  topic?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {title && (
        <header className="grid-paper relative isolate overflow-hidden border-b border-separator">
          <PageBackdrop topic={topic ?? "default"} />
          <div className="relative z-10 mx-auto flex min-h-[360px] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center md:min-h-[420px]">
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground md:text-7xl lg:text-8xl">
              {title}
            </h1>

            {lead && (
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
                {lead}
              </p>
            )}

            <div
              aria-hidden
              className="mt-5 h-px w-20"
              style={{ backgroundColor: "var(--accent)" }}
            />

            <span className="mt-4  text-[10px] uppercase tracking-[0.3em] text-muted">
              {subtitle}
            </span>
          </div>
        </header>
      )}

      <div className="mx-auto w-full max-w-6xl space-y-16 px-6 py-12 md:space-y-20 md:py-16">
        {children}
      </div>
    </div>
  );
}

export function Section({
  id,
  title,
  wide,
  children,
}: {
  id?: string;
  title: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="sec-title mb-5 border-b border-separator pb-2 text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className={wide ? undefined : "space-y-4"}>{children}</div>
    </section>
  );
}

export function Contents({ items }: { items: { id: string; title: string }[] }) {
  return (
    <nav aria-label="On this page" className="font-sans text-sm">
      <ol className="border-l border-separator">
        {items.map(({ id, title }, i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="-ml-px flex gap-3 border-l border-transparent py-1 pl-4 text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              <span className="w-3 tabular-nums">{i + 1}</span>
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}