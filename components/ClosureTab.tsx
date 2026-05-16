"use client";

import { useState } from "react";
import { Heart, AlertCircle, Copy, Check, Bookmark } from "lucide-react";
import { GenderToggle } from "./GenderToggle";
import { LanguageSelector } from "./LanguageSelector";
import { Segmented } from "./Segmented";
import { Button, Pill, Section } from "@/components/ui";
import { useToast, useCopyWithToast } from "./Toaster";
import {
  CLOSURE_REASONS,
  CLOSURE_REASON_LABELS,
  CLOSURE_TONES,
  LENGTHS,
  LENGTH_LABELS,
  type ClosureMessage,
  type ClosureReason,
  type ClosureTone,
  type Gender,
  type Language,
  type Length,
} from "@/lib/schema";
import { useSaved, type SavedSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { explainFetchError, explainResponseError } from "@/lib/errors";

const TONE_DOT: Record<ClosureTone, string> = {
  Mature: "bg-purple",
  Warm: "bg-warm",
  Cold: "bg-muted",
  Honest: "bg-safe",
  Brief: "bg-text2",
  Apologetic: "bg-med",
};

function ClosureCard({ msg, index = 0 }: { msg: ClosureMessage; index?: number }) {
  const [copied, setCopied] = useState(false);
  const copy = useCopyWithToast();
  const { toast } = useToast();
  const saved = useSaved();
  const isSaved = saved.isSaved("reply", msg.text);

  const onCopy = async () => {
    await copy(msg.text, "Copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const toggleSave = () => {
    if (isSaved) {
      const m = saved.items.find((s) => s.kind === "reply" && s.text === msg.text);
      if (m) {
        saved.remove(m.id);
        toast("Removed from saved", "info");
      }
    } else {
      saved.add({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: Date.now(),
        kind: "reply",
        text: msg.text,
        messages: [msg.text],
        reasoning: `Closure (${msg.tone}): ${msg.reasoning}`,
      });
      toast("Saved to favorites ❤", "success");
    }
  };

  return (
    <div
      className="bg-surface border border-border rounded-2xl p-5 shadow-card hover:border-pink/40 transition animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
          <span className={cn("w-2 h-2 rounded-full", TONE_DOT[msg.tone])} />
          <span className="text-text2">{msg.tone}</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleSave}
            className={cn(
              "p-1.5 rounded-lg transition",
              isSaved
                ? "text-pink hover:bg-pink/10"
                : "text-muted hover:text-pink hover:bg-surface2"
            )}
            aria-label={isSaved ? "Remove from saved" : "Save"}
          >
            <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onCopy}
            className="p-1.5 rounded-lg text-muted hover:text-pink hover:bg-surface2 transition"
            aria-label="Copy"
          >
            {copied ? <Check size={14} className="text-safe" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
      {/* Closure messages render as user-side gradient bubbles */}
      <div className="flex justify-end mb-3">
        <div
          className="max-w-[92%] bg-brand-gradient text-white rounded-2xl rounded-br-md px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap shadow-cta"
          dir="auto"
        >
          {msg.text}
        </div>
      </div>
      <div className="pt-3 border-t border-border text-xs text-muted italic leading-relaxed">
        {msg.reasoning}
      </div>
    </div>
  );
}

type Props = {
  persona: string;
  settings: SavedSettings;
};

export function ClosureTab({ persona, settings }: Props) {
  const [reason, setReason] = useState<ClosureReason>("no_chemistry");
  const [context, setContext] = useState("");
  const [tones, setTones] = useState<ClosureTone[]>(["Mature", "Brief"]);
  const [language, setLanguage] = useState<Language>(settings.defaultLanguage);
  const [length, setLength] = useState<Length>("medium");
  const [userGender, setUserGender] = useState<Gender>("male");
  const [targetGender, setTargetGender] = useState<Gender>("female");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ClosureMessage[] | null>(null);

  const toggleTone = (t: ClosureTone) => {
    setTones((prev) => {
      if (prev.includes(t)) {
        return prev.length === 1 ? prev : prev.filter((x) => x !== t);
      }
      if (prev.length >= 3) return prev;
      return [...prev, t];
    });
  };

  const run = async () => {
    setError(null);
    setMessages(null);
    setLoading(true);
    try {
      const res = await fetch("/api/closure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          context,
          tones,
          language,
          length,
          persona,
          userGender,
          targetGender,
          model: settings.model,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(await explainResponseError(res)); return; }
      else setMessages(data.messages);
    } catch (e: unknown) {
      setError(explainFetchError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!messages && (
        <p className="text-sm text-text2 leading-relaxed text-balance">
          End things cleanly, kindly, and on your terms. Pick a reason and tone — we&apos;ll
          draft messages free of guilt-tripping or score-settling.
        </p>
      )}

      <Section eyebrow="What's going on">
        <div className="flex flex-wrap gap-2">
          {CLOSURE_REASONS.map((r) => (
            <Pill key={r} selected={reason === r} onClick={() => setReason(r)}>
              {CLOSURE_REASON_LABELS[r]}
            </Pill>
          ))}
        </div>
      </Section>

      <Section eyebrow="Context" hint="Optional, but it makes a real difference.">
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={800}
          rows={3}
          placeholder='e.g. "we went on 3 dates, she keeps pushing for exclusivity but I just don&apos;t feel it"'
          className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink/60 resize-none placeholder:text-muted"
        />
      </Section>

      <Section
        eyebrow="Tones"
        hint="Pick 1-3 — one message per tone."
        trailing={<span className="text-[11px] text-muted tabular-nums">{tones.length}/3</span>}
      >
        <div className="flex flex-wrap gap-2">
          {CLOSURE_TONES.map((t) => (
            <Pill
              key={t}
              tone="purple"
              selected={tones.includes(t)}
              onClick={() => toggleTone(t)}
              leftIcon={<span className={cn("w-1.5 h-1.5 rounded-full", TONE_DOT[t])} />}
            >
              {t}
            </Pill>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Output"
        trailing={
          <Segmented<Length>
            options={LENGTHS.map((l) => ({ value: l, label: LENGTH_LABELS[l] }))}
            value={length}
            onChange={setLength}
            size="sm"
          />
        }
      >
        <div className="flex flex-wrap gap-x-8 gap-y-4 mb-4">
          <GenderToggle label="You are" value={userGender} onChange={setUserGender} />
          <GenderToggle label="They are" value={targetGender} onChange={setTargetGender} />
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </Section>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        leftIcon={<Heart size={18} />}
        onClick={run}
      >
        {loading ? "Drafting closure…" : "Draft closure messages"}
      </Button>

      {error && (
        <div className="flex items-start gap-2.5 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3.5 text-sm animate-slide-up">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {messages && messages.length > 0 && (
        <section className="space-y-3 pt-2">
          <div>
            <div className="text-eyebrow">Closure · {messages.length} options</div>
            <h2 className="text-xl font-semibold tracking-tight">Send the right one.</h2>
          </div>
          {messages.map((m, i) => (
            <ClosureCard key={i} msg={m} index={i} />
          ))}
        </section>
      )}
    </div>
  );
}
