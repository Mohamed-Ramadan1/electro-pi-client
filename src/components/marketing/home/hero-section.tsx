"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Container } from "@/shared/layout/container";
import { Section } from "@/shared/layout/section";
import { MotionReveal } from "@/shared/components/motion";

export function HeroSection() {
  return (
    <Section spacing="lg" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(124,58,237,0.08),transparent_50%),radial-gradient(ellipse_at_70%_60%,rgba(245,158,11,0.05),transparent_50%)]"
      />

      <Container size="wide">
        <MotionReveal className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5">
            <Zap className="size-3.5 text-highlight" />
            <span className="text-[12px] font-medium text-foreground-secondary">
              Now in public beta
            </span>
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-7xl">
            Where teams meet
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              to be productive
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground-secondary">
            Electro-Pi brings your projects, team communication, and workflows
            into one beautiful space. Plan smarter, ship faster, and stay
            connected without the chaos.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth?mode=signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-foreground px-7 text-sm font-semibold text-background shadow-sm transition-all duration-200 hover:bg-foreground/90 hover:shadow-md"
            >
              Start for free
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-7 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:bg-muted hover:shadow"
            >
              Explore features
            </Link>
          </div>

          <p className="mt-8 text-sm text-foreground-muted">
            No credit card required · Free plan available · 2-minute setup
          </p>
        </MotionReveal>

        <MotionReveal delay={0.14} className="mt-14 sm:mt-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-card shadow-large">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="ms-3 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted">
                electro-pi.app
              </span>
            </div>
            <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-background-secondary via-background to-surface p-6">
              <div className="grid h-full grid-cols-12 gap-4">
                <div className="col-span-3 rounded-lg border border-border bg-card p-4 shadow-sm" />
                <div className="col-span-9 rounded-lg border border-border bg-card p-4 shadow-sm" />
              </div>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </Section>
  );
}
