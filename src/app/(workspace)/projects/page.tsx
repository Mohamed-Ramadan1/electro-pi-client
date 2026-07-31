"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  FolderKanban,
  ImageIcon,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { useUsers } from "@/hooks/use-users";
import { useIsAdmin } from "@/hooks/use-role";
import type { ProjectDto } from "@/types/api";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/types/api";
import { getImageUrl } from "@/lib/images";

const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  members: z.array(z.string()).optional(),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

const ITEMS_PER_PAGE = 6;

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
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = useIsAdmin();
  const { data, isLoading } = useProjects();
  const { data: usersData } = useUsers(isAdmin);
  const createProject = useCreateProject();

  const projects = data?.projects ?? [];
  const users = usersData?.users ?? [];
  const activeUsers = users.filter((u) => u.isActive);

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { members: [] },
    mode: "onChange",
  });

  const selectedMembers = watch("members") ?? [];

  useEffect(() => {
    if (isAdmin && searchParams.get("create") === "true") {
      setCreateOpen(true);
    }
  }, [isAdmin, searchParams]);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = projects.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImagePreview(null);
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only PNG, JPEG, and WebP images are allowed");
      setImagePreview(null);
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be less than 5MB");
      setImagePreview(null);
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageError(null);
    setSelectedFile(null);
    const input = document.getElementById("create-file") as HTMLInputElement;
    if (input) input.value = "";
  };

  const onCreate = (data: CreateProjectValues) => {
    createProject.mutate(
      {
        name: data.name,
        description: data.description,
        file: selectedFile,
        members: data.members,
      },
      {
        onSuccess: () => {
          reset();
          setImagePreview(null);
          setImageError(null);
          setSelectedFile(null);
          const fileInput = document.getElementById("create-file") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
          setCreateOpen(false);
        },
      },
    );
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
    reset();
    setImagePreview(null);
    setImageError(null);
    setSelectedFile(null);
    const input = document.getElementById("create-file") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl italic text-foreground">
            Projects
          </h1>
          <p className="mt-1 text-[13px] text-foreground-muted">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              onClick={() => setCreateOpen(true)}
              disabled={createProject.isPending}
              size="sm"
            >
              <Plus className="-ml-0.5 size-4" />
              New Project
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-0 overflow-hidden"
            >
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex items-center gap-2 pt-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FolderKanban className="size-8 text-primary/60" />
          </div>
          <h3 className="mt-5 font-display text-lg italic text-foreground">
            No projects yet
          </h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            {isAdmin
              ? "Create your first project to get started."
              : "Projects created by admins will appear here."}
          </p>
          {isAdmin && (
            <Button
              className="mt-5"
              onClick={() => setCreateOpen(true)}
              size="sm"
            >
              <Plus className="-ml-0.5 size-4" />
              New Project
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => router.push(`/projects/${project.id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-[12px] text-foreground-muted">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={createOpen} onOpenChange={(open) => !open && handleCloseCreate()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl italic">
              Create Project
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              Set up a new project workspace with team members.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onCreate)} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="create-name"
                className="block text-[13px] font-medium text-foreground"
              >
                Project name
              </label>
              <input
                id="create-name"
                {...register("name")}
                placeholder="My Awesome Project"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
              {errors.name && (
                <p className="text-[12px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="create-description"
                className="block text-[13px] font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="create-description"
                {...register("description")}
                rows={3}
                placeholder="What is this project about?"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 resize-none"
              />
              {errors.description && (
                <p className="text-[12px] text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Poster image
              </label>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    className="h-36 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:bg-background transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/30 hover:bg-muted/50">
                  <Upload className="size-5 text-foreground-muted" />
                  <span className="text-[12px] text-foreground-muted">
                    PNG, JPEG, or WebP (max 5MB)
                  </span>
                  <input
                    id="create-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              )}
              {imageError && (
                <p className="text-[12px] text-destructive">{imageError}</p>
              )}
            </div>

            {activeUsers.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Members
                </label>
                <div className="max-h-36 overflow-y-auto rounded-lg border border-border bg-background p-3 space-y-1">
                  {activeUsers.map((user) => {
                    const checked = selectedMembers.includes(user.id);
                    return (
                      <label
                        key={user.id}
                        className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={user.id}
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...selectedMembers, user.id]
                              : selectedMembers.filter((id) => id !== user.id);
                            setValue("members", next, { shouldValidate: true });
                          }}
                          className="size-4 rounded border-border accent-primary cursor-pointer"
                        />
                        <Avatar className="size-5">
                          <AvatarFallback className="text-[10px]">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                        {user.roles.includes("admin") && (
                          <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                            Admin
                          </Badge>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseCreate}
                disabled={createProject.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!isValid || createProject.isPending}
              >
                {createProject.isPending && (
                  <Loader2 className="-ml-0.5 size-4 animate-spin" />
                )}
                Create Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectDto;
  onClick: () => void;
}) {
  const memberCount = project.members?.length ?? 0;
  const visibleMembers = project.members?.slice(0, 4) ?? [];
  const overflow = Math.max(0, memberCount - 4);
  const ownerInitials = getInitials(project.creator?.name ?? "");
  const imageUrl = getImageUrl(project.projectImage);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-xl border border-border bg-card text-left overflow-hidden transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
    >
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        {imageUrl && !imgFailed ? (
          <img
            src={imageUrl}
            alt={project.name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="size-10 text-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-base italic text-white line-clamp-1">
            {project.name}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-[13px] text-foreground-muted line-clamp-2 leading-relaxed">
          {project.description || "No description"}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {visibleMembers.map((m) => (
              <Avatar key={m.id} className="size-6 ring-2 ring-card">
                <AvatarFallback className="text-[10px]">
                  {getInitials(m.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {overflow > 0 && (
              <span className="ml-0.5 text-[11px] text-foreground-muted">
                +{overflow}
              </span>
            )}
            {memberCount === 0 && (
              <span className="text-[12px] text-foreground-muted">
                <Users className="size-3 inline mr-0.5 -mt-0.5" />
                No members
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted">
            <Avatar className="size-5">
              <AvatarFallback className="text-[9px]">
                {ownerInitials}
              </AvatarFallback>
            </Avatar>
            <span className="truncate max-w-[80px]">{project.creator?.name}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
