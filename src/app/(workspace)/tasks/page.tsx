"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  Flag,
  Calendar,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks/use-tasks";
import { useUpdateTaskStatus, useUpdateTask } from "@/hooks/use-tasks";
import { useIsAdmin } from "@/hooks/use-role";
import { useAuthStore } from "@/stores/auth-store";
import { tasksStatus, tasksPriority } from "@/types/api";
import type { TaskDto } from "@/types/api";

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

const priorityConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  [tasksPriority.HIGH]: { label: "High", variant: "default" },
  [tasksPriority.MEDIUM]: { label: "Medium", variant: "secondary" },
  [tasksPriority.LOW]: { label: "Low", variant: "outline" },
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  [tasksStatus.TODO]: { label: "Todo", variant: "outline" },
  [tasksStatus.INPROGRESS]: { label: "In Progress", variant: "default" },
  [tasksStatus.DONE]: { label: "Done", variant: "secondary" },
};

export default function TasksPage() {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data, isLoading } = useTasks();
  const updateStatus = useUpdateTaskStatus();
  const updateTask = useUpdateTask();

  const tasks = data?.tasks ?? [];

  const handleStatusChange = (task: TaskDto) => {
    let next: string;
    if (task.status === tasksStatus.TODO) {
      next = tasksStatus.INPROGRESS;
    } else if (task.status === tasksStatus.INPROGRESS) {
      next = tasksStatus.DONE;
    } else {
      next = tasksStatus.TODO;
    }
    if (isAdmin) {
      updateTask.mutate({ id: task.id, status: next });
    } else {
      updateStatus.mutate({ id: task.id, status: next });
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl italic text-foreground">Tasks</h1>
        <p className="mt-1 text-[13px] text-foreground-muted">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <CheckSquare className="size-8 text-primary/60" />
          </div>
          <h3 className="mt-5 font-display text-lg italic text-foreground">
            No tasks yet
          </h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Tasks assigned to you or created by you will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const pc = priorityConfig[task.priority] ?? priorityConfig[tasksPriority.LOW];
            const sc = statusConfig[task.status] ?? statusConfig[tasksStatus.TODO];
            const isAssigned = currentUserId && task.assignee?.id === currentUserId;
            const canChange = isAdmin || isAssigned;
            const isBusy = updateStatus.isPending || updateTask.isPending;
            return (
              <div
                key={task.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20"
              >
                <button
                  onClick={() => handleStatusChange(task)}
                  disabled={isBusy || !canChange}
                  className="shrink-0 mt-0.5"
                  title={!canChange ? "Only the assigned user can change status" : undefined}
                >
                  <div
                    className={`flex size-5 items-center justify-center rounded-full border-2 ${
                      task.status === tasksStatus.DONE
                        ? "border-success bg-success"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {task.status === tasksStatus.DONE && (
                      <svg
                        className="size-3 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[14px] font-medium ${
                        task.status === tasksStatus.DONE
                          ? "text-foreground-muted line-through"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </p>
                  </div>
                  {task.description && (
                    <p className="mt-0.5 text-[12px] text-foreground-muted line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-foreground-muted">
                    <Badge variant={sc.variant as "default" | "secondary" | "outline"} className="text-[10px] px-1.5 py-0">
                      {sc.label}
                    </Badge>
                    <Badge variant={pc.variant as "default" | "secondary" | "outline"} className="text-[10px] px-1.5 py-0">
                      <Flag className="size-2.5 mr-1" />
                      {pc.label}
                    </Badge>
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {task.assignee && (
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(
                          task.assignee.firstName,
                          task.assignee.lastName,
                        )}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => router.push(`/projects/${task.project.id}`)}
                    title="Open project"
                  >
                    <ExternalLink className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
