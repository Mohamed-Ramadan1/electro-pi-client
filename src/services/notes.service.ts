import { apiClient } from "@/lib/api/client";
import type { NotesListResponse, SingleNoteResponse } from "@/types/api";

export const notesService = {
  list: async (): Promise<NotesListResponse> => {
    const res = await apiClient.get<NotesListResponse>("/notes");
    return res.data;
  },

  create: async (data: {
    title: string;
    content?: string;
    file?: File | null;
  }): Promise<SingleNoteResponse> => {
    const fd = new FormData();
    fd.append("title", data.title);
    if (data.content) fd.append("content", data.content);
    if (data.file) fd.append("file", data.file);
    const res = await apiClient.post<SingleNoteResponse>("/notes", fd);
    return res.data;
  },

  update: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      file?: File | null;
    },
  ): Promise<SingleNoteResponse> => {
    const fd = new FormData();
    if (data.title) fd.append("title", data.title);
    if (data.content !== undefined) fd.append("content", data.content);
    if (data.file) fd.append("file", data.file);
    const res = await apiClient.patch<SingleNoteResponse>(`/notes/${id}`, fd);
    return res.data;
  },

  getById: async (id: string): Promise<SingleNoteResponse> => {
    const res = await apiClient.get<SingleNoteResponse>(`/notes/${id}`);
    return res.data;
  },

  activate: async (id: string): Promise<SingleNoteResponse> => {
    const res = await apiClient.patch<SingleNoteResponse>(`/notes/${id}/activate`);
    return res.data;
  },

  deactivate: async (id: string): Promise<SingleNoteResponse> => {
    const res = await apiClient.patch<SingleNoteResponse>(`/notes/${id}/deactivate`);
    return res.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>(`/notes/${id}`);
    return res.data;
  },
};
