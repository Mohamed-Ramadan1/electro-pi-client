"use client";

import { useState } from "react";
import { Bell, Info, AlertTriangle, CheckCircle2, AtSign, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useNotificationsStore,
  type Notification,
} from "@/stores/notifications-store";

const typeConfig: Record<
  Notification["type"],
  { icon: typeof Info; color: string; bg: string }
> = {
  info: {
    icon: Info,
    color: "text-info",
    bg: "bg-info/10",
  },
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  mention: {
    icon: AtSign,
    color: "text-highlight",
    bg: "bg-highlight/10",
  },
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationItem({ notification }: { notification: Notification }) {
  const markRead = useNotificationsStore((s) => s.markRead);
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <button
      onClick={() => markRead(notification.id)}
      className={cn(
        "flex w-full gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted/60",
        !notification.read && "bg-primary/5",
      )}
    >
      <div
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg",
          config.bg,
        )}
      >
        <Icon className={cn("size-4", config.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-[13px] leading-tight",
              notification.read
                ? "font-medium text-foreground"
                : "font-semibold text-foreground",
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="size-1.5 shrink-0 rounded-full bg-highlight" />
          )}
        </div>
        <p className="mt-0.5 text-[12px] leading-relaxed text-foreground-muted line-clamp-2">
          {notification.description}
        </p>
        <p className="mt-1.5 text-[10px] uppercase tracking-wider text-foreground-muted">
          {timeAgo(notification.timestamp)}
        </p>
      </div>
    </button>
  );
}

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const notifications = useNotificationsStore((s) => s.notifications);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-highlight text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-semibold text-foreground">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-highlight/10 px-1.5 py-0.5 text-[10px] font-semibold text-highlight">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              <Check className="size-3" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="size-8 text-foreground-muted/40" />
              <p className="mt-3 text-[13px] text-foreground-muted">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
