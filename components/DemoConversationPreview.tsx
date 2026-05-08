"use client";

import { Phone, Video, ChevronLeft, MoreHorizontal } from "lucide-react";
import type { DemoMessage } from "@/lib/demo";
import { cn } from "@/lib/utils";

type Props = {
  match: { name: string; status: string };
  messages: DemoMessage[];
};

/**
 * Renders the demo scenario's fake conversation as a styled "phone screen"
 * so users can visually map THIS input → the canned replies they'll see below.
 */
export function DemoConversationPreview({ match, messages }: Props) {
  return (
    <div className="relative">
      {/* Phone-frame chrome */}
      <div className="rounded-[28px] bg-surface border border-border shadow-pop overflow-hidden">
        {/* Header — looks like a real chat app */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-border bg-surface/80 backdrop-blur-xl">
          <button
            tabIndex={-1}
            className="text-muted shrink-0 cursor-default"
            aria-hidden="true"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-full bg-brand-gradient shrink-0 flex items-center justify-center text-white font-semibold text-sm">
            {match.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold leading-tight">{match.name}</div>
            <div className="text-[11px] text-muted leading-tight">{match.status}</div>
          </div>
          <div className="flex items-center gap-3 text-muted">
            <Phone size={15} />
            <Video size={15} />
            <MoreHorizontal size={15} />
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-5 space-y-2 bg-bg/60">
          {messages.map((m, i) => {
            const isMe = m.from === "me";
            const prevSame = i > 0 && messages[i - 1].from === m.from;
            const nextSame = i < messages.length - 1 && messages[i + 1].from === m.from;
            return (
              <div key={i}>
                {m.ts && (
                  <div className="text-center text-[10px] uppercase tracking-wider text-muted py-2">
                    {m.ts}
                  </div>
                )}
                <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[78%] px-3.5 py-2 text-[14px] leading-relaxed whitespace-pre-wrap",
                      isMe
                        ? "bg-brand-gradient text-white shadow-cta"
                        : "bg-surface2 border border-border",
                      // iMessage-style stacked bubble corners
                      isMe
                        ? cn(
                            "rounded-2xl",
                            !prevSame && "rounded-tr-2xl",
                            prevSame && "rounded-tr-md",
                            !nextSame && "rounded-br-md",
                            nextSame && "rounded-br-md"
                          )
                        : cn(
                            "rounded-2xl",
                            !prevSame && "rounded-tl-2xl",
                            prevSame && "rounded-tl-md",
                            !nextSame && "rounded-bl-md"
                          )
                    )}
                    dir="auto"
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}

          {/* "their last message" indicator at the bottom — shows what we're replying to */}
          <div className="pt-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-wider text-pink font-semibold">
              ↓ FlirtyAI replies to this
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
