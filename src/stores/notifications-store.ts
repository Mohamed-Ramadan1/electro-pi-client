import { create } from "zustand";

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "mention";
}

interface NotificationsState {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Project update",
    description: "Sarah completed the API integration task in Sprint 4.",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "New comment",
    description: "Alex mentioned you in a comment on PR #42 — Notifications module.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
    type: "mention",
  },
  {
    id: "3",
    title: "Deadline approaching",
    description: "Sprint demo slides are due tomorrow at 10:00 AM.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    type: "warning",
  },
  {
    id: "4",
    title: "Build succeeded",
    description: "CI pipeline #284 completed successfully on main branch.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    type: "success",
  },
  {
    id: "5",
    title: "Team invite",
    description: "You've been invited to join the Design System working group.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    type: "info",
  },
];

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: initialNotifications,

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
