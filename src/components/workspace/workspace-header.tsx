"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export function WorkspaceHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-foreground-muted hover:text-foreground" />
      <div className="hidden h-5 w-px bg-border md:block" />

      <div className="hidden items-center gap-2 text-[12px] text-foreground-muted md:flex">
        <span className="font-mono uppercase tracking-[0.2em]">
          Electro-Pi
        </span>
        <span>/</span>
        <span className="text-foreground">Workspace</span>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <Link
          href="/profile"
          className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary"
        >
          <span className="font-display text-sm italic font-bold">
            {user?.initials ?? "??"}
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="text-foreground-muted hover:text-destructive"
          onClick={handleLogout}
          title="Sign out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </Button>
      </div>
    </header>
  );
}
