"use client";

import { StickyNote } from "lucide-react";

export default function NotesPage() {
  return (
    <div className="flex h-full items-center justify-center px-6 py-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <StickyNote className="size-8 text-foreground-muted" />
        </div>
        <h1 className="mt-6 font-display text-2xl italic text-foreground">
          Notes
        </h1>
        <p className="mt-2 max-w-sm text-[13px] text-foreground-muted">
          Capture ideas, meeting notes, and everything in between. Coming soon.
        </p>
      </div>
    </div>
  );
}
