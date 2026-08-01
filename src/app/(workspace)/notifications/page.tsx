"use client";

import { useState } from "react";
import {
  Bell,
  MessageSquare,
  Users,
  CheckCircle2,
  FolderKanban,
  AlertTriangle,
  Clock,
  CheckCheck,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ComingSoonBanner } from "@/components/workspace/coming-soon-banner";

type Notification = {
  id: string;
  icon: typeof Bell;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  category: "project" | "team" | "system" | "message";
};

const allNotifications: Notification[] = [
  {
    id: "1",
    icon: MessageSquare,
    iconColor: "bg-blue-500/10 text-blue-500",
    title: "New comment on your task",
    body: 'Sarah commented on "Finalize authentication flow" — "I found a bug in the OAuth redirect logic."',
    time: "2 minutes ago",
    unread: true,
    category: "project",
  },
  {
    id: "2",
    icon: Users,
    iconColor: "bg-purple-500/10 text-purple-500",
    title: "Added to team",
    body: 'Ahmed added you to the "Frontend" team. You now have 8 assigned tasks.',
    time: "1 hour ago",
    unread: true,
    category: "team",
  },
  {
    id: "3",
    icon: CheckCircle2,
    iconColor: "bg-emerald-500/10 text-emerald-500",
    title: "Task completed",
    body: '"API integration sync" was marked as complete by Mohamed.',
    time: "3 hours ago",
    unread: true,
    category: "project",
  },
  {
    id: "4",
    icon: FolderKanban,
    iconColor: "bg-amber-500/10 text-amber-500",
    title: "Project deadline approaching",
    body: '"Dashboard v2" is due in 2 days. 4 tasks still open.',
    time: "5 hours ago",
    unread: false,
    category: "project",
  },
  {
    id: "5",
    icon: AlertTriangle,
    iconColor: "bg-red-500/10 text-red-500",
    title: "Security alert",
    body: "An unrecognized login was detected from a new location. Please verify your account.",
    time: "Yesterday",
    unread: false,
    category: "system",
  },
  {
    id: "6",
    icon: MessageSquare,
    iconColor: "bg-blue-500/10 text-blue-500",
    title: "Direct message from Sarah",
    body: '"Hey, can we sync about the deployment timeline before standup tomorrow?"',
    time: "Yesterday",
    unread: false,
    category: "message",
  },
  {
    id: "7",
    icon: Users,
    iconColor: "bg-purple-500/10 text-purple-500",
    title: "Team mention",
    body: 'The "Backend" team was mentioned in the task "Set up CI/CD pipeline".',
    time: "2 days ago",
    unread: false,
    category: "team",
  },
  {
    id: "8",
    icon: Clock,
    iconColor: "bg-amber-500/10 text-amber-500",
    title: "Sprint ending soon",
    body: "Current sprint ends in 3 days. 6 tasks still in progress.",
    time: "2 days ago",
    unread: false,
    category: "system",
  },
];

const categories = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
  { key: "team", label: "Teams" },
  { key: "message", label: "Messages" },
  { key: "system", label: "System" },
] as const;

export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [notifications] = useState(allNotifications);

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.category === filter);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div>
      <ComingSoonBanner />
      <div className="px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
            Activity
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-foreground">
            Notifications
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            {unreadCount} unread &middot; {notifications.length} total
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface p-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
                filter === c.key
                  ? "bg-foreground text-background"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 divide-y divide-border">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={cn(
              "flex gap-4 px-2 py-5 transition-colors hover:bg-muted/30 rounded-lg -mx-2",
              n.unread && "bg-primary/5 hover:bg-primary/10",
            )}
          >
            <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", n.iconColor)}>
              <n.icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[14px] font-semibold text-foreground">
                  {n.title}
                </p>
                <span className="shrink-0 text-[11px] text-foreground-muted">
                  {n.time}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-foreground-muted leading-relaxed">
                {n.body}
              </p>
            </div>
            {n.unread && (
              <div className="flex shrink-0 items-start pt-1">
                <span className="size-2.5 rounded-full bg-highlight" />
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[13px] text-foreground-muted">
          No notifications in this category.
        </p>
      )}
    </div>
    </div>
  );
}
