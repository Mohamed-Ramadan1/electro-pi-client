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
  AtSign,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ComingSoonBanner } from "@/components/workspace/coming-soon-banner";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
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
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const onSubmit = async (data: ProfileValues) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ name: data.name });
    toast.success("Profile updated successfully");
    reset({ name: data.name });
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) return null;

  const memberSince = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <ComingSoonBanner />
      <div className="px-6 py-10">
      <div className="border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
          Account
        </p>
        <h1 className="mt-2 font-display text-4xl italic text-foreground">
          Profile
        </h1>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col rounded-xl border border-border bg-surface overflow-hidden">
          <div className="flex flex-col items-center px-8 pb-6 pt-10">
            <div className="relative">
              <div className="size-24 rounded-full bg-gradient-to-br from-primary/30 via-highlight/20 to-primary/10 p-[3px]">
                <div className="flex size-full items-center justify-center rounded-full bg-surface">
                  <span className="font-display text-3xl italic text-foreground">
                    {user.initials}
                  </span>
                </div>
              </div>
              <button
                disabled
                className="absolute -bottom-0.5 -right-0.5 flex size-7 cursor-not-allowed items-center justify-center rounded-full border-2 border-surface bg-foreground text-background opacity-25"
              >
                <Camera className="size-3" />
              </button>
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold text-foreground">
              {user.name}
            </h2>
            <span
              className="mt-1.5 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            >
              {user.roles.includes("admin") ? "Administrator" : "Member"}
            </span>
          </div>

          <div className="border-t border-border bg-muted/30 px-6 py-5 space-y-4">
            <div className="flex items-center gap-3">
              <AtSign className="size-4 shrink-0 text-foreground-muted" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-foreground-muted/60">
                  Email
                </p>
                <p className="text-[13px] text-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="size-4 shrink-0 text-foreground-muted" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-foreground-muted/60">
                  Member since
                </p>
                <p className="text-[13px] text-foreground">{memberSince}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="size-4 shrink-0 text-foreground-muted" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-foreground-muted/60">
                  Plan
                </p>
                <p className="text-[13px] text-foreground">
                  Free &mdash; 5 members, 3 projects
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h3 className="text-sm font-semibold text-foreground">
              Display name
            </h3>
            <p className="mt-1 text-[12px] text-foreground-muted">
              This is the name others will see across the workspace.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative flex-1">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
                <input
                  id="name"
                  {...register("name")}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-[13px] text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                />
              </div>
              <Button
                type="submit"
                disabled={!isDirty || saving}
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <Check className="size-3.5" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
            {errors.name && (
              <p className="mt-1.5 text-[12px] text-destructive">
                {errors.name.message}
              </p>
            )}
          </form>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                <Mail className="size-4 text-foreground-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-foreground">
                  Email address
                </p>
                <p className="text-[12px] text-foreground-muted truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Sign out
                </h3>
                <p className="mt-0.5 text-[12px] text-foreground-muted">
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
    </div>
  );
}
