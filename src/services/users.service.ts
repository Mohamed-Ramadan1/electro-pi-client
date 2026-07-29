import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse, UserDto } from "@/types/api";

export const usersService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<UserDto>> => {
    const res = await apiClient.get<PaginatedResponse<UserDto>>("/users", {
      params,
    });
    return res.data;
  },

  getById: async (id: string): Promise<UserDto> => {
    const res = await apiClient.get<{ data: UserDto }>(`/users/${id}`);
    return res.data.data;
  },

  create: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<UserDto> => {
    const res = await apiClient.post<{ data: UserDto }>("/users", data);
    return res.data.data;
  },

  update: async (
    id: string,
    data: Partial<{ name: string; email: string; role: string; isActive: boolean }>,
  ): Promise<UserDto> => {
    const res = await apiClient.patch<{ data: UserDto }>(`/users/${id}`, data);
    return res.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
