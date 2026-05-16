"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  Trash2,
  Sparkles,
  ArrowUpRight,
  Heart,
  Wand2,
  MessageSquareDashed,
  Globe2,
} from "lucide-react";
import type { ChatMessage, Language } from "@/lib/schema";
import { LANGUAGES, LANGUAGE_LABELS } from "@/lib/schema";
import { ProgressDots } from "@/components/ui";
import { cn } from "@/lib/utils";
import { explainFetchError, explainResponseError } from "@/lib/errors";

type Props = {
  persona: string;
  defaultLanguage: Language;
  spicy: boolean;
  model: "maverick" | "kimi";
};

const SUGGESTIONS: { label: string; Icon: typeof Sparkles; prompt: string }[] = [
  {
    label: "How do I open?",
    Icon: Sparkles,
    prompt:
      "I just matched with someone on Tinder. Their bio says they're a med student who loves climbing. How should I open?",
  },
  {
    label: "She left me on read",
    Icon: MessageSquareDashed,
    prompt:
      "We were texting daily and now she's left me on read for 3 days. What do I do?",
  },
  {
    label: "Help me ask her out",
    Icon: Heart,
    prompt:
      "We've been texting for a week and the vibe is good. How do I ask her out without sounding desperate?",
  },
  {
    label: "Rewrite this message",
    Icon: Wand2,
    prompt: "Rewrite this so it sounds more confident: ",
  },
];

export function WingChat({ persona, defaultLanguage, spicy, model }: Props) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showLangs, setShowLangs] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Auto-grow textarea up to 6 lines
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 24 * 6 + 24) + "px";
  }, [input]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setError(null);
    const newHistory: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(newHistory);
    setLoading(true);
    try {
      const res = await fetch("/api/wingperson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, language, persona, spicy, model }),
      });
      if (!res.ok) {
        setError(await explainResponseError(res));
        return;
      }
      const data = await res.json();
      setMessages([...newHistory, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      setError(explainFetchError(e));
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const empty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] sm:h-[70vh] min-h-[480px] rounded-3xl border border-border bg-surface overflow-hidden shadow-card">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2 bg-surface/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-cta">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Wingperson</div>
            <div className="text-[11px] text-muted leading-tight">always on your side</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowLangs((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition px-2 py-1 rounded-lg hover:bg-surface2"
            title="Output language"
          >
            <Globe2 size={13} />
            <span className="hidden sm:inline">{LANGUAGE_LABELS[language]}</span>
          </button>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg text-muted hover:text-bold hover:bg-bold/10 transition"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {showLangs && (
        <div className="px-4 py-2 border-b border-border bg-surface2 flex flex-wrap gap-1.5 animate-slide-down">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLanguage(l);
                setShowLangs(false);
              }}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-full border transition",
                l === language
                  ? "bg-pink/15 border-pink/40 text-pink"
                  : "bg-surface border-border text-muted hover:text-text"
              )}
            >
              {LANGUAGE_LABELS[l]}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {empty && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto py-8">
            <div className="hero-glow opacity-30" />
            <h3 className="text-display text-3xl mb-2 relative z-10">
              Talk it <span className="gradient-text">out.</span>
            </h3>
            <p className="text-sm text-text2 leading-relaxed relative z-10 mb-6">
              Describe the situation, paste a message they sent, or ask &ldquo;what
              should I do?&rdquo; I&apos;ll give honest advice — not yes-man fluff.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full relative z-10">
              {SUGGESTIONS.map(({ label, Icon, prompt }) => (
                <button
                  key={label}
                  onClick={() => {
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                  className="group flex items-center gap-2.5 text-left bg-surface2 border border-border rounded-xl p-3 hover:border-pink/40 hover:bg-surface3 transition"
                >
                  <span className="w-7 h-7 rounded-lg bg-surface3 border border-border flex items-center justify-center text-pink shrink-0">
                    <Icon size={13} />
                  </span>
                  <span className="text-xs flex-1">{label}</span>
                  <ArrowUpRight
                    size={12}
                    className="text-muted group-hover:text-pink transition"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isUser = m.role === "user";
          const prevSameRole = i > 0 && messages[i - 1].role === m.role;
          return (
            <div
              key={i}
              className={cn(
                "flex animate-slide-up",
                isUser ? "justify-end" : "justify-start"
              )}
              style={{ animationDelay: `${Math.min(i, 5) * 30}ms` }}
            >
              <div className={cn("flex items-end gap-2 max-w-[85%]")}>
                {!isUser && !prevSameRole && (
                  <div className="w-7 h-7 rounded-lg bg-brand-gradient shrink-0 flex items-center justify-center self-start mt-0.5">
                    <Sparkles size={12} className="text-white" />
                  </div>
                )}
                {!isUser && prevSameRole && <div className="w-7 shrink-0" />}
                <div
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap text-[15px]",
                    isUser
                      ? "bg-brand-gradient text-white shadow-cta rounded-br-md"
                      : "bg-surface2 border border-border rounded-bl-md"
                  )}
                  dir="auto"
                >
                  {m.content}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-gradient shrink-0 flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <div className="bg-surface2 border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <ProgressDots color="rgb(var(--c-muted))" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-bold bg-bold/10 border border-bold/30 rounded-xl px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border p-3 bg-surface/60 backdrop-blur-xl">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Type a message…  (Enter to send · Shift+Enter for newline)"
              className="w-full bg-surface2 border border-border rounded-2xl pl-4 pr-3 py-3 text-[15px] focus:outline-none focus:border-pink/60 resize-none placeholder:text-muted leading-snug"
            />
          </div>
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-brand-gradient text-white shadow-cta hover:brightness-110 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
            aria-label="Send"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
