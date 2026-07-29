"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksService } from "@/services/tasks.service";
import type { TasksListResponse, SingleTaskResponse } from "@/types/api";

/* ── Member reads (all users) ── */

export function useTasks() {
  return useQuery<TasksListResponse>({
    queryKey: ["tasks"],
    queryFn: () => tasksService.listAll(),
  });
}

export function useProjectTasks(projectId: string) {
  return useQuery<TasksListResponse>({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => tasksService.listByProject(projectId),
    enabled: !!projectId,
  });
}

export function useTask(id: string) {
  return useQuery<SingleTaskResponse>({
    queryKey: ["tasks", id],
    queryFn: () => tasksService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      tasksService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task status");
    },
  });
}

/* ── Admin writes (gated by UI) ── */

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task");
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      dueDate: string;
      assigneeId: string;
      files: File[] | null;
    }>) => tasksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });
}

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      userId,
    }: {
      taskId: string;
      userId: string;
    }) => tasksService.assign(taskId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task assigned");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign task");
    },
  });
}

export function useUnassignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksService.unassign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task unassigned");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unassign task");
    },
  });
}
