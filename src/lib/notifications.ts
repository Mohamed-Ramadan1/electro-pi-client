"use client";

import {
  Bell,
  CheckCircle2,
  FolderKanban,
  Users,
  AlertTriangle,
  MessageSquare,
  Clock,
  type LucideIcon,
} from "lucide-react";

const notifConfig: Record<string, { icon: LucideIcon; color: string }> = {
  task_assigned: { icon: CheckCircle2, color: "bg-blue-500/10 text-blue-500" },
  task_completed: { icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-500" },
  task_updated: { icon: CheckCircle2, color: "bg-blue-500/10 text-blue-500" },
  project_assigned: { icon: FolderKanban, color: "bg-amber-500/10 text-amber-500" },
  project_closed: { icon: FolderKanban, color: "bg-amber-500/10 text-amber-500" },
  team_added: { icon: Users, color: "bg-purple-500/10 text-purple-500" },
  team_removed: { icon: Users, color: "bg-purple-500/10 text-purple-500" },
  message_sent: { icon: MessageSquare, color: "bg-blue-500/10 text-blue-500" },
  system: { icon: AlertTriangle, color: "bg-red-500/10 text-red-500" },
  reminder: { icon: Clock, color: "bg-amber-500/10 text-amber-500" },
};

const fallbackNotif = { icon: Bell, color: "bg-muted text-foreground-muted" };

export function getNotifIcon(notifType: string) {
  return notifConfig[notifType]?.icon ?? fallbackNotif.icon;
}

export function getNotifColor(notifType: string) {
  return notifConfig[notifType]?.color ?? fallbackNotif.color;
}
