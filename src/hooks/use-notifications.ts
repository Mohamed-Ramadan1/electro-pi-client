"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsService } from "@/services/notifications.service";
import type {
  NotificationsCountResponse,
  NotificationsListResponse,
  NotificationDto,
} from "@/types/api";

export function useNotifications() {
  return useQuery<NotificationsListResponse, Error, NotificationDto[]>({
    queryKey: ["notifications"],
    queryFn: notificationsService.list,
    select: (data) => data.notifications,
    refetchInterval: 30_000,
  });
}

export function useNotificationsCount() {
  return useQuery<NotificationsCountResponse>({
    queryKey: ["notifications", "count"],
    queryFn: notificationsService.count,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsService.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notifications marked as read");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark notifications as read");
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsService.deleteAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications cleared");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to clear notifications");
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsService.deleteOne,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });
}
