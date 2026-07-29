import { apiClient } from "@/lib/api/client";
import type { TasksListResponse, SingleTaskResponse } from "@/types/api";

function toFormData(data: {
  title?: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  priority?: string;
  dueDate?: string;
  status?: string;
  files?: File[] | null;
}): FormData {
  const fd = new FormData();
  if (data.title) fd.append("title", data.title);
  if (data.description) fd.append("description", data.description);
  if (data.projectId) fd.append("projectId", data.projectId);
  if (data.assigneeId) fd.append("assigneeId", data.assigneeId);
  if (data.priority) fd.append("priority", data.priority);
  if (data.dueDate) fd.append("dueDate", data.dueDate);
  if (data.status) fd.append("status", data.status);
  if (data.files?.length) {
    data.files.forEach((f) => fd.append("files", f));
  }
  return fd;
}

export const tasksService = {
  /* ── Admin endpoints ── */

  create: async (data: {
    title: string;
    description?: string;
    projectId: string;
    assigneeId?: string;
    priority?: string;
    dueDate?: string;
    files?: File[] | null;
  }): Promise<SingleTaskResponse> => {
    const fd = toFormData(data);
    const res = await apiClient.post<SingleTaskResponse>("/tasks", fd);
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      dueDate: string;
      assigneeId: string;
      files: File[] | null;
    }>,
  ): Promise<SingleTaskResponse> => {
    const fd = toFormData(data as Record<string, unknown>);
    const res = await apiClient.patch<SingleTaskResponse>(`/tasks/${id}`, fd);
    return res.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>(`/tasks/${id}`);
    return res.data;
  },

  assign: async (
    taskId: string,
    userId: string,
  ): Promise<SingleTaskResponse> => {
    const res = await apiClient.patch<SingleTaskResponse>(
      `/tasks/${taskId}/assign/${userId}`,
    );
    return res.data;
  },

  unassign: async (taskId: string): Promise<SingleTaskResponse> => {
    const res = await apiClient.delete<SingleTaskResponse>(
      `/tasks/${taskId}/assign`,
    );
    return res.data;
  },

  listAllAdmin: async (): Promise<TasksListResponse> => {
    const res = await apiClient.get<TasksListResponse>("/tasks");
    return res.data;
  },

  listByProjectAdmin: async (
    projectId: string,
  ): Promise<TasksListResponse> => {
    const res = await apiClient.get<TasksListResponse>(
      `/tasks/project/${projectId}`,
    );
    return res.data;
  },

  getByIdAdmin: async (id: string): Promise<SingleTaskResponse> => {
    const res = await apiClient.get<SingleTaskResponse>(`/tasks/${id}`);
    return res.data;
  },

  /* ── Member endpoints (read + status update) ── */

  listAll: async (): Promise<TasksListResponse> => {
    const res = await apiClient.get<TasksListResponse>("/members/tasks");
    return res.data;
  },

  listByProject: async (projectId: string): Promise<TasksListResponse> => {
    const res = await apiClient.get<TasksListResponse>(
      `/members/tasks/project/${projectId}`,
    );
    return res.data;
  },

  getById: async (id: string): Promise<SingleTaskResponse> => {
    const res = await apiClient.get<SingleTaskResponse>(
      `/members/tasks/${id}`,
    );
    return res.data;
  },

  updateStatus: async (
    id: string,
    status: string,
  ): Promise<SingleTaskResponse> => {
    const res = await apiClient.patch<SingleTaskResponse>(
      `/members/tasks/${id}/status`,
      { status },
    );
    return res.data;
  },
};
