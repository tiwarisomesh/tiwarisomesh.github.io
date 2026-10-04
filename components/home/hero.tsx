"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Chip, Link } from "@heroui/react";
import { FaAtom, FaEnvelope, FaFilePdf, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaDiagramProject } from "react-icons/fa6";

const social = [
  { label: "GitHub", href: "https://github.com/tiwarisomesh", Icon: FaGithub },
  { label: "LinkedIn", href: "https://linkedin.com/in/tiwari-somesh", Icon: FaLinkedin },
];

const button = "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium no-underline transition-colors";

export function Hero({ children }: { children?: ReactNode }) {
  return (
    <section className="grid-paper">
      {children}
      <div className="fade-in relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-20 text-center md:py-28">
        <Image
          src="/profile.jpg"
          alt="Somesh Tiwari"
          width={144}
          height={144}
          priority
          className="size-36 rounded-full object-cover ring-2 ring-accent ring-offset-4 ring-offset-background"
        />
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Somesh Tiwari</h1>
        <div className="flex flex-wrap justify-center gap-2 font-sans">
          <Chip color="accent" variant="soft" size="md">
            <FaAtom />
            HEP
          </Chip>
          <Chip color="success" variant="soft" size="md">
            <FaDiagramProject />
            <Chip.Label>ML</Chip.Label>
          </Chip>
        </div>

        <p className="font-sans text-sm text-muted">BS-MS, IISER Mohali</p>

        <div className="max-w-prose space-y-2">
          <p>
            I am interested in high enery physics and machine learning. I am currently pursuing my undergraduate studies at the Indian Institute of Science Education and Research (IISER) Mohali.
          </p>
          <p className="font-medium text-foreground text-muted">Website is currently under construction</p>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 font-sans">
          <Link
            href="mailto:ms25003@iisermohali.ac.in"
            className={`${button} bg-accent text-[color:var(--paper)] hover:opacity-90`}
          >
            <FaEnvelope />
            Contact
          </Link>
          <Link
            href="/cv.pdf"
            className={`${button} border border-separator text-foreground hover:bg-accent-soft`}
          >
            <FaFilePdf />
            CV
          </Link>
          {social.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
            >
              <Icon size={18} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}