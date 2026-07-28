import { SidebarProvider } from "@/components/ui/sidebar";
import { RequireAuth } from "@/components/auth/require-auth";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <WorkspaceSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <WorkspaceHeader />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </RequireAuth>
  );
}
