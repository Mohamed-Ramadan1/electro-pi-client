"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Plus,
  StickyNote,
  Search,
  Pencil,
  Trash2,
  Sparkles,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
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
import { RichTextEditor } from "@/components/workspace/rich-text-editor";
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/use-notes";
import type { NoteDto } from "@/types/api";

const ITEMS_PER_PAGE = 9;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function NotesPage() {
  const { data: notes = [], isLoading, isError, error } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteDto | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase()),
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [notes, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedNotes = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const openCreate = useCallback(() => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((note: NoteDto) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setFile(null);
    setImagePreview(note.imageUrl);
    setDialogOpen(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  const save = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    if (editingNote) {
      updateNote.mutate({
        id: editingNote.id,
        title: trimmedTitle,
        content: content.trim(),
        ...(file !== null && { file }),
      });
    } else {
      createNote.mutate({
        title: trimmedTitle,
        content: content.trim(),
        file,
      });
    }
    setDialogOpen(false);
  }, [title, content, file, editingNote, createNote, updateNote]);

  const remove = useCallback(
    (id: string) => {
      deleteNote.mutate(id);
      setConfirmDelete(null);
    },
    [deleteNote],
  );

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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="size-8 animate-spin text-foreground-muted" />
          <p className="mt-4 text-[13px] text-foreground-muted">
            Loading notes...
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          <h2 className="mt-5 font-display text-xl italic text-foreground">
            Failed to load notes
          </h2>
          <p className="mt-2 max-w-sm text-[13px] text-foreground-muted">
            {(error as Error)?.message || "Something went wrong. Please try again."}
          </p>
        </div>
      ) : (
        <>
          {notes.length > 0 && (
            <div className="relative mt-8">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
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
                  Start capturing ideas, meeting notes, and everything in
                  between.
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
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="group relative flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/20 hover:bg-background"
                    >
                      <h3 className="font-display text-base italic text-foreground pr-8 line-clamp-1">
                        {note.title}
                      </h3>
                      {note.imageUrl && (
                        <div className="mt-3 overflow-hidden rounded-lg border border-border">
                          <img
                            src={note.imageUrl}
                            alt={note.title}
                            className="h-32 w-full object-cover"
                          />
                        </div>
                      )}
                      {note.content && (
                        <p className="mt-2 flex-1 text-[13px] text-foreground-muted leading-relaxed line-clamp-4 whitespace-pre-wrap">
                          {stripHtml(note.content)}
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

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={safePage <= 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="size-3.5" />
                      Previous
                    </Button>
                    <span className="px-3 text-[13px] text-foreground-muted">
                      {safePage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={safePage >= totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl italic">
              {editingNote ? "Edit Note" : "New Note"}
            </DialogTitle>
            <DialogDescription>
              {editingNote
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
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
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
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your note here..."
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
                disabled={!title.trim() || createNote.isPending || updateNote.isPending}
                className="gap-1.5"
              >
                {(createNote.isPending || updateNote.isPending) ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                {editingNote ? "Save changes" : "Create note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => confirmDelete && remove(confirmDelete)}
              disabled={deleteNote.isPending}
              className="gap-1.5"
            >
              {deleteNote.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
