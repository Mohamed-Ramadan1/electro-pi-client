"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersService } from "@/services/users.service";
import type { UsersListResponse, SingleUserResponse } from "@/types/api";

export function useUsers(enabled = true) {
  return useQuery<UsersListResponse>({
    queryKey: ["users"],
    queryFn: () => usersService.list(),
    enabled,
  });
}

export function useUser(id: string) {
  return useQuery<SingleUserResponse>({
    queryKey: ["users", id],
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Partial<{
      name: string;
      email: string;
      roles: string[];
    }>) => usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User activated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to activate user");
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deactivated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate user");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove user");
    },
  });
}
