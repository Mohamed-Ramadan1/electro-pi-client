"use client";

import {
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  TrendingUp,
  LayoutDashboard,
  FolderKanban,
  Bell,
  CheckSquare,} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const stats = [
  {
    label: "Active Projects",
    value: "12",
    detail: "+2 this month",
  },
  {
    label: "Tasks Completed",
    value: "148",
    detail: "92% on time",
  },
  {
    label: "Team Members",
    value: "8",
    detail: "2 online now",
  },
  {
    label: "Hours Tracked",
    value: "342",
    detail: "+12% vs last week",
  },
];

const todaysSchedule = [
  { time: "09:00", title: "Sprint planning", tag: "Meeting" },
  { time: "11:30", title: "Design review — Dashboard v2", tag: "Review" },
  { time: "14:00", title: "Backend API integration sync", tag: "Engineering" },
];

const tasks = [
  { text: "Finalize authentication flow", done: true, due: "Today" },
  { text: "Review PR #42 — Notifications module", done: false, due: "Today" },
  { text: "Update project documentation", done: false, due: "Tomorrow" },
  { text: "Prepare sprint demo slides", done: false, due: "Wed" },
  { text: "Set up CI/CD pipeline", done: false, due: "Fri" },
];

const recentLibrary = [
  { title: "Design System v2.0", type: "Figma", updated: "2h ago" },
  { title: "API Documentation", type: "Notion", updated: "5h ago" },
  { title: "Q3 Roadmap", type: "Spreadsheet", updated: "Yesterday" },
];

const pillars = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    meta: "12 projects",
    href: "/home",
  },
  {
    icon: FolderKanban,
    label: "Projects",
    meta: "3 active",
    href: "/projects",
  },
  {
    icon: CheckSquare,
    label: "Tasks",
    meta: "5 pending",
    href: "/tasks",
  },
  {
    icon: Bell,
    label: "Notifications",
    meta: "2 new",
    href: "/notifications",
  },
];

export default function DashboardHome() {
  const user = useAuthStore((s) => s.user);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div
        className={cn(
          "mb-8 rounded-lg border border-border bg-surface px-4 py-3 text-[13px] text-foreground-muted",
        )}
      >
        Preview mode — this is a demo of your workspace. Start building to make
        it yours.
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
            {formattedDate}
          </p>
          <h1 className="mt-3 font-display text-4xl italic text-foreground md:text-5xl">
            Good morning, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-foreground-muted">
            Here&apos;s what&apos;s happening across your projects today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-[13px] font-medium text-foreground"
          >
            <Sparkles className="size-3.5 text-highlight" />
            Ask Electro-Pi
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-colors hover:bg-primary">
            <Plus className="size-3.5" />
            New Project
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
              {stat.label}
            </p>
            <p className="mt-3 font-display text-3xl italic text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-foreground-muted">
              <TrendingUp className="size-3 text-success" />
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-12 gap-6">
        <section className="col-span-12 rounded-lg border border-border bg-surface p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
                Today
              </p>
              <h2 className="mt-1 font-display text-2xl italic text-foreground">
                Schedule
              </h2>
            </div>
            <button
              disabled
              className="inline-flex cursor-not-allowed items-center gap-1 text-[12px] text-foreground-muted"
            >
              Open Calendar
              <span className="text-[10px]">&rarr;</span>
            </button>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {todaysSchedule.map((entry) => (
              <li
                key={entry.title}
                className="flex items-center gap-4 py-4"
              >
                <div className="flex w-14 shrink-0 items-center gap-1.5 font-mono text-[12px] text-foreground-muted">
                  <Clock className="size-3" />
                  {entry.time}
                </div>
                <p className="flex-1 text-sm text-foreground">{entry.title}</p>
                <span className="rounded-sm border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground-muted">
                  {entry.tag}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-12 rounded-lg border border-border bg-surface p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
                Priority
              </p>
              <h2 className="mt-1 font-display text-2xl italic text-foreground">
                Tasks
              </h2>
            </div>
            <span className="font-mono text-[11px] text-foreground-muted">
              1/5
            </span>
          </div>
          <ul className="mt-4 space-y-1">
            {tasks.map((task) => (
              <li
                key={task.text}
                className="group flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/60"
              >
                {task.done ? (
                  <CheckCircle2 className="size-4 text-success shrink-0" />
                ) : (
                  <Circle className="size-4 text-foreground-muted shrink-0 group-hover:text-foreground" />
                )}
                <span
                  className={cn(
                    "flex-1 text-sm",
                    task.done
                      ? "text-foreground-muted line-through"
                      : "text-foreground",
                  )}
                >
                  {task.text}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-muted">
                  {task.due}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-12 overflow-hidden rounded-lg border border-border bg-foreground text-background lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]">
            <div className="p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                AI Assistant
              </p>
              <p className="mt-4 font-display text-2xl italic leading-snug">
                &ldquo;Looks like you have 3 tasks due today. Want me to help
                prioritize or draft your sprint update?&rdquo;
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <button className="rounded-md bg-background px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-background/90">
                  Prioritize
                </button>
                <button className="rounded-md border border-background/20 px-3 py-1.5 text-[12px] font-medium text-background/80 transition-colors hover:bg-background/10">
                  Draft update
                </button>
                <button className="rounded-md px-3 py-1.5 text-[12px] font-medium text-background/60 transition-colors hover:text-background/80">
                  Dismiss
                </button>
              </div>
            </div>
            <div className="hidden items-center justify-center border-l border-background/10 p-8 md:flex">
              <Sparkles
                className="size-16 text-accent"
                strokeWidth={1}
              />
            </div>
          </div>
        </section>

        <section className="col-span-12 rounded-lg border border-border bg-surface p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
                Recent
              </p>
              <h2 className="mt-1 font-display text-2xl italic text-foreground">
                Library
              </h2>
            </div>
            <button
              disabled
              className="inline-flex cursor-not-allowed items-center gap-1 text-[12px] text-foreground-muted"
            >
              View all
              <span className="text-[10px]">&rarr;</span>
            </button>
          </div>
          <ul className="mt-4 space-y-1">
            {recentLibrary.map((item) => (
              <li
                key={item.title}
                className="group flex items-center justify-between rounded-md px-2 py-2.5 hover:bg-muted/60"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-foreground-muted">
                    {item.type}
                  </p>
                </div>
                <span className="text-[10px] text-foreground-muted">
                  {item.updated}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {pillars.map((pillar) => (
              <Link
                key={pillar.label}
                href={pillar.href}
                className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-background"
              >
                <pillar.icon className="size-5 text-highlight" />
                <div className="mt-8">
                  <p className="font-display text-xl italic text-foreground">
                    {pillar.label}
                  </p>
                  <p className="mt-1 text-[11px] text-foreground-muted">
                    {pillar.meta}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
