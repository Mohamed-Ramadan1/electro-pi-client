"use client";

import { useState } from "react";
import { MessageSquare, Send, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Conversation = {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type ChatMessage = {
  id: string;
  sender: string;
  initials: string;
  text: string;
  time: string;
  isMe: boolean;
};

const conversations: Conversation[] = [
  { id: "1", name: "Sarah Chen", initials: "SC", lastMessage: "Can we review the Figma files before standup?", time: "2m", unread: 3, online: true },
  { id: "2", name: "Ahmed Hassan", initials: "AH", lastMessage: "Deployment pipeline is green now", time: "15m", unread: 0, online: true },
  { id: "3", name: "Mohamed Ali", initials: "MA", lastMessage: "I fixed the auth redirect issue", time: "1h", unread: 1, online: false },
  { id: "4", name: "Frontend Team", initials: "FT", lastMessage: "Ahmed: Sprint review slides are ready", time: "2h", unread: 5, online: true },
  { id: "5", name: "Backend Team", initials: "BT", lastMessage: "Maria: API rate limiting is deployed", time: "3h", unread: 0, online: false },
  { id: "6", name: "Nour Ibrahim", initials: "NI", lastMessage: "Can you take a look at PR #67?", time: "Yesterday", unread: 0, online: false },
];

const mockChat: ChatMessage[] = [
  { id: "m1", sender: "Sarah Chen", initials: "SC", text: "Hey! I just pushed the new dashboard layout. Can you take a look?", time: "10:02", isMe: false },
  { id: "m2", sender: "You", initials: "ME", text: "Sure, I'll review it now. Which branch?", time: "10:03", isMe: true },
  { id: "m3", sender: "Sarah Chen", initials: "SC", text: "feature/dashboard-v2 — I refactored the sidebar and header components to match the new design system.", time: "10:04", isMe: false },
  { id: "m4", sender: "Sarah Chen", initials: "SC", text: "Also added dark mode support for all the chart components. Used CSS variables so it's theme-aware.", time: "10:04", isMe: false },
  { id: "m5", sender: "You", initials: "ME", text: "Nice! That's exactly what we needed. I'll check the responsive breakpoints too.", time: "10:06", isMe: true },
  { id: "m6", sender: "Sarah Chen", initials: "SC", text: "Perfect. I also added skeleton loading states for the stats cards — no more layout shift.", time: "10:07", isMe: false },
  { id: "m7", sender: "You", initials: "ME", text: "Amazing work Sarah! The sidebar collapse animation is super smooth. Approved.", time: "10:10", isMe: true },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? null);
  const [input, setInput] = useState("");

  const selected = conversations.find((c) => c.id === selectedId);

  const send = () => {
    if (!input.trim()) return;
    setInput("");
  };

  return (
    <div className="flex h-full">
      <div className="flex w-full flex-col lg:w-80 lg:shrink-0 lg:border-r lg:border-border">
        <div className="shrink-0 border-b border-border px-4 py-5">
          <h1 className="font-display text-xl italic text-foreground">Messages</h1>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
            <input
              placeholder="Search conversations..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-[13px] text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50",
                selectedId === conv.id && "bg-muted",
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="size-10 rounded-xl">
                  <AvatarFallback className="rounded-xl bg-muted text-[13px] font-semibold text-foreground">
                    {conv.initials}
                  </AvatarFallback>
                </Avatar>
                {conv.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[13px] font-semibold text-foreground">
                    {conv.name}
                  </p>
                  <span className="shrink-0 text-[10px] text-foreground-muted">
                    {conv.time}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[12px] text-foreground-muted">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread > 0 && (
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-highlight text-[10px] font-bold text-highlight-foreground">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden flex-1 flex-col lg:flex">
        {selected ? (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="size-10 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-muted text-[13px] font-semibold text-foreground">
                      {selected.initials}
                    </AvatarFallback>
                  </Avatar>
                  {selected.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {selected.name}
                  </p>
                  <p className="text-[12px] text-foreground-muted">
                    {selected.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {mockChat.map((msg, i) => {
                const showAvatar =
                  i === 0 || mockChat[i - 1].sender !== msg.sender;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.isMe && "flex-row-reverse",
                    )}
                  >
                    {showAvatar && !msg.isMe ? (
                      <Avatar className="size-8 shrink-0 rounded-lg mt-1">
                        <AvatarFallback className="rounded-lg bg-muted text-[10px] font-semibold text-foreground">
                          {msg.initials}
                        </AvatarFallback>
                      </Avatar>
                    ) : !msg.isMe ? (
                      <div className="w-8 shrink-0" />
                    ) : null}
                    <div
                      className={cn(
                        "max-w-[65%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
                        msg.isMe
                          ? "bg-foreground text-background rounded-tr-md"
                          : "bg-muted text-foreground rounded-tl-md",
                      )}
                    >
                      {showAvatar && !msg.isMe && (
                        <p className="mb-0.5 text-[11px] font-semibold text-foreground">
                          {msg.sender}
                        </p>
                      )}
                      <p>{msg.text}</p>
                      <p
                        className={cn(
                          "mt-1 text-right text-[10px]",
                          msg.isMe ? "text-background/60" : "text-foreground-muted/60",
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="shrink-0 border-t border-border p-4">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a message..."
                  className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-[13px] text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                />
                <button
                  onClick={send}
                  disabled={!input.trim()}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-foreground text-background transition-colors hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted">
                <MessageSquare className="size-8 text-foreground-muted" />
              </div>
              <h2 className="mt-5 font-display text-xl italic text-foreground">
                Messages
              </h2>
              <p className="mt-2 text-[13px] text-foreground-muted">
                Select a conversation to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
