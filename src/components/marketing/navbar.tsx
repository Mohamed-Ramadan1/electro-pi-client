"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function Logo({ markOnly = false }: { markOnly?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground text-background transition-colors group-hover:bg-primary">
        <span className="font-display text-[15px] font-bold leading-none">
          E
        </span>
      </span>
      {!markOnly && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          Electro-Pi
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent transition-all duration-300",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-[13px] font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-[13px] font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="hidden rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-foreground transition-all duration-200 hover:bg-muted sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/auth?mode=signup"
            className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background shadow-sm transition-all duration-200 hover:bg-foreground/90 hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
