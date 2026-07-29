"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Trash2,
  Ban,
  Loader2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUsers, useCreateUser, useActivateUser, useDeactivateUser, useDeleteUser } from "@/hooks/use-users";
import type { UserDto } from "@/types/api";
import {
  UserRoles,
  STRONG_PASSWORD_REGEX,
  STRONG_PASSWORD_MESSAGE,
} from "@/types/api";

const roleConfig: Record<string, { variant: "default" | "secondary" | "outline" }> = {
  [UserRoles.ADMIN]: { variant: "default" },
  [UserRoles.MEMBER]: { variant: "secondary" },
};

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE),
  roles: z
    .array(z.enum([UserRoles.ADMIN, UserRoles.MEMBER]))
    .min(1, "Select at least one role"),
});

type CreateUserValues = z.infer<typeof createUserSchema>;

const ITEMS_PER_PAGE = 6;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RoleBadge({ role }: { role: string }) {
  const config = roleConfig[role] ?? { variant: "outline" as const };
  return (
    <Badge variant={config.variant} className="text-[11px] font-medium capitalize">
      {role}
    </Badge>
  );
}

function SkeletonRow() {
  return (
    <tr className="bg-background">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-muted animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
            <div className="h-3 w-32 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3.5 sm:table-cell">
        <div className="h-5 w-14 rounded bg-muted animate-pulse" />
      </td>
      <td className="hidden px-4 py-3.5 md:table-cell">
        <div className="h-5 w-16 rounded bg-muted animate-pulse" />
      </td>
      <td className="hidden px-4 py-3.5 lg:table-cell">
        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3.5 text-right">
        <div className="ml-auto h-5 w-8 rounded bg-muted animate-pulse" />
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const { data, isLoading } = useUsers();
  const createUser = useCreateUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const deleteUser = useDeleteUser();

  const users = data?.users ?? [];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { roles: [] },
    mode: "onChange",
  });

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.roles.some((r) => r.toLowerCase().includes(q)),
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const onCreate = (data: CreateUserValues) => {
    createUser.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        roles: data.roles,
      },
      {
        onSuccess: () => {
          reset();
          setCreateOpen(false);
        },
      },
    );
  };

  const toggleActive = (user: UserDto) => {
    if (user.isActive) {
      deactivateUser.mutate(user.id);
    } else {
      activateUser.mutate(user.id);
    }
  };

  const handleDelete = (id: string) => {
    deleteUser.mutate(id);
  };

  return (
    <div className="px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
            Admin
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-foreground">
            Users
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Manage team members, roles, and access.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
          <Plus className="size-3.5" />
          Create User
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-[13px] text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
          />
        </div>
        <span className="text-[12px] text-foreground-muted tabular-nums">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-secondary/50">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">
                  User
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted sm:table-cell">
                  Roles
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted md:table-cell">
                  Status
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted lg:table-cell">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center text-sm text-foreground-muted"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const primaryRole = user.roles[0] ?? "member";
                  return (
                    <tr
                      key={user.id}
                      className="bg-background transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 rounded-lg">
                            <AvatarFallback
                              className={cn(
                                "rounded-lg font-display text-sm font-semibold",
                                user.roles.includes("admin")
                                  ? "bg-primary/15 text-primary"
                                  : primaryRole === "member"
                                    ? "bg-info/15 text-info"
                                    : "bg-muted text-foreground-muted",
                              )}
                            >
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-foreground">
                              {user.name}
                            </p>
                            <p className="truncate text-[12px] text-foreground-muted">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3.5 sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((r) => (
                            <RoleBadge key={r} role={r} />
                          ))}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-[12px] font-medium",
                            user.isActive ? "text-success" : "text-foreground-muted",
                          )}
                        >
                          {user.isActive ? (
                            <CheckCircle2 className="size-3" />
                          ) : (
                            <XCircle className="size-3" />
                          )}
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3.5 text-[12px] text-foreground-muted lg:table-cell">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground-muted hover:text-foreground"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => toggleActive(user)}
                              disabled={activateUser.isPending || deactivateUser.isPending}
                            >
                              {user.isActive ? (
                                <>
                                  <Ban className="size-3.5" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="size-3.5" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteUser.isPending}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border bg-background-secondary/30 px-4 py-3">
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
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl italic">
              Create User
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              Add a new team member to the workspace.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onCreate)} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="create-name"
                className="block text-[13px] font-medium text-foreground"
              >
                Full name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
                <input
                  id="create-name"
                  {...register("name")}
                  placeholder="John Doe"
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-[13px] text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                />
              </div>
              {errors.name && (
                <p className="text-[12px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="create-email"
                className="block text-[13px] font-medium text-foreground"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
                <input
                  id="create-email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-[13px] text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="create-password"
                className="block text-[13px] font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="create-password"
                type="password"
                {...register("password")}
                placeholder="Min. 8 chars, uppercase, lowercase, number & symbol"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
              {errors.password && (
                <p className="text-[12px] text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Roles
              </label>
              <div className="flex items-center gap-4 rounded-lg border border-border bg-background px-4 py-3">
                <label className="flex items-center gap-2.5 text-[13px] text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    value={UserRoles.ADMIN}
                    {...register("roles")}
                    className="size-4 rounded border-border accent-primary cursor-pointer"
                  />
                  Admin
                </label>
                <label className="flex items-center gap-2.5 text-[13px] text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    value={UserRoles.MEMBER}
                    {...register("roles")}
                    className="size-4 rounded border-border accent-primary cursor-pointer"
                  />
                  Member
                </label>
              </div>
              {errors.roles && (
                <p className="text-[12px] text-destructive">{errors.roles.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || createUser.isPending}
                className="gap-1.5"
              >
                {createUser.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Plus className="size-3.5" />
                )}
                {createUser.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
