"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  Settings,
  HelpCircle,
  Users,
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
import { useAuthStore } from "@/stores/auth-store";
import { useIsAdmin } from "@/hooks/use-role";

const workspaceItems: { key: string; href: string; icon: LucideIcon }[] = [
  { key: "overview", href: "/home", icon: LayoutDashboard },
  { key: "projects", href: "/projects", icon: FolderKanban },
  { key: "tasks", href: "/tasks", icon: CheckSquare },
  { key: "notifications", href: "/notifications", icon: Bell },
  { key: "users", href: "/users", icon: Users },
];

const systemItems: { key: string; href: string; icon: LucideIcon }[] = [
  { key: "settings", href: "/settings", icon: Settings },
  { key: "support", href: "/support", icon: HelpCircle },
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
  const { open: collapsed } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={collapsed ? label : undefined}
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
  const { open: collapsed } = useSidebar();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useIsAdmin();

  const visibleWorkspaceItems =
    isAdmin
      ? workspaceItems
      : workspaceItems.filter((item) => item.key !== "users");

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

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
          {!collapsed ? (
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
          {!collapsed ? (
            <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted">
              Workspace
            </SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleWorkspaceItems.map((item) => (
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

        <SidebarGroup>
          {!collapsed ? (
            <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted">
              System
            </SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
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
          {!collapsed ? (
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-[13px] font-medium text-foreground">
                {user?.name ?? "User"}
              </span>
              <span className="truncate text-[11px] text-foreground-muted">
                {user?.email ?? ""}
              </span>
            </div>
          ) : null}
          {!collapsed && (
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
