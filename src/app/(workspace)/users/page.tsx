"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
  Shield,
  CheckCircle2,
  XCircle,
  Trash2,
  UserCog,
  Ban,
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

// ─── Types & Mock Data ────────────────────────────────────────

type Role = "admin" | "member" | "viewer";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}

const roleConfig: Record<Role, { label: string; variant: "default" | "secondary" | "outline" }> = {
  admin: { label: "Admin", variant: "default" },
  member: { label: "Member", variant: "secondary" },
  viewer: { label: "Viewer", variant: "outline" },
};

const initialUsers: UserData[] = [
  { id: "1", name: "Jane Doe", email: "jane@electropi.com", role: "admin", isActive: true, createdAt: new Date("2026-01-15") },
  { id: "2", name: "Alex Chen", email: "alex@electropi.com", role: "member", isActive: true, createdAt: new Date("2026-02-20") },
  { id: "3", name: "Sarah Kim", email: "sarah@electropi.com", role: "member", isActive: true, createdAt: new Date("2026-03-10") },
  { id: "4", name: "Marcus Webb", email: "marcus@electropi.com", role: "viewer", isActive: false, createdAt: new Date("2026-03-22") },
  { id: "5", name: "Emily Park", email: "emily@electropi.com", role: "member", isActive: true, createdAt: new Date("2026-04-05") },
  { id: "6", name: "David Silva", email: "david@electropi.com", role: "member", isActive: true, createdAt: new Date("2026-04-18") },
  { id: "7", name: "Aisha Patel", email: "aisha@electropi.com", role: "viewer", isActive: true, createdAt: new Date("2026-05-01") },
  { id: "8", name: "Tom Berger", email: "tom@electropi.com", role: "member", isActive: false, createdAt: new Date("2026-05-14") },
  { id: "9", name: "Nina Kovac", email: "nina@electropi.com", role: "admin", isActive: true, createdAt: new Date("2026-06-02") },
  { id: "10", name: "Omar Hassan", email: "omar@electropi.com", role: "member", isActive: true, createdAt: new Date("2026-06-19") },
  { id: "11", name: "Lucy Zhang", email: "lucy@electropi.com", role: "viewer", isActive: true, createdAt: new Date("2026-07-03") },
  { id: "12", name: "Ravi Mehta", email: "ravi@electropi.com", role: "member", isActive: true, createdAt: new Date("2026-07-10") },
];

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["admin", "member", "viewer"]),
  isActive: z.boolean(),
});

type CreateUserValues = z.infer<typeof createUserSchema>;

const ITEMS_PER_PAGE = 6;

let nextId = 100;

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "member", isActive: true },
  });

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const onCreate = async (data: CreateUserValues) => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 600));
    const newUser: UserData = {
      id: String(nextId++),
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
      createdAt: new Date(),
    };
    setUsers((prev) => [newUser, ...prev]);
    toast.success("User created successfully");
    reset();
    setCreateOpen(false);
    setCreating(false);
  };

  const toggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
    );
    toast.success("User status updated");
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User removed");
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

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
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-1.5"
        >
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
                  Role
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
              {paginatedUsers.map((user) => (
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
                            user.role === "admin"
                              ? "bg-primary/15 text-primary"
                              : user.role === "member"
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
                    <Badge variant={roleConfig[user.role].variant} className="text-[11px] font-medium">
                      {roleConfig[user.role].label}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => toggleActive(user.id)}>
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
                        <DropdownMenuItem disabled>
                          <UserCog className="size-3.5" />
                          Change role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteUser(user.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center text-sm text-foreground-muted"
                  >
                    No users found.
                  </td>
                </tr>
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

      {/* ─── Create User Dialog ──────────────────────────── */}
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
                htmlFor="create-role"
                className="block text-[13px] font-medium text-foreground"
              >
                Role
              </label>
              <div className="relative">
                <Shield className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
                <select
                  id="create-role"
                  {...register("role")}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-[13px] text-foreground shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
              <input
                type="checkbox"
                {...register("isActive")}
                className="size-4 rounded border-border accent-primary"
              />
              <span className="text-[13px] text-foreground">Active account</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating} className="gap-1.5">
                <Plus className="size-3.5" />
                {creating ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
