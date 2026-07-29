"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsService } from "@/services/projects.service";
import type { ProjectsListResponse, SingleProjectResponse } from "@/types/api";

export function useProjects() {
  return useQuery<ProjectsListResponse>({
    queryKey: ["projects"],
    queryFn: () => projectsService.list(),
  });
}

export function useProject(id: string) {
  return useQuery<SingleProjectResponse>({
    queryKey: ["projects", id],
    queryFn: () => projectsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project");
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Partial<{
      name: string;
      description: string;
      file: File | null;
      members: string[];
    }>) => projectsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update project");
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove project");
    },
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => projectsService.addMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Member added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add member");
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => projectsService.removeMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Member removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove member");
    },
  });
}

export function useCloseProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.close,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project closed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to close project");
    },
  });
}

export function useReopenProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.reopen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project reopened");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reopen project");
    },
  });
}
