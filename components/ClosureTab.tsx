"use client";

import { useState } from "react";
import { Heart, Loader2, AlertCircle, Copy, Check, Bookmark } from "lucide-react";
import { GenderToggle } from "./GenderToggle";
import { LanguageSelector } from "./LanguageSelector";
import { Segmented } from "./Segmented";
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

function ClosureCard({ msg }: { msg: ClosureMessage }) {
  const [copied, setCopied] = useState(false);
  const copyWithToast = useCopyWithToast();
  const { toast } = useToast();
  const saved = useSaved();
  const isSaved = saved.isSaved("reply", msg.text);

  const onCopy = async () => {
    await copyWithToast(msg.text, "Copied");
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
    <div className="bg-panel border border-border rounded-2xl p-4 hover:border-purple/40 transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-purple/15 text-purple border-purple/30">
          {msg.tone}
        </span>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={toggleSave}
            className={cn(
              "transition flex items-center gap-1",
              isSaved ? "text-pink" : "text-muted hover:text-pink"
            )}
            title="Save"
          >
            <Bookmark size={13} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onCopy}
            className="text-muted hover:text-pink transition flex items-center gap-1.5"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />} Copy
          </button>
        </div>
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-wrap" dir="auto">
        {msg.text}
      </div>
      <div className="mt-3 pt-3 border-t border-border text-xs text-muted italic">
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
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setMessages(data.messages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-muted">
        Need to end things, move on, or just say it cleanly? We&apos;ll draft closure messages
        across the tones you pick — direct, kind, and free of guilt-tripping.
      </div>

      <div>
        <label className="text-sm text-muted mb-2 block">What&apos;s going on?</label>
        <div className="flex flex-wrap gap-2">
          {CLOSURE_REASONS.map((r) => {
            const active = reason === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition border",
                  active
                    ? "bg-brand-gradient border-transparent text-white shadow-lg shadow-pink/20"
                    : "bg-panel2 border-border text-text/80 hover:border-purple/60"
                )}
              >
                {CLOSURE_REASON_LABELS[r]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm text-muted mb-2 block">
          Context <span className="text-muted/60">(optional, helps a lot)</span>
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={800}
          rows={3}
          placeholder='e.g. "we went on 3 dates, she keeps pushing for exclusivity but I just don&apos;t feel it"'
          className="w-full bg-panel border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple resize-none"
        />
      </div>

      <div>
        <label className="text-sm text-muted mb-2 block">
          Tones <span className="text-muted/60">(pick 1-3)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CLOSURE_TONES.map((t) => {
            const active = tones.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTone(t)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition border",
                  active
                    ? "bg-purple/20 border-purple/50 text-purple"
                    : "bg-panel2 border-border text-text/80 hover:border-purple/60"
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-panel border border-border rounded-xl px-4 py-3">
          <div className="text-sm font-medium mb-2">Length</div>
          <Segmented<Length>
            options={LENGTHS.map((l) => ({ value: l, label: LENGTH_LABELS[l] }))}
            value={length}
            onChange={setLength}
            size="sm"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <GenderToggle label="You are" value={userGender} onChange={setUserGender} />
          <GenderToggle label="They are" value={targetGender} onChange={setTargetGender} />
        </div>
      </div>

      <LanguageSelector value={language} onChange={setLanguage} />

      <button
        onClick={run}
        disabled={loading}
        className="w-full bg-brand-gradient text-white font-semibold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-pink/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Drafting closure…
          </>
        ) : (
          <>
            <Heart size={18} /> Draft closure messages
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {messages && messages.length > 0 && (
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-semibold">Your closure options</h2>
          {messages.map((m, i) => (
            <ClosureCard key={i} msg={m} />
          ))}
        </section>
      )}
    </div>
  );
}
