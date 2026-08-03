"use client";

import { useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { getNotifIcon, getNotifColor } from "@/lib/notifications";
import {
  useNotifications,
  useNotificationsCount,
  useMarkNotificationsRead,
  useDeleteAllNotifications,
  useDeleteNotification,
} from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";

const filterTabs = [
  { key: "all", label: "All" },
  { key: "task_assigned", label: "Tasks" },
  { key: "project_assigned", label: "Projects" },
  { key: "team_added", label: "Teams" },
  { key: "message_sent", label: "Messages" },
  { key: "system", label: "System" },
] as const;

export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>("all");
  const { data: notifications } = useNotifications();
  const { data: countData } = useNotificationsCount();
  const markRead = useMarkNotificationsRead();
  const deleteAll = useDeleteAllNotifications();
  const deleteOne = useDeleteNotification();

  const items = notifications ?? [];
  const unreadCount = countData?.count ?? 0;

  const filtered =
    filter === "all" ? items : items.filter((n) => n.type === filter);

  return (
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
            {unreadCount} unread &middot; {items.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface p-1">
            {filterTabs.map((c) => (
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
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              title="Mark all as read"
              disabled={unreadCount === 0 || markRead.isPending}
              onClick={() => markRead.mutate()}
            >
              <CheckCheck className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              title="Clear all"
              disabled={items.length === 0 || deleteAll.isPending}
              onClick={() => deleteAll.mutate()}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 divide-y divide-border">
        {filtered.map((n) => {
          const Icon = getNotifIcon(n.type);
          const color = getNotifColor(n.type);

          return (
            <div
              key={n.id}
              className={cn(
                "flex gap-4 px-2 py-5 transition-colors hover:bg-muted/30 rounded-lg -mx-2 group",
                !n.isRead && "bg-primary/5 hover:bg-primary/10",
              )}
            >
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", color)}>
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-semibold text-foreground">
                    {n.title}
                  </p>
                  <span className="shrink-0 text-[11px] text-foreground-muted">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-foreground-muted leading-relaxed">
                  {n.message}
                </p>
              </div>
              <div className="flex shrink-0 items-start gap-1 pt-1">
                {!n.isRead && (
                  <span className="size-2.5 rounded-full bg-highlight" />
                )}
                <button
                  title="Delete notification"
                  className="rounded p-0.5 text-foreground-muted opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100"
                  onClick={() => deleteOne.mutate(n.id)}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[13px] text-foreground-muted">
          No notifications in this category.
        </p>
      )}
    </div>
  );
}
