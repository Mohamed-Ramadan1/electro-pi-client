"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlarmClock,
  Plus,
  Clock,
  CalendarDays,
  Bell,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ComingSoonBanner } from "@/components/workspace/coming-soon-banner";

const reminderSchema = z.object({
  title: z.string().min(2, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

type ReminderValues = z.infer<typeof reminderSchema>;
type Reminder = ReminderValues & { id: string; completed: boolean };

const sampleReminders: Reminder[] = [
  { id: "r1", title: "Submit weekly progress report", date: "2026-08-01", time: "17:00", completed: false },
  { id: "r2", title: "Review open pull requests", date: "2026-08-01", time: "10:00", completed: false },
  { id: "r3", title: "Check server health metrics", date: "2026-08-01", time: "09:00", completed: true },
  { id: "r4", title: "Team standup — Zoom call", date: "2026-08-01", time: "09:30", completed: false },
  { id: "r5", title: "Update project roadmap slides", date: "2026-08-02", time: "14:00", completed: false },
  { id: "r6", title: "Monthly 1:1 with Ahmed", date: "2026-08-05", time: "11:00", completed: false },
  { id: "r7", title: "Dependency audit — npm packages", date: "2026-08-07", time: "16:00", completed: false },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(sampleReminders);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ReminderValues>({
    resolver: zodResolver(reminderSchema),
    mode: "onChange",
  });

  const onCreate = (data: ReminderValues) => {
    setReminders((prev) => [
      { ...data, id: crypto.randomUUID(), completed: false },
      ...prev,
    ]);
    reset();
    setCreateOpen(false);
    toast.success("Reminder created");
  };

  const toggle = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    );
  };

  const remove = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const active = reminders
    .filter((r) => !r.completed)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const done = reminders.filter((r) => r.completed);

  const formatDate = (date: string) => {
    const d = new Date(date + "T00:00:00");
    const today = new Date().toISOString().slice(0, 10);
    if (date === today) return "Today";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date === tomorrow.toISOString().slice(0, 10)) return "Tomorrow";
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <ComingSoonBanner />
      <div className="px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
            Never forget
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-foreground">
            Reminders
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            {active.length} active &middot; {done.length} completed
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Reminder
        </Button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          {active.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <AlarmClock className="size-7 text-foreground-muted" />
              </div>
              <h2 className="mt-4 font-display text-lg italic text-foreground">
                All caught up
              </h2>
              <p className="mt-1 text-[13px] text-foreground-muted">
                No active reminders. Create one to stay on track.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {active.map((r) => {
                const isOverdue = r.date < new Date().toISOString().slice(0, 10);
                return (
                  <div
                    key={r.id}
                    className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-muted/30"
                  >
                    <button onClick={() => toggle(r.id)} className="shrink-0">
                      <Circle className="size-5 text-foreground-muted group-hover:text-foreground transition-colors" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] text-foreground truncate">
                        {r.title}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-[12px]",
                          isOverdue ? "text-destructive" : "text-foreground-muted",
                        )}
                      >
                        {formatDate(r.date)} at {r.time}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(r.id)}
                      className="shrink-0 text-foreground-muted/30 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {done.length > 0 && (
            <div className="mt-8 border-t border-border pt-8">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted mb-3">
                Completed
              </h2>
              <div className="space-y-1">
                {done.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 rounded-lg px-3 py-2.5 opacity-50"
                  >
                    <CheckCircle2 className="size-5 shrink-0 text-success" />
                    <p className="flex-1 text-[14px] text-foreground line-through truncate">
                      {r.title}
                    </p>
                    <span className="shrink-0 text-[12px] text-foreground-muted">
                      {formatDate(r.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-foreground text-background p-5 self-start">
          <Bell className="size-5 text-accent" />
          <p className="mt-4 font-display text-base italic leading-snug">
            &ldquo;Set it and forget it. We&apos;ll remind you at the exact moment you need to act.&rdquo;
          </p>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl italic">
              New Reminder
            </DialogTitle>
            <DialogDescription>
              Pick a date and time, and we&apos;ll notify you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Title
              </label>
              <input
                {...register("title")}
                placeholder="What do you need to remember?"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
              {errors.title && (
                <p className="text-[12px] text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Date
                </label>
                <input
                  type="date"
                  {...register("date")}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                />
                {errors.date && (
                  <p className="text-[12px] text-destructive">{errors.date.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Time
                </label>
                <input
                  type="time"
                  {...register("time")}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                />
                {errors.time && (
                  <p className="text-[12px] text-destructive">{errors.time.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!isValid}>
                Create Reminder
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
