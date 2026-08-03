"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Users,
  Plus,
  ArrowRight,
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

const eventSchema = z.object({
  title: z.string().min(2, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().optional(),
  type: z.enum(["meeting", "deadline", "workshop", "other"]),
});

type EventValues = z.infer<typeof eventSchema>;
type Event = EventValues & { id: string };

const mockEvents: Event[] = [
  { id: "1", title: "Sprint Planning", date: "2026-08-03", time: "10:00", location: "Conference Room A", type: "meeting" },
  { id: "2", title: "Design Review — Dashboard v2", date: "2026-08-03", time: "14:00", location: "Google Meet", type: "meeting" },
  { id: "3", title: "API Integration Deadline", date: "2026-08-05", time: "18:00", type: "deadline" },
  { id: "4", title: "Testing Best Practices Workshop", date: "2026-08-07", time: "11:00", location: "Training Room B", type: "workshop" },
  { id: "5", title: "Client Demo — Q3 Deliverables", date: "2026-08-10", time: "15:00", location: "Zoom", type: "meeting" },
  { id: "6", title: "Backend Architecture Sync", date: "2026-08-12", time: "09:30", type: "meeting" },
  { id: "7", title: "Deployment Freeze Begins", date: "2026-08-14", time: "00:00", type: "deadline" },
  { id: "8", title: "Design System Workshop", date: "2026-08-15", time: "13:00", location: "Design Lab", type: "workshop" },
  { id: "9", title: "Q3 Retrospective", date: "2026-08-18", time: "16:00", location: "Main Hall", type: "meeting" },
];

const typeStyle: Record<string, { icon: typeof Video; border: string; dot: string; label: string }> = {
  meeting: { icon: Video, border: "border-l-blue-500", dot: "bg-blue-500", label: "Meeting" },
  deadline: { icon: Clock, border: "border-l-red-500", dot: "bg-red-500", label: "Deadline" },
  workshop: { icon: Users, border: "border-l-purple-500", dot: "bg-purple-500", label: "Workshop" },
  other: { icon: CalendarDays, border: "border-l-border", dot: "bg-foreground-muted", label: "Other" },
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EventValues>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
  });

  const onCreate = (data: EventValues) => {
    const newEvent: Event = { ...data, id: crypto.randomUUID() };
    setEvents((prev) =>
      [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    );
    reset();
    setCreateOpen(false);
    toast.success("Event created");
  };

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const todayEvents = events.filter((e) => e.date === todayStr);
  const upcomingEvents = events.filter((e) => e.date > todayStr);
  const pastEvents = events.filter((e) => e.date < todayStr).reverse();

  const nextEvent = upcomingEvents[0] ?? null;

  return (
    <div>
      <ComingSoonBanner />
      <div className="px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
            Schedule
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-foreground">
            Events
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            {events.length} events &middot; {todayEvents.length} today &middot; {upcomingEvents.length} upcoming
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Event
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          {nextEvent && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground-muted">
                Next up
              </p>
              <div className="mt-3 flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
                  <span className="font-display text-2xl italic">
                    {new Date(nextEvent.date + "T00:00:00").getDate()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-xl italic text-foreground">
                    {nextEvent.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-3 text-[13px] text-foreground-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {new Date(nextEvent.date + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at {nextEvent.time}
                    </span>
                  </p>
                  {nextEvent.location && (
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-foreground-muted">
                      <MapPin className="size-3.5" />
                      {nextEvent.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {todayEvents.length > 0 && (
            <section>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted mb-4">
                Today
              </h2>
              <div className="space-y-2">
                {todayEvents.map((event) => {
                  const style = typeStyle[event.type] ?? typeStyle.other;
                  const Icon = style.icon;
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "flex items-start gap-4 rounded-lg border border-border border-l-2 bg-surface p-4 transition-colors hover:bg-muted/30",
                        style.border,
                      )}
                    >
                      <div className={cn("mt-0.5 size-2 shrink-0 rounded-full", style.dot)} />
                      <Icon className="size-4 shrink-0 mt-0.5 text-foreground-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-medium text-foreground">{event.title}</p>
                        <p className="mt-0.5 text-[12px] text-foreground-muted">
                          {event.time}
                          {event.location && <> &middot; {event.location}</>}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md border border-border px-2 py-0.5 text-[10px] text-foreground-muted">
                        {style.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted mb-4">
              Upcoming
            </h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-[13px] text-foreground-muted">No upcoming events.</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map((event) => {
                  const style = typeStyle[event.type] ?? typeStyle.other;
                  const Icon = style.icon;
                  const dateObj = new Date(event.date + "T00:00:00");
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "flex items-center gap-4 rounded-lg border border-border border-l-2 bg-surface p-4 transition-colors hover:bg-muted/30",
                        style.border,
                      )}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold text-foreground-muted">
                        {dateObj.getDate()}
                      </span>
                      <Icon className="size-4 shrink-0 text-foreground-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-medium text-foreground">{event.title}</p>
                        <p className="mt-0.5 text-[12px] text-foreground-muted">
                          {dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}{" "}
                          &middot; {event.time}
                          {event.location && <> &middot; {event.location}</>}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md border border-border px-2 py-0.5 text-[10px] text-foreground-muted">
                        {style.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {pastEvents.length > 0 && (
            <section>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted mb-4">
                Past
              </h2>
              <div className="space-y-2">
                {pastEvents.slice(0, 5).map((event) => {
                  const style = typeStyle[event.type] ?? typeStyle.other;
                  const Icon = style.icon;
                  const dateObj = new Date(event.date + "T00:00:00");
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-surface/50 p-3 opacity-60 transition-opacity hover:opacity-80"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-bold text-foreground-muted">
                        {dateObj.getDate()}
                      </span>
                      <Icon className="size-3.5 shrink-0 text-foreground-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-foreground">{event.title}</p>
                        <p className="text-[11px] text-foreground-muted">
                          {dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                          &middot; {event.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-foreground">Quick stats</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="font-display text-2xl italic text-foreground">{todayEvents.length}</p>
                <p className="mt-1 text-[11px] text-foreground-muted">Today</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="font-display text-2xl italic text-foreground">{upcomingEvents.length}</p>
                <p className="mt-1 text-[11px] text-foreground-muted">Upcoming</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="font-display text-2xl italic text-foreground">
                  {events.filter((e) => e.type === "meeting").length}
                </p>
                <p className="mt-1 text-[11px] text-foreground-muted">Meetings</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="font-display text-2xl italic text-foreground">
                  {events.filter((e) => e.type === "deadline").length}
                </p>
                <p className="mt-1 text-[11px] text-foreground-muted">Deadlines</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-foreground text-background p-5">
            <CalendarDays className="size-5 text-accent" />
            <p className="mt-4 font-display text-base italic leading-snug">
              &ldquo;Great teams don&apos;t just have meetings — they have structured events that drive momentum.&rdquo;
            </p>
          </div>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl italic">New Event</DialogTitle>
            <DialogDescription>Schedule a meeting, deadline, or workshop.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">Title</label>
              <input
                {...register("title")}
                placeholder="Sprint planning"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
              {errors.title && <p className="text-[12px] text-destructive">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">Date</label>
                <input
                  type="date"
                  {...register("date")}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                />
                {errors.date && <p className="text-[12px] text-destructive">{errors.date.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">Time</label>
                <input
                  type="time"
                  {...register("time")}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                />
                {errors.time && <p className="text-[12px] text-destructive">{errors.time.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">Location</label>
              <input
                {...register("location")}
                placeholder="Conference room or video link"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">Type</label>
              <div className="flex gap-2">
                {["meeting", "deadline", "workshop", "other"].map((t) => (
                  <label
                    key={t}
                    className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-foreground-muted capitalize transition-colors hover:border-primary/30 has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary"
                  >
                    <input type="radio" value={t} {...register("type")} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
              {errors.type && <p className="text-[12px] text-destructive">{errors.type.message}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!isValid}>
                Create Event
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
