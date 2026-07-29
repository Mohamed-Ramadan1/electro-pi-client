"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Mail,
  User,
  Shield,
  Calendar,
  LogOut,
  Check,
  Camera,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const onSubmit = async (data: ProfileValues) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ name: data.name, email: data.email });
    toast.success("Profile updated successfully");
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
          Account
        </p>
        <h1 className="mt-2 font-display text-4xl italic text-foreground">
          Profile
        </h1>
        <p className="mt-3 text-sm text-foreground-muted">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="size-24 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-display text-3xl italic">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <button
              disabled
              className="absolute -bottom-1 -right-1 grid size-8 cursor-not-allowed place-items-center rounded-full border-2 border-background bg-foreground text-background opacity-40"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
            {user.name}
          </h2>
          <p className="mt-1 text-sm text-foreground-muted">{user.email}</p>
          <span className="mt-3 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium text-foreground-muted">
            Member
          </span>
        </div>

        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h3 className="text-sm font-semibold text-foreground">
              Personal Information
            </h3>
            <p className="mt-1 text-[12px] text-foreground-muted">
              Update your display name and email address.
            </p>

            <div className="mt-6 space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-[13px] font-medium text-foreground"
                >
                  Display name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
                  <input
                    id="name"
                    {...register("name")}
                    className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                  />
                </div>
                {errors.name && (
                  <p className="text-[12px] text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-[13px] font-medium text-foreground"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
                  <input
                    id="email"
                    {...register("email")}
                    className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                  />
                </div>
                {errors.email && (
                  <p className="text-[12px] text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button
                type="submit"
                disabled={!isDirty || saving}
                className="gap-1.5"
              >
                <Check className="size-3.5" />
                {saving ? "Saving..." : "Save changes"}
              </Button>
              {isDirty && (
                <button
                  type="button"
                  className="text-[13px] text-foreground-muted transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Account Details
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-info/10">
                  <Shield className="size-4 text-info" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">
                    Account created
                  </p>
                  <p className="text-[12px] text-foreground-muted">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-success/10">
                  <Calendar className="size-4 text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">
                    Plan
                  </p>
                  <p className="text-[12px] text-foreground-muted">
                    Free plan — 5 team members, 3 projects
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Sign out
                </h3>
                <p className="mt-1 text-[12px] text-foreground-muted">
                  You will be redirected to the login page.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="shrink-0 gap-1.5"
              >
                <LogOut className="size-3.5" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
