"use client";

import { Chip, Separator } from "@heroui/react";
import NextLink from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { FaAddressCard, FaBookOpen, FaUniversity } from "react-icons/fa";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;
  const closeMobileMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/70 border-b border-separator/50">
      <header className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <NextLink href="/" className="flex items-center gap-4 group max-w-fit">
            <span className="relative w-12 h-12 block">
              <span className="absolute inset-0 rounded-full bg-linear-to-r from-blue-500/30 to-purple-500/30 blur-md group-hover:scale-110 transition-transform duration-300" />
              <Image
                src="/profile.jpg"
                alt="Somesh Tiwari Profile Photo"
                fill
                sizes="48px"
                className="rounded-full object-cover border-2 border-white dark:border-default shadow-lg"
              />
            </span>

            <div className="flex flex-col min-w-0">
              <p className="font-bold text-lg truncate text-foreground group-hover:text-accent transition-colors">
                Somesh Tiwari
              </p>
              <div className="hidden sm:flex items-center gap-2">
                <Chip size="sm" variant="soft" color="danger" className="text-xs px-2 h-5">
                 <FaUniversity size={10} /> IISER Mohali
                </Chip>
                <span className="text-muted">•</span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <FaAddressCard size={10} />
                  Punjab, India
                </span>
              </div>
            </div>
          </NextLink>
        </div>

        <ul className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-1">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NextLink
                className={clsx(
                  "relative px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105",
                  isActive(item.href)
                    ? "text-accent bg-accent-soft shadow-lg"
                    : "text-foreground hover:text-accent hover:bg-accent-soft/50"
                )}
                href={item.href}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-linear-to-r from-accent to-accent-hover rounded-full" />
                )}
              </NextLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <ThemeSwitch />
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <ThemeSwitch />
          <button
            className="text-accent p-2"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-separator/50">
          <div className="flex flex-col gap-6 pt-6">
            <ul className="px-4 flex flex-col gap-3">
              {siteConfig.navMenuItems.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <NextLink
                    className={clsx(
                      "flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-300 w-full",
                      isActive(item.href)
                        ? "text-accent bg-accent-soft shadow-lg"
                        : "text-foreground hover:text-accent hover:bg-accent-soft/50"
                    )}
                    href={item.href}
                    onClick={closeMobileMenu}
                  >
                    <div
                      className={clsx(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        isActive(item.href) ? "bg-accent" : "bg-default"
                      )}
                    />
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>

            <Separator className="opacity-50" />

            <div className="px-4 pb-4 space-y-4">
              <div className="flex flex-col gap-3 p-5 bg-accent-soft rounded-xl border border-accent/20 shadow-md max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-accent text-white shadow-lg">
                    <FaBookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-accent">
                      Hello!
                    </h3>
                    <p className="text-sm text-accent/80">
                      Welcome to my website!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};