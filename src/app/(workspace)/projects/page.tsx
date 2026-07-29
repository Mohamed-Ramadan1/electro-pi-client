import { FolderKanban } from "lucide-react";
import { PlaceholderPage } from "@/components/workspace/placeholder-page";

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      icon={FolderKanban}
      title="Projects"
      description="Organize work into projects with boards, timelines, and milestones. This feature will be available soon."
    />
  );
}
