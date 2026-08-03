import { apiClient } from "@/lib/api/client";
import type {
  NotificationsCountResponse,
  NotificationsListResponse,
  ApiMessage,
} from "@/types/api";

export const notificationsService = {
  list: async (): Promise<NotificationsListResponse> => {
    const res = await apiClient.get<NotificationsListResponse>("/notifications");
    return res.data;
  },

  count: async (): Promise<NotificationsCountResponse> => {
    const res = await apiClient.get<NotificationsCountResponse>("/notifications/count");
    return res.data;
  },

  markRead: async (): Promise<ApiMessage> => {
    const res = await apiClient.post<ApiMessage>("/notifications/mark-read");
    return res.data;
  },

  deleteAll: async (): Promise<void> => {
    await apiClient.delete("/notifications/all");
  },

  deleteOne: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};
