import { apiClient } from "@/lib/api/client";
import type { UserDto, UsersListResponse, SingleUserResponse } from "@/types/api";

export const usersService = {
  list: async (): Promise<UsersListResponse> => {
    const res = await apiClient.get<UsersListResponse>("/users");
    return res.data;
  },

  getById: async (id: string): Promise<SingleUserResponse> => {
    const res = await apiClient.get<SingleUserResponse>(`/users/${id}`);
    return res.data;
  },

  create: async (data: {
    name: string;
    email: string;
    password: string;
    roles: string[];
  }): Promise<SingleUserResponse> => {
    const res = await apiClient.post<SingleUserResponse>("/users", data);
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<{ name: string; email: string; roles: string[] }>,
  ): Promise<SingleUserResponse> => {
    const res = await apiClient.patch<SingleUserResponse>(`/users/${id}`, data);
    return res.data;
  },

  activate: async (id: string): Promise<SingleUserResponse> => {
    const res = await apiClient.patch<SingleUserResponse>(`/users/${id}/activate`);
    return res.data;
  },

  deactivate: async (id: string): Promise<SingleUserResponse> => {
    const res = await apiClient.patch<SingleUserResponse>(`/users/${id}/deactivate`);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
