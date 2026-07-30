"use client";

import { Users, UserPlus, ArrowRight, Zap, GitBranch, Blocks } from "lucide-react";
import { cn } from "@/lib/utils";

const teamConcepts = [
  {
    icon: GitBranch,
    title: "Split by capability",
    body: "Create frontend, backend, and design teams. Tasks flow automatically to the right people based on team skills.",
  },
  {
    icon: Blocks,
    title: "Parallel execution",
    body: "Multiple teams work simultaneously on different parts of the same project. No bottlenecks, no blockers.",
  },
  {
    icon: Zap,
    title: "Working Zone sync",
    body: "Each team gets their own focus space in the Working Zone with real-time task handoff between teams.",
  },
];

const mockTeams = [
  { name: "Frontend", members: 3, tasks: 8, color: "bg-blue-500/10 text-blue-500" },
  { name: "Backend", members: 4, tasks: 12, color: "bg-emerald-500/10 text-emerald-500" },
  { name: "Design", members: 2, tasks: 5, color: "bg-purple-500/10 text-purple-500" },
];

export default function TeamsPage() {
  return (
    <div className="px-6 py-10">
      <div className="border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
          Collaboration
        </p>
        <h1 className="mt-2 font-display text-4xl italic text-foreground">
          Teams
        </h1>
        <p className="mt-3 max-w-xl text-sm text-foreground-muted">
          Divide your workforce into focused teams. Assign tasks per team, track progress independently, and collaborate through the Working Zone.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-highlight/10">
                <Users className="size-4 text-highlight" />
              </div>
              <div>
                <h2 className="font-display text-lg italic text-foreground">
                  How it works
                </h2>
                <p className="text-[12px] text-foreground-muted">
                  Teams bring structure to how work is distributed and executed.
                </p>
              </div>
            </div>

            <div className="mt-6 relative">
              <div className="absolute left-[19px] top-10 bottom-6 w-px bg-border hidden sm:block" />
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Create teams",
                    desc: "Form teams by grouping members — Frontend, Backend, QA, Design. Each team has a lead and members.",
                  },
                  {
                    step: "02",
                    title: "Assign to projects",
                    desc: "When creating tasks, choose which team owns them. Teams see only their assigned work.",
                  },
                  {
                    step: "03",
                    title: "Work in the Zone",
                    desc: "Teams jump into the Working Zone to collaborate in real-time. Hand off tasks between teams when dependencies are met.",
                  },
                  {
                    step: "04",
                    title: "Track independently",
                    desc: "Each team has their own velocity, burndown, and metrics. Leads manage their team's workload separately.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface font-mono text-[11px] font-bold text-foreground-muted">
                      {item.step}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-foreground-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg italic text-foreground">
              Core capabilities
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {teamConcepts.map((c) => (
                <div
                  key={c.title}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <c.icon className="size-4 text-foreground-muted" />
                  </div>
                  <h3 className="mt-3 text-[13px] font-semibold text-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-foreground-muted leading-relaxed">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Team preview
              </h3>
              <span className="text-[11px] text-foreground-muted">Coming soon</span>
            </div>
            <div className="mt-4 space-y-3">
              {mockTeams.map((team) => (
                <div
                  key={team.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg text-[10px] font-bold",
                        team.color,
                      )}
                    >
                      {team.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">
                        {team.name}
                      </p>
                      <p className="text-[11px] text-foreground-muted">
                        {team.members} members &middot; {team.tasks} tasks
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-foreground-muted" />
                </div>
              ))}
            </div>
            <button
              disabled
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2.5 text-[13px] font-medium text-foreground-muted cursor-not-allowed"
            >
              <UserPlus className="size-4" />
              Create team
            </button>
          </div>

          <div className="rounded-xl border border-border bg-foreground text-background p-5">
            <Blocks className="size-5 text-accent" />
            <p className="mt-4 font-display text-lg italic leading-snug">
              &ldquo;Teams turn a group of individuals into a coordinated machine. Each team owns their domain, and the Working Zone is where they connect.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
