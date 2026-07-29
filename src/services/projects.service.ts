import { apiClient } from "@/lib/api/client";
import type {
  ProjectsListResponse,
  SingleProjectResponse,
  DeleteProjectResponse,
} from "@/types/api";

function toFormData(data: {
  name: string;
  description?: string;
  members?: string[];
  file?: File | null;
}): FormData {
  const fd = new FormData();
  fd.append("name", data.name);
  if (data.description) fd.append("description", data.description);
  if (data.file) fd.append("file", data.file);
  if (data.members?.length) {
    data.members.forEach((id) => fd.append("members", id));
  }
  return fd;
}

export const projectsService = {
  list: async (): Promise<ProjectsListResponse> => {
    const res = await apiClient.get<ProjectsListResponse>("/members");
    return res.data;
  },

  getById: async (id: string): Promise<SingleProjectResponse> => {
    const res = await apiClient.get<SingleProjectResponse>(`/members/${id}`);
    return res.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    file?: File | null;
    members?: string[];
  }): Promise<SingleProjectResponse> => {
    const fd = toFormData(data);
    const res = await apiClient.post<SingleProjectResponse>("/projects", fd);
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      file: File | null;
      members: string[];
    }>,
  ): Promise<SingleProjectResponse> => {
    const fd = toFormData(data as {
      name: string;
      description?: string;
      file?: File | null;
      members?: string[];
    });
    const res = await apiClient.patch<SingleProjectResponse>(
      `/projects/${id}`,
      fd,
    );
    return res.data;
  },

  remove: async (id: string): Promise<DeleteProjectResponse> => {
    const res = await apiClient.delete<DeleteProjectResponse>(
      `/projects/${id}`,
    );
    return res.data;
  },

  addMember: async (
    projectId: string,
    userId: string,
  ): Promise<SingleProjectResponse> => {
    const res = await apiClient.post<SingleProjectResponse>(
      `/projects/${projectId}/members/${userId}`,
    );
    return res.data;
  },

  removeMember: async (
    projectId: string,
    userId: string,
  ): Promise<SingleProjectResponse> => {
    const res = await apiClient.delete<SingleProjectResponse>(
      `/projects/${projectId}/members/${userId}`,
    );
    return res.data;
  },

  close: async (id: string): Promise<SingleProjectResponse> => {
    const res = await apiClient.patch<SingleProjectResponse>(
      `/projects/${id}/close`,
    );
    return res.data;
  },

  reopen: async (id: string): Promise<SingleProjectResponse> => {
    const res = await apiClient.patch<SingleProjectResponse>(
      `/projects/${id}/reopen`,
    );
    return res.data;
  },
};
