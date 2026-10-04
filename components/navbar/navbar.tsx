import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { MobileNav } from "./mobile-nav";
import { AttentionMatrix } from "./attention-matrix";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-separator/60 bg-background/85 backdrop-blur-md">
      <header className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <span className="absolute -inset-1 rounded-full border border-accent/20 transition group-hover:border-accent/50" />
            <Image
              src="/profile.jpg"
              alt="Somesh Tiwari"
              width={42}
              height={42}
              sizes="42px"
              className="relative rounded-full border border-separator object-cover"
            />
          </div>

          <div className="leading-none">
            <p className="font-semibold tracking-tight group-hover:text-accent">
              Somesh Tiwari
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted">
              '30 Mohali
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <nav className="flex items-center rounded-full border border-separator/70 bg-surface/40 p-1">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-accent-soft hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <AttentionMatrix />

          <ThemeSwitch />
        </div>

        <MobileNav items={siteConfig.navMenuItems} />
      </header>
    </nav>
  );
}