"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  FolderKanban,
  ImageIcon,
  Users,
  MoreHorizontal,
  Trash2,
  Pencil,
  Loader2,
  Calendar,
  UserCircle,
  Lock,
  Unlock,
  UserPlus,
  X,
  Check,
  Plus,
  CheckSquare,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useProject,
  useDeleteProject,
  useCloseProject,
  useReopenProject,
  useAddMember,
  useRemoveMember,
} from "@/hooks/use-projects";
import {
  useProjectTasks,
  useCreateTask,
  useUpdateTaskStatus,
  useUpdateTask,
  useDeleteTask,
  useAssignTask,
  useUnassignTask,
} from "@/hooks/use-tasks";
import { useUsers } from "@/hooks/use-users";
import { useIsAdmin } from "@/hooks/use-role";
import { useAuthStore } from "@/stores/auth-store";
import { getImageUrl } from "@/lib/images";
import { tasksService } from "@/services/tasks.service";
import type { UserDto } from "@/types/api";
import type { SingleTaskResponse } from "@/types/api";
import {
  tasksStatus,
  tasksPriority,
} from "@/types/api";
import type { TaskDto } from "@/types/api";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const id = params.id as string;
  const [deleting, setDeleting] = useState(false);
  const { data, isLoading, isError } = useProject(id, !deleting);
  const { data: usersData } = useUsers();
  const deleteProject = useDeleteProject();
  const closeProject = useCloseProject();
  const reopenProject = useReopenProject();
  const addMember = useAddMember();
  const removeMember = useRemoveMember();
  const { data: tasksData } = useProjectTasks(id);
  const createTask = useCreateTask();
  const updateTaskStatus = useUpdateTaskStatus();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const assignTask = useAssignTask();
  const unassignTask = useUnassignTask();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [taskCreateOpen, setTaskCreateOpen] = useState(false);
  const [taskFiles, setTaskFiles] = useState<File[]>([]);

  const project = data?.project;
  const allUsers = usersData?.users ?? [];
  const memberIds = new Set(project?.members?.map((m) => m.id) ?? []);
  const nonMembers = allUsers.filter((u) => !memberIds.has(u.id) && u.isActive);
  const isOpen = project?.projectStatus === "open";
  const isPending =
    deleteProject.isPending ||
    closeProject.isPending ||
    reopenProject.isPending;

  const handleDelete = () => {
    setDeleting(true);
    router.push("/projects");
    deleteProject.mutate(id);
  };

  const handleClose = () => closeProject.mutate(id);
  const handleReopen = () => reopenProject.mutate(id);

  const handleAddMember = (userId: string) => {
    addMember.mutate(
      { projectId: id, userId },
      { onSuccess: () => setAddMemberOpen(false) },
    );
  };

  const handleRemoveMember = (userId: string) => {
    setRemovingId(userId);
    removeMember.mutate(
      { projectId: id, userId },
      { onSettled: () => setRemovingId(null) },
    );
  };

  const bannerUrl = getImageUrl(project?.projectImage ?? null);
  const [bannerFailed, setBannerFailed] = useState(false);
  const tasks = tasksData?.tasks ?? [];
  const todoTasks = tasks.filter((t) => t.status === tasksStatus.TODO);
  const inProgressTasks = tasks.filter((t) => t.status === tasksStatus.INPROGRESS);
  const doneTasks = tasks.filter((t) => t.status === tasksStatus.DONE);

  const handleTaskStatusChange = (taskId: string, status: string) => {
    if (isAdmin) {
      updateTask.mutate({ id: taskId, status });
    } else {
      updateTaskStatus.mutate({ id: taskId, status });
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-10">
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="px-6 py-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/projects")}
          className="mb-8"
        >
          <ArrowLeft className="-ml-1 size-4" />
          Back to Projects
        </Button>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <FolderKanban className="size-8 text-destructive/60" />
          </div>
          <h3 className="mt-5 font-display text-lg italic text-foreground">
            Project not found
          </h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const memberCount = project.members?.length ?? 0;

  return (
    <div className="px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/projects")}
        >
          <ArrowLeft className="-ml-1 size-4" />
          Back to Projects
        </Button>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" disabled={isPending} />
              }
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MoreHorizontal className="size-4" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => {}}>
                <Pencil className="size-3.5" />
                Edit Project
              </DropdownMenuItem>
              {isOpen ? (
                <DropdownMenuItem onClick={handleClose}>
                  <Lock className="size-3.5" />
                  Close Project
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleReopen}>
                  <Unlock className="size-3.5" />
                  Reopen Project
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl bg-muted">
        {bannerUrl && !bannerFailed ? (
          <img
            src={bannerUrl}
            alt={project.name}
            onError={() => setBannerFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="size-12 text-foreground/15" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
          <h1 className="font-display text-2xl italic text-white">
            {project.name}
          </h1>
          <Badge
            variant={isOpen ? "default" : "secondary"}
            className="shrink-0 text-[11px]"
          >
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-display text-lg italic text-foreground">
              About
            </h2>
            <p className="mt-2 text-[14px] text-foreground-muted leading-relaxed">
              {project.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-[13px] text-foreground-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserCircle className="size-4" />
              <span>
                Owned by{" "}
                <span className="text-foreground font-medium">
                  {project.creator?.name ?? "Unknown"}
                </span>
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base italic text-foreground">
                Tasks ({tasks.length})
              </h3>
              {isAdmin && (
                <Button size="xs" onClick={() => setTaskCreateOpen(true)}>
                  <Plus className="size-3" />
                  Add Task
                </Button>
              )}
            </div>
            {tasks.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <TaskColumn
                  label="Todo"
                  tasks={todoTasks}
                  color="border-l-info"
                  iconBg="bg-info/10"
                  onStatusChange={handleTaskStatusChange}
                  onDelete={(taskId) => deleteTask.mutate(taskId)}
                  isAdmin={isAdmin}
                  currentUserId={currentUserId}
                  members={project?.members ?? []}
                  onAssign={(taskId, userId) => assignTask.mutate({ taskId, userId })}
                  onUnassign={(taskId) => unassignTask.mutate(taskId)}
                />
                <TaskColumn
                  label="In Progress"
                  tasks={inProgressTasks}
                  color="border-l-warning"
                  iconBg="bg-warning/10"
                  onStatusChange={handleTaskStatusChange}
                  onDelete={(taskId) => deleteTask.mutate(taskId)}
                  isAdmin={isAdmin}
                  currentUserId={currentUserId}
                  members={project?.members ?? []}
                  onAssign={(taskId, userId) => assignTask.mutate({ taskId, userId })}
                  onUnassign={(taskId) => unassignTask.mutate(taskId)}
                />
                <TaskColumn
                  label="Done"
                  tasks={doneTasks}
                  color="border-l-success"
                  iconBg="bg-success/10"
                  onStatusChange={handleTaskStatusChange}
                  onDelete={(taskId) => deleteTask.mutate(taskId)}
                  isAdmin={isAdmin}
                  currentUserId={currentUserId}
                  members={project?.members ?? []}
                  onAssign={(taskId, userId) => assignTask.mutate({ taskId, userId })}
                  onUnassign={(taskId) => unassignTask.mutate(taskId)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <CheckSquare className="size-5 text-foreground/25" />
                </div>
                <p className="mt-2.5 text-[13px] text-foreground-muted">
                  No tasks yet.
                </p>
                {isAdmin && (
                  <Button
                    size="xs"
                    className="mt-3"
                    onClick={() => setTaskCreateOpen(true)}
                  >
                    <Plus className="size-3" />
                    Add first task
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-foreground-muted" />
                <h3 className="text-[13px] font-medium text-foreground">
                  Members ({memberCount})
                </h3>
              </div>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setAddMemberOpen(true)}
                  title="Add member"
                >
                  <UserPlus className="size-3.5" />
                </Button>
              )}
            </div>
            {memberCount > 0 ? (
              <div className="space-y-1">
                {project.members.map((member: UserDto) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] hover:bg-muted/50 transition-colors group"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="text-[11px]">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {member.name}
                      </p>
                      <p className="truncate text-[12px] text-foreground-muted">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {member.roles.includes("admin") && (
                        <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0">
                          Admin
                        </Badge>
                      )}
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removingId === member.id}
                        >
                          {removingId === member.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <X className="size-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-foreground-muted py-2">
                No members added yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg italic">
              Add Member
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              Select a user to add to this project.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-border bg-background p-2 space-y-1">
            {nonMembers.length > 0 ? (
              nonMembers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleAddMember(user.id)}
                  disabled={addMember.isPending}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-left hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <Avatar className="size-7">
                    <AvatarFallback className="text-[10px]">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-[12px] text-foreground-muted">
                      {user.email}
                    </p>
                  </div>
                  <Check className="size-3.5 text-foreground-muted opacity-0 group-hover:opacity-100" />
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center text-[13px] text-foreground-muted">
                All active users are already members.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <TaskCreateDialog
        open={taskCreateOpen}
        onOpenChange={setTaskCreateOpen}
        projectId={id}
        members={project.members}
        onCreate={(data) => {
          createTask.mutate(data, {
            onSuccess: () => {
              setTaskCreateOpen(false);
              setTaskFiles([]);
            },
          });
        }}
        files={taskFiles}
        onFilesChange={setTaskFiles}
        isPending={createTask.isPending}
      />
    </div>
  );
}

function TaskCard({
  task,
  onStatusChange,
  onDelete,
  isAdmin,
  currentUserId,
  members,
  onAssign,
  onUnassign,
}: {
  task: TaskDto;
  onStatusChange: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
  isAdmin: boolean;
  currentUserId?: string;
  members: UserDto[];
  onAssign: (taskId: string, userId: string) => void;
  onUnassign: (taskId: string) => void;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const isAssigned = currentUserId && task.assignee?.id === currentUserId;
  const canChange = isAdmin || isAssigned;
  const isDone = task.status === tasksStatus.DONE;

  const priorityColors: Record<string, string> = {
    [tasksPriority.HIGH]: "text-destructive",
    [tasksPriority.MEDIUM]: "text-warning",
    [tasksPriority.LOW]: "text-foreground-muted",
  };

  return (
    <>
      <div className="w-full rounded-lg border border-border bg-background p-5 hover:border-primary/20 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[15px] font-medium text-foreground line-clamp-2">
            {task.title}
          </p>
          {isAdmin && (
            <button
              onClick={() => onDelete(task.id)}
              className="shrink-0 rounded p-0.5 text-foreground-muted hover:text-destructive transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>

        {task.description && (
          <p className="mt-1.5 text-[13px] text-foreground-muted line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flag className={`size-3.5 ${priorityColors[task.priority]}`} />
            {task.assignee && (
              <Avatar className="size-5">
                <AvatarFallback className="text-[9px]">
                  {task.assignee.firstName?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
            )}
            {task.dueDate && (
              <span className="text-[12px] text-foreground-muted">
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>

          {canChange && (
            <div className="flex items-center gap-0.5">
              {!isDone && task.status !== tasksStatus.TODO && (
                <button
                  onClick={() => onStatusChange(task.id, tasksStatus.TODO)}
                  className="rounded p-0.5 text-foreground-muted hover:text-primary transition-colors cursor-pointer"
                  title="Move to Todo"
                >
                  <ChevronLeft className="size-4" />
                </button>
              )}
              <button
                onClick={() => {
                  if (task.status === tasksStatus.TODO) {
                    onStatusChange(task.id, tasksStatus.INPROGRESS);
                  } else if (task.status === tasksStatus.INPROGRESS) {
                    onStatusChange(task.id, tasksStatus.DONE);
                  } else {
                    onStatusChange(task.id, tasksStatus.TODO);
                  }
                }}
                className="rounded p-0.5 text-foreground-muted hover:text-primary transition-colors cursor-pointer"
                title={
                  task.status === tasksStatus.TODO
                    ? "Move to In Progress"
                    : task.status === tasksStatus.INPROGRESS
                      ? "Mark Done"
                      : "Reopen (Todo)"
                }
              >
                {task.status === tasksStatus.DONE ? (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setDetailOpen(true)}
          className="mt-3 w-full rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[13px] font-medium py-1.5 transition-colors cursor-pointer"
        >
          View Details
        </button>
      </div>

      <TaskDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        taskId={task.id}
        members={members}
        isAdmin={isAdmin}
        onAssign={onAssign}
        onUnassign={onUnassign}
      />
    </>
  );
}

function TaskColumn({
  label,
  tasks,
  color,
  iconBg,
  onStatusChange,
  onDelete,
  isAdmin,
  currentUserId,
  members,
  onAssign,
  onUnassign,
}: {
  label: string;
  tasks: TaskDto[];
  color: string;
  iconBg: string;
  onStatusChange: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
  isAdmin: boolean;
  currentUserId?: string;
  members: UserDto[];
  onAssign: (taskId: string, userId: string) => void;
  onUnassign: (taskId: string) => void;
}) {
  return (
    <div className={`rounded-lg border-l-2 ${color} bg-muted/20 p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex size-6 items-center justify-center rounded ${iconBg}`}>
          <span className="text-[11px] font-medium">{tasks.length}</span>
        </div>
        <span className="text-[13px] font-medium text-foreground-muted uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
            members={members}
            onAssign={onAssign}
            onUnassign={onUnassign}
          />
        ))}
        {tasks.length === 0 && (
          <p className="py-4 text-center text-[13px] text-foreground-muted">
            No tasks
          </p>
        )}
      </div>
    </div>
  );
}

function TaskCreateDialog({
  open,
  onOpenChange,
  projectId,
  members,
  onCreate,
  files,
  onFilesChange,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  members: UserDto[];
  onCreate: (data: {
    title: string;
    description?: string;
    projectId: string;
    assigneeId?: string;
    priority?: string;
    dueDate?: string;
    files?: File[] | null;
  }) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>(tasksPriority.MEDIUM);
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length < 2) return;
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      projectId,
      assigneeId: assigneeId || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      files: files.length > 0 ? files : null,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTitle("");
    setDescription("");
    setPriority(tasksPriority.MEDIUM);
    setDueDate("");
    setAssigneeId("");
    onFilesChange([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange([...files, ...Array.from(e.target.files)]);
      e.target.value = "";
    }
  };

  const removeFile = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  const isValid = title.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl italic">
            Create Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-foreground">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Add details..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              >
                <option value={tasksPriority.LOW}>Low</option>
                <option value={tasksPriority.MEDIUM}>Medium</option>
                <option value={tasksPriority.HIGH}>High</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Due date
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </div>
          </div>

          {members.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-foreground">
              Attachments
            </label>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {files.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[12px] text-foreground-muted"
                  >
                    {f.name}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-foreground-muted hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="w-full text-[13px] text-foreground-muted file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-foreground hover:file:bg-muted/80"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!isValid || isPending}>
              {isPending && <Loader2 className="-ml-0.5 size-4 animate-spin" />}
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TaskDetailDialog({
  open,
  onOpenChange,
  taskId,
  members,
  isAdmin,
  onAssign,
  onUnassign,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  members: UserDto[];
  isAdmin: boolean;
  onAssign: (taskId: string, userId: string) => void;
  onUnassign: (taskId: string) => void;
}) {
  const [assignOpen, setAssignOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery<SingleTaskResponse>({
    queryKey: ["tasks", taskId],
    queryFn: () => tasksService.getById(taskId),
    enabled: open,
  });

  const task = data?.task;

  const priorityLabels: Record<string, string> = {
    [tasksPriority.LOW]: "Low",
    [tasksPriority.MEDIUM]: "Medium",
    [tasksPriority.HIGH]: "High",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isLoading ? (
          <div className="py-8 space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : isError || !task ? (
          <div className="py-8 text-center">
            <p className="text-[13px] text-destructive">
              {error?.message ?? "Failed to load task details."}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-lg italic text-foreground">
                {task.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-3 space-y-4">
              {task.description && (
                <p className="text-[13px] text-foreground-muted leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[11px] px-2 py-0.5">
                  Priority: {priorityLabels[task.priority] ?? task.priority}
                </Badge>
                <Badge variant="outline" className="text-[11px] px-2 py-0.5">
                  Status: {task.status}
                </Badge>
                {task.dueDate && (
                  <Badge variant="outline" className="text-[11px] px-2 py-0.5">
                    <Calendar className="size-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-foreground-muted">Creator:</span>
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px]">
                    {task.creator.firstName?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground">
                  {task.creator.firstName} {task.creator.lastName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="text-foreground-muted">Assignee:</span>
                  {task.assignee ? (
                    <>
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">
                          {task.assignee.firstName?.[0] ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">
                        {task.assignee.firstName} {task.assignee.lastName}
                      </span>
                    </>
                  ) : (
                    <span className="text-foreground-muted italic">Unassigned</span>
                  )}
                </div>
                {isAdmin && members.length > 0 && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setAssignOpen(!assignOpen)}
                    >
                      {task.assignee ? "Change" : "Assign"}
                    </Button>
                    {assignOpen && (
                      <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg">
                        {task.assignee && (
                          <button
                            onClick={() => {
                              onUnassign(taskId);
                              setAssignOpen(false);
                            }}
                            className="w-full rounded-md px-2 py-1.5 text-left text-[12px] text-destructive hover:bg-muted"
                          >
                            <X className="size-3 inline mr-1.5" />
                            Unassign
                          </button>
                        )}
                        {members
                          .filter((m) => m.id !== task.assignee?.id)
                          .map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                onAssign(taskId, m.id);
                                setAssignOpen(false);
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-foreground hover:bg-muted"
                            >
                              <Avatar className="size-5">
                                <AvatarFallback className="text-[9px]">
                                  {getInitials(m.name)}
                                </AvatarFallback>
                              </Avatar>
                              {m.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {task.images.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[12px] font-medium text-foreground-muted">
                    Attachments ({task.images.length})
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {task.images.map((img) => (
                      <img
                        key={img.id}
                        src={getImageUrl(img.url) ?? ""}
                        alt=""
                        className="rounded-lg border border-border object-cover h-24 w-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
