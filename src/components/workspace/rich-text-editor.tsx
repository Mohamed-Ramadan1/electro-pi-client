"use client";

import { useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface Tool {
  icon: typeof Bold;
  label: string;
  command: string;
  value?: string;
}

const tools: Tool[] = [
  { icon: Bold, label: "Bold", command: "bold" },
  { icon: Italic, label: "Italic", command: "italic" },
  { icon: Underline, label: "Underline", command: "underline" },
  { icon: List, label: "Bullet list", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "Numbered list", command: "insertOrderedList" },
  { icon: Heading1, label: "Heading 1", command: "formatBlock", value: "H1" },
  { icon: Heading2, label: "Heading 2", command: "formatBlock", value: "H2" },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);

  const emit = useCallback(() => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || isFocused.current) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const exec = useCallback(
    (command: string, valueArg?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, valueArg);
      emit();
    },
    [emit],
  );

  const handleInput = useCallback(() => {
    emit();
  }, [emit]);

  return (
    <div className="rounded-lg border border-border bg-background shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(tool.command, tool.value);
            }}
            className={cn(
              "grid size-8 place-items-center rounded-md text-foreground-muted transition-colors hover:bg-muted hover:text-foreground",
            )}
          >
            <tool.icon className="size-4" />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => {
          isFocused.current = true;
        }}
        onBlur={() => {
          isFocused.current = false;
          emit();
        }}
        className="min-h-[200px] px-4 py-3 text-[14px] text-foreground leading-relaxed outline-none empty:before:text-foreground/40 empty:before:content-[attr(data-placeholder)]"
        data-placeholder={placeholder}
      />
    </div>
  );
}
