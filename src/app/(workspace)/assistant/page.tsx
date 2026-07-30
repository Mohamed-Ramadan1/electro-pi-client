"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

type ChatMessage = { role: "user" | "assistant"; text: string };

const mockReplies = [
  "I can help with that! What specifically would you like to know about your projects?",
  "Based on your current tasks, I'd recommend prioritizing the authentication flow first — it's due today and blocks other work.",
  "You have 3 projects with approaching deadlines. Would you like me to break down the next steps for each?",
  "Looking at your team's activity, Sarah just finished the API integration. You might want to review her PR next.",
  "I notice you have 5 todo tasks. Want me to suggest an order based on priority and dependencies?",
  "That's a great question. Let me analyze your workspace data to give you a precise answer.",
  "Your team's velocity has increased by 15% this sprint. Keep up the momentum!",
  "I can draft that document for you. Just tell me the key points you want to cover.",
];

export default function AssistantPage() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `Hey ${user?.name?.split(" ")[0] ?? "there"}! I'm Electro-Pi, your AI assistant. I can help you prioritize tasks, analyze project progress, draft documents, or answer questions about your workspace. What do you need?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [replying, setReplying] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || replying) return;
    const next: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setReplying(true);
    setTimeout(() => {
      const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setReplying(false);
    }, 800 + Math.random() * 700);
  }, [input, messages, replying]);

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-highlight/10">
            <Sparkles className="size-5 text-highlight" />
          </div>
          <div>
            <h1 className="font-display text-xl italic text-foreground">
              Electro-Pi Assistant
            </h1>
            <p className="text-[12px] text-foreground-muted">
              AI-powered workspace companion &middot; coming soon
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-[12px] text-foreground-muted">
          This is a preview of the AI assistant. Full integration will be available in a future update.
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
      >
        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              "What are my top priorities today?",
              "Summarize my active projects",
              "Draft a sprint update",
              "Analyze team workload",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion);
                }}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-left text-[13px] text-foreground-muted transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-4",
              msg.role === "user" && "flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold",
                msg.role === "assistant"
                  ? "bg-highlight/10 text-highlight"
                  : "bg-foreground/10 text-foreground",
              )}
            >
              {msg.role === "assistant" ? (
                <Sparkles className="size-4" />
              ) : (
                user?.initials ?? "U"
              )}
            </div>
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-5 py-3.5 text-[14px] leading-relaxed",
                msg.role === "assistant"
                  ? "bg-muted text-foreground rounded-tl-md"
                  : "bg-foreground text-background rounded-tr-md",
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {replying && (
          <div className="flex gap-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-highlight/10 text-highlight">
              <Sparkles className="size-4" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-muted px-5 py-3.5">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-foreground-muted [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-foreground-muted [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-foreground-muted [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything about your workspace..."
              disabled={replying}
              className="h-12 w-full rounded-xl border border-border bg-background pl-5 pr-5 text-[14px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 disabled:opacity-50"
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim() || replying}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-all hover:bg-primary hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
