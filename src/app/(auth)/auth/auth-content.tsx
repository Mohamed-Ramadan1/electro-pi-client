"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { MotionReveal } from "@/shared/components/motion";
import { AuthForm } from "@/components/auth/auth-form";

function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground text-background">
        <span className="font-display text-[15px] font-bold leading-none">
          E
        </span>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Electro-Pi
      </span>
    </Link>
  );
}

export default function AuthPageContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") || "signin") as "signin" | "signup";
  const isSignup = mode === "signup";

  return (
    <div className="flex min-h-screen">
      <section className="relative hidden flex-col overflow-hidden bg-background-secondary p-10 text-foreground lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(124,58,237,0.15),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.08),transparent_30%)]"
        />

        <MotionReveal className="relative z-10 flex items-center justify-between gap-4">
          <Logo />
          <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground-secondary">
            Beta v0.1
          </span>
        </MotionReveal>

        <MotionReveal
          delay={0.08}
          className="relative z-10 mx-auto mt-16 max-w-xl text-center"
        >
          <span className="text-sm text-foreground-muted">Welcome to</span>
          <h2 className="mx-auto mt-4 max-w-lg font-display text-4xl font-bold leading-[1.05] tracking-[-0.02em] xl:text-5xl">
            Your team&apos;s
            <br />
            new home
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-foreground-secondary">
            Join the platform where teams organize projects, communicate in
            real-time, and ship work that matters — all in one place.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm text-foreground-muted">
            {[
              "Unlimited projects",
              "Real-time chat",
              "File sharing",
              "Custom dashboards",
            ].map((signal, i) => (
              <span key={signal} className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span className="size-1 rounded-full bg-foreground/25" />
                )}
                {signal}
              </span>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal
          delay={0.16}
          className="relative z-10 mt-auto overflow-hidden rounded-[1.25rem] border border-border bg-card/85 p-2 shadow-large"
        >
          <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            Dashboard
          </div>
          <div className="pointer-events-none absolute bottom-5 right-5 z-10 rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            Projects
          </div>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1rem] bg-gradient-to-br from-background-secondary via-background to-surface">
            <div className="flex h-full items-center justify-center">
              <div className="grid grid-cols-12 gap-3 p-6 w-full">
                <div className="col-span-3 h-full rounded-lg border border-border bg-card" />
                <div className="col-span-9 space-y-3">
                  <div className="h-8 rounded-lg border border-border bg-card" />
                  <div className="h-full rounded-lg border border-border bg-card" />
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>

      <section className="relative flex min-h-screen flex-1 flex-col auth-pattern px-5 py-6 sm:px-8 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-background)_0%,transparent_70%)]"
        />

        <MotionReveal className="relative z-10 flex items-center justify-between gap-4 lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-md border border-border px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Home
            </Link>
          </div>
        </MotionReveal>

        <div className="relative z-10 flex flex-1 items-center justify-center py-10">
          <MotionReveal delay={0.16} className="w-full max-w-sm">
            <div className="rounded-2xl border border-border bg-background/85 p-8 shadow-2xl backdrop-blur-xl">
              <h1 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-foreground">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                {isSignup
                  ? "Start your journey with Electro-Pi."
                  : "Sign in to continue to your workspace."}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/50 p-1">
                <Link
                  href="/auth"
                  className={cn(
                    "rounded-md px-3 py-2 text-center text-[13px] font-medium transition-all duration-200",
                    !isSignup
                      ? "bg-background text-foreground shadow-sm"
                      : "text-foreground-secondary hover:text-foreground hover:bg-background/50",
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className={cn(
                    "rounded-md px-3 py-2 text-center text-[13px] font-medium transition-all duration-200",
                    isSignup
                      ? "bg-background text-foreground shadow-sm"
                      : "text-foreground-secondary hover:text-foreground hover:bg-background/50",
                  )}
                >
                  Sign Up
                </Link>
              </div>

              <div className="mt-6">
                <AuthForm mode={mode} />
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}
