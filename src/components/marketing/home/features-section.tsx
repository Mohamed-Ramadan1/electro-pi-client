"use client";

import {
  LayoutDashboard,
  MessageSquare,
  CalendarDays,
  FolderKanban,
  Bell,
  Shield,
} from "lucide-react";
import { Container } from "@/shared/layout/container";
import { Section } from "@/shared/layout/section";
import { MotionReveal } from "@/shared/components/motion";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Organize work into projects with kanban boards, timelines, and milestones. Keep every task visible and every deliverable on track.",
    outcome: "Ship projects 30% faster with clear ownership and deadlines.",
  },
  {
    icon: MessageSquare,
    title: "Team Communication",
    description:
      "Real-time messaging with threaded discussions, file sharing, and @mentions. Every conversation stays connected to the right context.",
    outcome: "Reduce scattered emails and messages by keeping context in one place.",
  },
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    description:
      "Integrated calendar with meeting scheduling, deadline tracking, and availability management. Syncs with your existing tools.",
    outcome: "Never miss a deadline or double-book a meeting again.",
  },
  {
    icon: LayoutDashboard,
    title: "Custom Dashboards",
    description:
      "Build personalized views that show exactly what matters to you. Widgets for tasks, metrics, activity feeds, and more.",
    outcome: "Start every day with a clear picture of what needs your attention.",
  },
  {
    icon: Bell,
    title: "Intelligent Notifications",
    description:
      "Real-time alerts that adapt to your workflow. Prioritize what's urgent, mute what isn't, and never get overwhelmed.",
    outcome: "Stay informed without the notification fatigue.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "End-to-end encryption, role-based access control, SSO, and audit logs. Your data stays safe and compliant.",
    outcome: "Sleep soundly knowing your team's data is protected at every layer.",
  },
];

export function FeaturesSection() {
  return (
    <Section id="features" spacing="lg">
      <Container size="wide">
        <MotionReveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
            Everything your team needs
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg italic leading-relaxed text-foreground-secondary">
            From planning to delivery, Electro-Pi brings clarity to every stage
            of your workflow.
          </p>
        </MotionReveal>

        <div className="mt-14 divide-y divide-border border-y border-border">
          {features.map((feature, index) => (
            <MotionReveal
              key={feature.title}
              delay={0.08 * index}
              className="grid gap-2 py-7 sm:grid-cols-[1fr_1.6fr] sm:gap-10"
            >
              <div className="flex items-start gap-3">
                <feature.icon className="size-5 text-highlight mt-0.5 shrink-0" />
                <p className="font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </p>
              </div>
              <div>
                <p className="text-base leading-relaxed text-foreground-secondary">
                  {feature.description}
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-foreground">
                  {feature.outcome}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
