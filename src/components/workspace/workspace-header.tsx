"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, MessageSquare, Users, CheckCircle2, FolderKanban } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const mockNotifications = [
  {
    id: "1",
    icon: MessageSquare,
    title: "New comment on your task",
    body: "Sarah commented on \"Finalize authentication flow\"",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    icon: Users,
    title: "Added to project",
    body: "You were added to \"Dashboard v2\" by Ahmed",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    icon: CheckCircle2,
    title: "Task completed",
    body: "\"API integration sync\" was marked complete",
    time: "3h ago",
    unread: false,
  },
  {
    id: "4",
    icon: FolderKanban,
    title: "Project closed",
    body: "\"Q2 Research\" has been archived",
    time: "Yesterday",
    unread: false,
  },
];

const mockMessages = [
  {
    id: "m1",
    name: "Sarah Chen",
    initials: "SC",
    body: "Can we review the Figma files before standup?",
    time: "2m ago",
    unread: true,
    online: true,
  },
  {
    id: "m2",
    name: "Ahmed Hassan",
    initials: "AH",
    body: "Deployment pipeline is green now",
    time: "15m ago",
    unread: false,
    online: true,
  },
  {
    id: "m3",
    name: "Mohamed Ali",
    initials: "MA",
    body: "I fixed the auth redirect issue",
    time: "1h ago",
    unread: true,
    online: false,
  },
  {
    id: "m4",
    name: "Frontend Team",
    initials: "FT",
    body: "Ahmed: Sprint review slides are ready",
    time: "2h ago",
    unread: true,
    online: true,
  },
];

export function WorkspaceHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);

  const unreadNotifs = mockNotifications.filter((n) => n.unread).length;
  const unreadMsgs = mockMessages.filter((m) => m.unread).length;

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-foreground-muted hover:text-foreground" />
      <div className="hidden h-5 w-px bg-border md:block" />

      <div className="hidden items-center gap-2 text-[12px] text-foreground-muted md:flex">
        <span className="font-mono uppercase tracking-[0.2em]">
          Electro-Pi
        </span>
        <span>/</span>
        <span className="text-foreground">Workspace</span>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Popover open={msgOpen} onOpenChange={setMsgOpen}>
          <PopoverTrigger
            title="Messages"
            render={
              <button
                className={cn(
                  "relative grid size-10 place-items-center rounded-md text-foreground-muted transition-colors hover:bg-muted hover:text-foreground",
                  msgOpen && "bg-muted text-foreground",
                )}
              >
                <MessageSquare className="size-[18px]" />
                {unreadMsgs > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-[18px] items-center justify-center rounded-full bg-highlight text-[9px] font-bold text-highlight-foreground ring-2 ring-background">
                    {unreadMsgs}
                  </span>
                )}
              </button>
            }
          />
          <PopoverContent align="end" sideOffset={8} className="w-80 p-0">
            <PopoverHeader className="flex items-center justify-between px-4 py-3">
              <PopoverTitle className="font-display text-sm italic">
                Messages
              </PopoverTitle>
              <span className="text-[11px] text-foreground-muted">
                {unreadMsgs} unread
              </span>
            </PopoverHeader>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {mockMessages.map((m) => (
                <Link
                  key={m.id}
                  href="/messages"
                  onClick={() => setMsgOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                    m.unread && "bg-primary/5",
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="size-9 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-muted text-[11px] font-semibold text-foreground">
                        {m.initials}
                      </AvatarFallback>
                    </Avatar>
                    {m.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {m.name}
                      </p>
                      <span className="shrink-0 text-[10px] text-foreground-muted">
                        {m.time}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-foreground-muted">
                      {m.body}
                    </p>
                  </div>
                  {m.unread && (
                    <span className="size-2 shrink-0 rounded-full bg-highlight" />
                  )}
                </Link>
              ))}
            </div>
            <Link
              href="/messages"
              onClick={() => setMsgOpen(false)}
              className="block border-t border-border px-4 py-2.5 text-center text-[12px] font-medium text-foreground-muted transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              View all messages
            </Link>
          </PopoverContent>
        </Popover>

        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger
            title="Notifications"
            render={
                <button
                  className={cn(
                    "relative grid size-10 place-items-center rounded-md text-foreground-muted transition-colors hover:bg-muted hover:text-foreground",
                    notifOpen && "bg-muted text-foreground",
                  )}
                >
                  <Bell className="size-[18px]" />
                  {unreadNotifs > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-[18px] items-center justify-center rounded-full bg-highlight text-[9px] font-bold text-highlight-foreground ring-2 ring-background">
                      {unreadNotifs}
                    </span>
                  )}
                </button>
            }
          />
          <PopoverContent align="end" sideOffset={8} className="w-80 p-0">
            <PopoverHeader className="flex items-center justify-between px-4 py-3">
              <PopoverTitle className="font-display text-sm italic">
                Notifications
              </PopoverTitle>
              <span className="text-[11px] text-foreground-muted">
                {unreadNotifs} unread
              </span>
            </PopoverHeader>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                    n.unread && "bg-primary/5",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg",
                      n.unread
                        ? "bg-highlight/10 text-highlight"
                        : "bg-muted text-foreground-muted",
                    )}
                  >
                    <n.icon className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-foreground leading-snug">
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-foreground-muted leading-snug">
                      {n.body}
                    </p>
                    <p className="mt-1 text-[10px] text-foreground-muted/60">
                      {n.time}
                    </p>
                  </div>
                  {n.unread && (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-highlight" />
                  )}
                </div>
              ))}
            </div>
            <Link
              href="/notifications"
              onClick={() => setNotifOpen(false)}
              className="block border-t border-border px-4 py-2.5 text-center text-[12px] font-medium text-foreground-muted transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              View all notifications
            </Link>
          </PopoverContent>
        </Popover>

        <Link
          href="/profile"
          title="Profile"
          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-muted"
        >
          <div className="grid size-7 place-items-center rounded-md bg-foreground/10">
            <span className="text-[11px] font-bold text-foreground">
              {user?.initials ?? "??"}
            </span>
          </div>
          <span className="hidden text-[13px] font-medium md:inline">
            {user?.name?.split(" ")[0] ?? "Profile"}
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon-sm"
          className="text-foreground-muted hover:text-destructive"
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
