import type { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-border bg-surface">
          <Icon className="size-7 text-foreground-muted" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
