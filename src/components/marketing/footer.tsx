import Link from "next/link";
import { Container } from "@/shared/layout/container";
import { MotionReveal } from "@/shared/components/motion";

const footerLinks = {
  product: {
    label: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
    ],
  },
  company: {
    label: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  resources: {
    label: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container size="wide" className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <MotionReveal className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground text-background">
                <span className="font-display text-[15px] font-bold leading-none">
                  E
                </span>
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Electro-Pi
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-foreground-secondary">
              The place where you and your team meet, plan, and build great
              things together.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-foreground-muted">
              <span className="size-1.5 rounded-full bg-success" />
              All systems operational
            </div>
          </MotionReveal>

          {Object.values(footerLinks).map((group) => (
            <MotionReveal key={group.label} delay={0.08}>
              <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                {group.label}
              </h4>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          ))}
        </div>

        <MotionReveal
          delay={0.16}
          className="mt-16 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-foreground-muted">
            &copy; {new Date().getFullYear()} Electro-Pi. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </MotionReveal>
      </Container>
    </footer>
  );
}
