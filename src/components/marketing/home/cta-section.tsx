"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Container } from "@/shared/layout/container";
import { Section } from "@/shared/layout/section";
import { MotionReveal } from "@/shared/components/motion";

const messages = [
  "Ready to transform how your team works together?",
  "Join thousands of teams already shipping faster.",
  "Your first project is just minutes away.",
  "Stop juggling tools. Start building together.",
];

export function CtaSection() {
  return (
    <Section id="cta" spacing="md">
      <Container size="wide">
        <MotionReveal>
          <div className="relative overflow-hidden rounded-2xl bg-neutral-950 px-6 py-16 text-white sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(120deg,rgba(124,58,237,0.5)_0%,rgba(79,70,229,0.3)_48%,rgba(245,158,11,0.15)_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(255,255,255,0.12),transparent_32%)]"
            />

            <div className="relative mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
                <Zap className="size-3.5 text-amber-400" />
                <span className="text-[12px] font-medium text-white/80">
                  Get started in minutes
                </span>
              </div>

              <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                Build something great
                <br />
                together
              </h2>

              <div className="relative mx-auto mt-6 min-h-8 max-w-xl overflow-hidden text-sm font-medium leading-relaxed text-white/78 sm:text-base">
                {messages.map((message, index) => (
                  <p
                    key={index}
                    className="absolute inset-x-0 top-0 opacity-0"
                    style={{
                      animation: `cta-message 20s infinite`,
                      animationDelay: `${index * 5}s`,
                    }}
                  >
                    {message}
                  </p>
                ))}
              </div>

              <Link
                href="/auth?mode=signup"
                className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-7 text-sm font-semibold text-neutral-950 shadow-sm transition-all duration-200 hover:bg-white/90 hover:shadow-md"
              >
                Start for free
                <ArrowRight className="size-4" />
              </Link>

              <p className="mt-6 text-sm text-white/50">
                Free forever for teams up to 5 · No credit card required
              </p>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </Section>
  );
}
