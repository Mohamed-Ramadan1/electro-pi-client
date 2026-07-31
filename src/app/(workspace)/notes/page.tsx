"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  StickyNote,
  Search,
  Pencil,
  Trash2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Note {
  id: string;
  title: string;
  body: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

const NOTES_KEY = "user-notes";

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* empty */
  }

  const samples: Note[] = [
    {
      id: "sample-1",
      title: "Sprint Retrospective — Key Takeaways",
      body: "What went well:\n- API integration completed ahead of schedule\n- Team communication improved with daily async standups\n\nWhat to improve:\n- PR review turnaround time still averaging 6 hours\n- More test coverage needed on auth module\n\nAction items:\n- Set up automated PR assignment by next sprint\n- Schedule pair programming session for junior devs",
      image: null,
      createdAt: "2026-07-28T10:00:00.000Z",
      updatedAt: "2026-07-28T14:30:00.000Z",
    },
    {
      id: "sample-2",
      title: "Design System Color Tokens Reference",
      body: "Primary: #0F172A (slate-900)\nSecondary: #3B82F6 (blue-500)\nAccent: #10B981 (emerald-500)\n\nSurface backgrounds:\n- Card: var(--color-surface)\n- Input: var(--color-background)\n\nDark mode variants use CSS custom properties. All components should reference tokens, never hardcoded hex values.",
      image: null,
      createdAt: "2026-07-25T09:15:00.000Z",
      updatedAt: "2026-07-27T11:00:00.000Z",
    },
    {
      id: "sample-3",
      title: "Meeting — Client Demo Prep",
      body: "Demo flow:\n1. Dashboard overview with real-time stats\n2. Project management walkthrough\n3. Show the new AI assistant chat\n4. Q&A\n\nTechnical checklist:\n- Seed demo data for 3 projects\n- Ensure notifications panel is populated\n- Test all role-based views (admin vs member)\n- Prepare fallback if API is slow",
      image: null,
      createdAt: "2026-07-30T08:00:00.000Z",
      updatedAt: "2026-07-30T08:00:00.000Z",
    },
    {
      id: "sample-4",
      title: "Architecture Decision — Real-time Layer",
      body: "Decision: Use Socket.io for real-time features (notifications, messages, working zone).\n\nRationale:\n- Well-established library with fallback support\n- Room-based broadcasting fits our team/project model\n- Works with our existing Node.js backend\n\nAlternatives considered:\n- SSE (simpler but one-directional)\n- WebSocket raw (more boilerplate)\n\nNext steps: Spike a proof-of-concept with the messages page.",
      image: null,
      createdAt: "2026-07-22T13:00:00.000Z",
      updatedAt: "2026-07-29T16:45:00.000Z",
    },
    {
      id: "sample-5",
      title: "Onboarding Notes — New Team Members",
      body: "Setup checklist:\n1. Create account and verify email\n2. Join workspace via invite link\n3. Set up profile with photo\n4. Watch the 5-min workspace tour video\n5. Complete the \"Your First Task\" tutorial\n\nAccess levels to grant:\n- Default: member (can view projects, tasks, messages)\n- After 2 weeks: add to relevant teams\n- Admin: only for team leads",
      image: null,
      createdAt: "2026-07-18T10:30:00.000Z",
      updatedAt: "2026-07-31T09:00:00.000Z",
    },
    {
      id: "sample-6",
      title: "Q3 Goals & Milestones",
      body: "July:\n✓ Launch MVP with core workspace features\n✓ Implement role-based access control\n\nAugust:\n→ Add real-time messaging and notifications\n→ Integrate AI assistant with project data\n→ Ship the Working Zone for team collaboration\n\nSeptember:\n→ Enterprise features (SSO, audit logs)\n→ Performance optimization sprint\n→ Public API for third-party integrations",
      image: null,
      createdAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-15T12:00:00.000Z",
    },
  ];

  saveNotes(samples);
  return samples;
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase()),
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  const openCreate = useCallback(() => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setImage(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setImage(note.image);
    setDialogOpen(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const now = new Date().toISOString();
    if (editingId) {
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === editingId
            ? { ...n, title: trimmedTitle, body: body.trim(), image, updatedAt: now }
            : n,
        );
        saveNotes(next);
        return next;
      });
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        body: body.trim(),
        image,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => {
        const next = [newNote, ...prev];
        saveNotes(next);
        return next;
      });
    }
    setDialogOpen(false);
  }, [title, body, image, editingId]);

  const remove = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      saveNotes(next);
      return next;
    });
    setConfirmDelete(null);
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
            Capture
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-foreground">
            Notes
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Note
        </Button>
      </div>

      {notes.length > 0 && (
        <div className="relative mt-8">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="h-10 w-full max-w-sm rounded-lg border border-border bg-background pl-10 pr-4 text-[13px] text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
          />
        </div>
      )}

      <div className="mt-6">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
              <StickyNote className="size-8 text-foreground-muted" />
            </div>
            <h2 className="mt-5 font-display text-xl italic text-foreground">
              No notes yet
            </h2>
            <p className="mt-2 max-w-sm text-[13px] text-foreground-muted">
              Start capturing ideas, meeting notes, and everything in between.
            </p>
            <Button onClick={openCreate} className="mt-5 gap-1.5" size="sm">
              <Plus className="size-3.5" />
              Create your first note
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-[13px] text-foreground-muted">
            No notes match your search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note) => (
              <div
                key={note.id}
                className="group relative flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/20 hover:bg-background"
              >
                <h3 className="font-display text-base italic text-foreground pr-8 line-clamp-1">
                  {note.title}
                </h3>
                {note.image && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-border">
                    <img
                      src={note.image}
                      alt={note.title}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                )}
                {note.body && (
                  <p className="mt-2 flex-1 text-[13px] text-foreground-muted leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {note.body}
                  </p>
                )}
                <p className="mt-4 text-[10px] text-foreground-muted/60">
                  {formatDate(note.updatedAt)}
                </p>
                <div className="absolute right-3 top-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(note)}
                    className="grid size-7 place-items-center rounded-md text-foreground-muted hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(note.id)}
                    className="grid size-7 place-items-center rounded-md text-foreground-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl italic">
              {editingId ? "Edit Note" : "New Note"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update your note."
                : "Capture an idea, meeting note, or anything worth remembering."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your note a title"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Image
              </label>
              {image ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src={image}
                    alt="Preview"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:bg-background transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/30 hover:bg-muted/50">
                  <Upload className="size-5 text-foreground-muted" />
                  <span className="text-[12px] text-foreground-muted">
                    Upload an image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-foreground">
                Content
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Write your note here..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={save}
                size="sm"
                disabled={!title.trim()}
                className="gap-1.5"
              >
                <Sparkles className="size-3.5" />
                {editingId ? "Save changes" : "Create note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg italic">
              Delete note?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => confirmDelete && remove(confirmDelete)}
              className="gap-1.5"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
