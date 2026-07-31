"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  User,
  Users,
  UserCog,
  Wrench,
  StickyNote,
  Sparkles,
  LifeBuoy,
  Bell,
  MessageSquare,
  CalendarDays,
  AlarmClock,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { useIsAdmin } from "@/hooks/use-role";

const mainItems: { key: string; href: string; icon: LucideIcon }[] = [
  { key: "overview", href: "/home", icon: LayoutDashboard },
  { key: "projects", href: "/projects", icon: FolderKanban },
  { key: "tasks", href: "/tasks", icon: CheckSquare },
  { key: "working-zone", href: "/working-zone", icon: Wrench },
  { key: "events", href: "/events", icon: CalendarDays },
];

const userItems: { key: string; href: string; icon: LucideIcon; adminOnly?: boolean }[] = [
  { key: "reminders", href: "/reminders", icon: AlarmClock },
  { key: "assistant", href: "/assistant", icon: Sparkles },
  { key: "teams", href: "/teams", icon: Users },
  { key: "notes", href: "/notes", icon: StickyNote },
  { key: "messages", href: "/messages", icon: MessageSquare },
  { key: "notifications", href: "/notifications", icon: Bell },
  { key: "profile", href: "/profile", icon: User },
  { key: "support", href: "/support", icon: LifeBuoy },
  { key: "users", href: "/users", icon: UserCog, adminOnly: true },
];

function SidebarNavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}) {
  const { open: expanded } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={!expanded ? label : undefined}
        render={
          <Link href={href} className="flex items-center gap-3 text-[13px]" />
        }
      >
        <Icon className="size-4" />
        <span className="capitalize">{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open: expanded } = useSidebar();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useIsAdmin();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const visibleUserItems = userItems.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  const isCurrentPath = (href: string) => {
    if (href === "/home") return pathname === "/home";
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <Link href="/home" className="flex items-center gap-2 px-2 py-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <span className="font-display text-sm font-bold leading-none">
              E
            </span>
          </span>
          {expanded ? (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[13px] font-semibold tracking-tight text-foreground">
                Electro-Pi
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted">
                Workspace
              </span>
            </div>
          ) : null}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {expanded ? (
            <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted">
              Main
            </SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarNavItem
                  key={item.key}
                  href={item.href}
                  icon={item.icon}
                  label={item.key}
                  isActive={isCurrentPath(item.href)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {expanded && <Separator className="mx-3" />}

        <SidebarGroup>
          {expanded ? (
            <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted">
              You
            </SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleUserItems.map((item) => (
                <SidebarNavItem
                  key={item.key}
                  href={item.href}
                  icon={item.icon}
                  label={item.key}
                  isActive={isCurrentPath(item.href)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-8 rounded-md">
            <AvatarFallback className="rounded-md bg-primary/15 text-primary font-display text-sm italic">
              {user?.initials ?? "??"}
            </AvatarFallback>
          </Avatar>
          {expanded ? (
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-[13px] font-medium text-foreground">
                {user?.name ?? "User"}
              </span>
              <span className="truncate text-[11px] text-foreground-muted">
                {user?.email ?? ""}
              </span>
            </div>
          ) : null}
          {expanded && (
            <button
              onClick={handleLogout}
              className="ml-auto shrink-0 rounded-md p-1 text-foreground-muted transition-colors hover:text-destructive"
              title="Sign out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
