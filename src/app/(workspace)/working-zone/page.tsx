"use client";

import { Wrench } from "lucide-react";
import { ComingSoonBanner } from "@/components/workspace/coming-soon-banner";

export default function WorkingZonePage() {
  return (
    <div>
      <ComingSoonBanner />
      <div className="flex h-full items-center justify-center px-6 py-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <Wrench className="size-8 text-foreground-muted" />
        </div>
        <h1 className="mt-6 font-display text-2xl italic text-foreground">
          Working Zone
        </h1>
        <p className="mt-2 max-w-sm text-[13px] text-foreground-muted">
          Your dedicated space to focus, build, and collaborate. Coming soon.
        </p>
      </div>
    </div>
    </div>
  );
}
