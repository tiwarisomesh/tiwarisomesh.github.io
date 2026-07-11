"use client";

import { Link, Button, Chip, Separator } from "@heroui/react";
import Image from "next/image";
import {
  FaGithub, FaLinkedin,
  FaEnvelope, FaUniversity,
  FaArrowUp,
  FaBlog,
  FaProjectDiagram
} from "react-icons/fa";

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-linear-to-br from-background via-default/30 to-accent/5 border-t border-separator/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <Image src="/profile.jpg" alt="Somesh Tiwari" fill className="object-cover rounded-full" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Somesh Tiwari</h3>
                <span className="text-xs text-muted">Physics | Computer Science</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip size="md" variant="primary" color="default" className="text-xs">
                <FaUniversity className="w-3 h-3" />
                <span>IISER Mohali</span>
              </Chip>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-5 bg-linear-to-b from-accent to-accent-hover rounded-full"></div>
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About me", href: "/about", icon: FaUniversity },
                { label: "Posts", href: "/posts", icon: FaBlog },
                { label: "Projects", href: "/projects", icon: FaProjectDiagram },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-muted hover:text-accent group transition"
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-5 bg-linear-to-b from-accent-hover to-accent rounded-full"></div>
              Contact
            </h4>
            <a href="mailto:ms25003@iisermohali.ac.in">
              <Button
                variant="outline"
                size="sm"
                className="w-full hover:scale-105 transition-transform"
              >
                <span className="flex w-full items-center justify-center gap-2">
                  <FaEnvelope className="h-4 w-4 shrink-0" />
                  <span>Email Me</span>
                </span>
              </Button>
            </a>
            <p className="text-xs text-muted">
              Connect with me regarding research, or related queries.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-5 bg-linear-to-b from-accent to-accent-hover rounded-full"></div>
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: FaGithub, href: "https://github.com/tiwarisomesh", label: "GitHub" },
                { icon: FaLinkedin, href: "https://linkedin.com/in/tiwari-somesh", label: "LinkedIn" },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded hover:text-accent transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>FOSS</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between text-xs text-muted">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <span>© {new Date().getFullYear()} Somesh Tiwari.</span>
          </div>
          <Button
            size="sm"
            variant="primary"
            className="self-center"
            onClick={scrollToTop}
          >
            <div className="flex items-center gap-2">
              <FaArrowUp className="w-3 h-3" />
              <span>Back to Top</span>
            </div>
          </Button>
        </div>

        <div className="absolute bottom-0 right-0 w-24 h-24 lg:w-64 lg:h-64 bg-linear-to-tl from-accent/10 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute top-0 left-0 w-12 h-12 lg:w-32 lg:h-32 bg-linear-to-br from-default/10 to-transparent rounded-full blur-2xl -z-10" />
      </div>
    </footer>
  );
};