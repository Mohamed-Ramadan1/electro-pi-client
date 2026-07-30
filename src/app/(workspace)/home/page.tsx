"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  TrendingUp,
  FolderKanban,
  ChevronDown,
  ChevronUp,
  StickyNote,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useIsAdmin } from "@/hooks/use-role";
import { useProjects } from "@/hooks/use-projects";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const stats = [
  {
    label: "Active Projects",
    value: "12",
    detail: "+2 this month",
  },
  {
    label: "Tasks Completed",
    value: "148",
    detail: "92% on time",
  },
  {
    label: "In Progress Tasks",
    value: "8",
    detail: "3 due today",
  },
  {
    label: "Todo Tasks",
    value: "14",
    detail: "5 high priority",
  },
];

const tasks = [
  { text: "Finalize authentication flow", done: true, due: "Today" },
  { text: "Review PR #42 — Notifications module", done: false, due: "Today" },
  { text: "Update project documentation", done: false, due: "Tomorrow" },
  { text: "Prepare sprint demo slides", done: false, due: "Wed" },
  { text: "Set up CI/CD pipeline", done: false, due: "Fri" },
];

export default function DashboardHome() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [calendarExpanded, setCalendarExpanded] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { data: projectsData } = useProjects();
  const projects = (projectsData?.projects ?? []).slice(0, 5);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-6 py-10">
      <div
        className={cn(
          "mb-8 rounded-lg border border-border bg-surface px-4 py-3 text-[13px] text-foreground-muted",
        )}
      >
        Preview mode — this is a demo of your workspace. Start building to make
        it yours.
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
            {formattedDate}
          </p>
          <h1 className="mt-3 font-display text-4xl italic text-foreground md:text-5xl">
            Good morning, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-foreground-muted">
            Here&apos;s what&apos;s happening across your projects today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <Sparkles className="size-3.5 text-highlight" />
            Ask Electro-Pi
          </button>
          {isAdmin ? (
            <button
              onClick={() => router.push("/projects?create=true")}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-colors hover:bg-primary"
            >
              <Plus className="size-3.5" />
              New Project
            </button>
          ) : (
            <button
              onClick={() => router.push("/projects")}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-colors hover:bg-primary"
            >
              <FolderKanban className="size-3.5" />
              Explore your projects
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
              {stat.label}
            </p>
            <p className="mt-3 font-display text-3xl italic text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-foreground-muted">
              <TrendingUp className="size-3 text-success" />
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-12 gap-6">
        <section className="col-span-12 rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
                Planning
              </p>
              <h2 className="mt-1 font-display text-2xl italic text-foreground">
                {today.getFullYear()} Calendar
              </h2>
            </div>
            <button
              onClick={() => setCalendarExpanded((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-[13px] font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              {calendarExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
              {calendarExpanded ? "Hide" : "Show"}
            </button>
          </div>
          {calendarExpanded && (
            <div className="mt-4">
              <YearGrid year={today.getFullYear()} today={today} />
            </div>
          )}
        </section>

        <section className="col-span-12 rounded-lg border border-border bg-surface p-6 lg:col-span-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
                Priority
              </p>
              <h2 className="mt-1 font-display text-2xl italic text-foreground">
                Tasks
              </h2>
            </div>
            <span className="font-mono text-[11px] text-foreground-muted">
              1/5
            </span>
          </div>
          <ul className="mt-4 space-y-1">
            {tasks.map((task) => (
              <li
                key={task.text}
                className="group flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/60"
              >
                {task.done ? (
                  <CheckCircle2 className="size-4 text-success shrink-0" />
                ) : (
                  <Circle className="size-4 text-foreground-muted shrink-0 group-hover:text-foreground" />
                )}
                <span
                  className={cn(
                    "flex-1 text-sm",
                    task.done
                      ? "text-foreground-muted line-through"
                      : "text-foreground",
                  )}
                >
                  {task.text}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-muted">
                  {task.due}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-12 rounded-lg border border-border bg-surface p-6 lg:col-span-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
                Recent
              </p>
              <h2 className="mt-1 font-display text-2xl italic text-foreground">
                Projects
              </h2>
            </div>
            <button
              onClick={() => router.push("/projects")}
              className="inline-flex items-center gap-1 text-[12px] text-foreground-muted hover:text-foreground transition-colors"
            >
              View all
              <span className="text-[10px]">&rarr;</span>
            </button>
          </div>
          {projects.length === 0 ? (
            <p className="mt-6 text-center text-[13px] text-foreground-muted">
              No projects yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-1">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FolderKanban className="size-4 shrink-0 text-foreground-muted" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {project.name}
                      </span>
                    </div>
                    <span className="shrink-0 ml-2 text-[10px] text-foreground-muted">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="col-span-12 rounded-lg border border-border bg-surface p-6 lg:col-span-4">
          <NotesSection today={today} />
        </section>
      </div>

      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <ElectroPiChat />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function YearGrid({ year, today }: { year: number; today: Date }) {
  const months = Array.from({ length: 12 }, (_, m) => {
    const name = new Date(year, m, 1).toLocaleDateString("en-US", { month: "short" });
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const firstDow = (new Date(year, m, 1).getDay() + 6) % 7;

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return { name, cells, monthIndex: m };
  });

  const dowLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className="flex flex-wrap gap-6">
      {months.map(({ name, cells, monthIndex }) => (
        <div key={name} className="flex flex-col">
          <p className="text-xs font-medium text-foreground-muted text-center mb-1.5">
            {name}
          </p>
          <div className="grid grid-cols-7 gap-1">
            {dowLabels.map((l) => (
              <div
                key={l}
                className="flex h-6 w-8 items-center justify-center text-[10px] text-foreground-muted/50"
              >
                {l}
              </div>
            ))}
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`e-${i}`} className="h-9 w-9" />;
              }
              const isToday =
                today.getMonth() === monthIndex && today.getDate() === day;
              return (
                <div
                  key={day}
                  title={`${name} ${day}`}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-sm text-[13px]",
                    !isToday && "text-foreground-muted hover:bg-muted",
                    isToday && "bg-foreground text-background font-semibold",
                  )}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface Note {
  id: string;
  text: string;
  date: string;
}

const NOTES_KEY = "today-notes";

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function NotesSection({ today }: { today: Date }) {
  const todayKey = today.toISOString().slice(0, 10);
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"today" | "all">("today");

  const addNote = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const next = [
      { id: crypto.randomUUID(), text, date: todayKey },
      ...notes,
    ];
    setNotes(next);
    saveNotes(next);
    setInput("");
  }, [input, notes, todayKey]);

  const removeNote = useCallback(
    (id: string) => {
      const next = notes.filter((n) => n.id !== id);
      setNotes(next);
      saveNotes(next);
    },
    [notes],
  );

  const filtered = tab === "today" ? notes.filter((n) => n.date === todayKey) : notes;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
            Quick
          </p>
          <h2 className="mt-1 font-display text-2xl italic text-foreground">
            Notes
          </h2>
        </div>
        <div className="flex rounded-md border border-border bg-background p-0.5">
          <button
            onClick={() => setTab("today")}
            className={cn(
              "rounded-sm px-2.5 py-1 text-[11px] font-medium transition-colors",
              tab === "today"
                ? "bg-foreground text-background"
                : "text-foreground-muted hover:text-foreground",
            )}
          >
            Today
          </button>
          <button
            onClick={() => setTab("all")}
            className={cn(
              "rounded-sm px-2.5 py-1 text-[11px] font-medium transition-colors",
              tab === "all"
                ? "bg-foreground text-background"
                : "text-foreground-muted hover:text-foreground",
            )}
          >
            All
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Write a note..."
          className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
        />
        <button
          onClick={addNote}
          disabled={!input.trim()}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-colors hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="size-4" />
        </button>
      </div>
      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-[13px] text-foreground-muted">
          {tab === "today" ? "No notes for today." : "No notes yet."}
        </p>
      ) : (
        <ul className="mt-3 space-y-1 max-h-48 overflow-y-auto">
          {filtered.map((note) => (
            <li
              key={note.id}
              className="group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted/60"
            >
              <StickyNote className="size-3.5 shrink-0 mt-0.5 text-foreground-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-foreground leading-relaxed break-words">
                  {note.text}
                </p>
                {tab === "all" && (
                  <p className="mt-0.5 text-[10px] text-foreground-muted">
                    {note.date}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeNote(note.id)}
                className="shrink-0 mt-0.5 text-foreground-muted/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type ChatMessage = { role: "user" | "assistant"; text: string };

const mockReplies = [
  "I can help with that! What specifically would you like to know about your projects?",
  "Based on your current tasks, I'd recommend prioritizing the authentication flow first — it's due today and blocks other work.",
  "You have 3 projects with approaching deadlines. Would you like me to break down the next steps for each?",
  "Looking at your team's activity, Sarah just finished the API integration. You might want to review her PR next.",
  "I notice you have 5 todo tasks. Want me to suggest an order based on priority and dependencies?",
];

function ElectroPiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hey! I'm Electro-Pi, your AI assistant. I can help you prioritize tasks, analyze project progress, or answer questions about your workspace. What do you need?" },
  ]);
  const [input, setInput] = useState("");
  const [replying, setReplying] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || replying) return;
    const next: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setReplying(true);
    setTimeout(() => {
      const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setReplying(false);
    }, 800 + Math.random() * 700);
  }, [input, messages, replying]);

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="shrink-0">
        <SheetTitle className="font-display text-lg italic flex items-center gap-2">
          <Sparkles className="size-4 text-highlight" />
          Electro-Pi
        </SheetTitle>
        <p className="text-[12px] text-foreground-muted">
          AI assistant &middot; coming soon
        </p>
      </SheetHeader>

      <div className="mx-4 mb-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-[11px] text-foreground-muted">
        This is a preview of the AI assistant. Full integration will be available in a future update.
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 space-y-4 pb-4"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 text-[13px] leading-relaxed",
              msg.role === "user" && "flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                msg.role === "assistant"
                  ? "bg-highlight/10 text-highlight"
                  : "bg-foreground/10 text-foreground",
              )}
            >
              {msg.role === "assistant" ? "AI" : (msg.role === "user" ? "U" : "")}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3.5 py-2.5",
                msg.role === "assistant"
                  ? "bg-muted text-foreground rounded-tl-sm"
                  : "bg-foreground text-background rounded-tr-sm",
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {replying && (
          <div className="flex gap-3 text-[13px]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-highlight/10 text-highlight text-[10px] font-semibold">
              AI
            </div>
            <div className="rounded-xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-foreground-muted">
              <span className="inline-flex gap-0.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground-muted [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground-muted [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground-muted [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything..."
            disabled={replying}
            className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || replying}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-colors hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
