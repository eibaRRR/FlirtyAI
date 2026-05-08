"use client";

import { useState } from "react";
import { CalendarHeart, Loader2, AlertCircle, Copy, Check, Bookmark } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { Segmented } from "./Segmented";
import { useToast, useCopyWithToast } from "./Toaster";
import {
  DATE_BUDGETS,
  DATE_BUDGET_LABELS,
  DATE_VIBES,
  type DateBudget,
  type DateIdea,
  type DateVibe,
  type Language,
} from "@/lib/schema";
import type { SavedSettings } from "@/lib/storage";
import { useSaved } from "@/lib/storage";
import { cn } from "@/lib/utils";

const BUDGET_DOT: Record<DateBudget, string> = {
  free: "text-safe",
  cheap: "text-safe",
  moderate: "text-med",
  fancy: "text-pink",
};

function DateIdeaCard({ idea }: { idea: DateIdea }) {
  const [copied, setCopied] = useState(false);
  const copyWithToast = useCopyWithToast();
  const { toast } = useToast();
  const saved = useSaved();
  const isSaved = saved.isSaved("reply", idea.pitch);

  const onCopy = async () => {
    await copyWithToast(idea.pitch, "Pitch copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const toggleSave = () => {
    if (isSaved) {
      const m = saved.items.find((s) => s.kind === "reply" && s.text === idea.pitch);
      if (m) {
        saved.remove(m.id);
        toast("Removed from saved", "info");
      }
    } else {
      saved.add({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: Date.now(),
        kind: "reply",
        text: idea.pitch,
        messages: [idea.pitch],
        reasoning: `Date idea: ${idea.title}`,
      });
      toast("Saved to favorites ❤", "success");
    }
  };

  return (
    <div className="bg-panel border border-border rounded-2xl p-4 hover:border-purple/40 transition">
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <div>
          <div className="font-semibold text-base">{idea.title}</div>
          <div className="flex items-center gap-2 mt-1 text-[11px] uppercase tracking-wider text-muted">
            <span className={cn("font-bold", BUDGET_DOT[idea.budget])}>
              {DATE_BUDGET_LABELS[idea.budget]}
            </span>
            <span>·</span>
            <span>{idea.vibe}</span>
            {idea.duration && (
              <>
                <span>·</span>
                <span>{idea.duration}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={toggleSave}
          className={cn(
            "transition flex items-center gap-1 text-xs",
            isSaved ? "text-pink" : "text-muted hover:text-pink"
          )}
          title="Save pitch"
        >
          <Bookmark size={13} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="text-sm leading-relaxed mb-2">{idea.description}</p>
      <p className="text-xs text-muted italic mb-3">{idea.why}</p>
      <div className="bg-panel2 border border-border rounded-xl p-3 text-sm relative" dir="auto">
        <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Pitch</div>
        {idea.pitch}
        <button
          onClick={onCopy}
          className="absolute top-2 right-2 text-muted hover:text-pink transition"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}

type Props = {
  settings: SavedSettings;
};

export function DateIdeasTab({ settings }: Props) {
  const [city, setCity] = useState("");
  const [vibes, setVibes] = useState<DateVibe[]>(["Chill"]);
  const [budget, setBudget] = useState<DateBudget>("moderate");
  const [meetingNumber, setMeetingNumber] = useState(1);
  const [interests, setInterests] = useState("");
  const [language, setLanguage] = useState<Language>(settings.defaultLanguage);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<DateIdea[] | null>(null);

  const toggleVibe = (v: DateVibe) => {
    setVibes((prev) => {
      if (prev.includes(v)) {
        return prev.length === 1 ? prev : prev.filter((x) => x !== v);
      }
      if (prev.length >= 4) return prev;
      return [...prev, v];
    });
  };

  const run = async () => {
    setError(null);
    setIdeas(null);
    setLoading(true);
    try {
      const res = await fetch("/api/date-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          vibes,
          budget,
          meetingNumber,
          interests,
          language,
          spicy: settings.spicyEnabled,
          model: settings.model,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setIdeas(data.ideas);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-muted">
        Plan a real-world meet-up. Pick vibes, budget, and (optionally) a city, and we&apos;ll
        generate ideas plus a ready-to-send pitch for each.
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-muted mb-2 block">City / area (optional)</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={80}
            placeholder="Casablanca, Paris, NYC…"
            className="w-full bg-panel border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple"
          />
        </div>
        <div>
          <label className="text-sm text-muted mb-2 block">
            Meeting # ({meetingNumber === 1 ? "first date" : `date ${meetingNumber}`})
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={meetingNumber}
            onChange={(e) => setMeetingNumber(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted mb-2 block">
          Vibes <span className="text-muted/60">(pick 1-4)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DATE_VIBES.map((v) => {
            const active = vibes.includes(v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => toggleVibe(v)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition border",
                  active
                    ? "bg-brand-gradient border-transparent text-white shadow-lg shadow-pink/20"
                    : "bg-panel2 border-border text-text/80 hover:border-purple/60"
                )}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-panel border border-border rounded-xl px-4 py-3">
        <div className="text-sm font-medium mb-2">Budget</div>
        <Segmented<DateBudget>
          options={DATE_BUDGETS.map((b) => ({ value: b, label: DATE_BUDGET_LABELS[b] }))}
          value={budget}
          onChange={setBudget}
          size="sm"
        />
      </div>

      <div>
        <label className="text-sm text-muted mb-2 block">
          Their interests / context <span className="text-muted/60">(optional)</span>
        </label>
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          maxLength={400}
          rows={2}
          placeholder='e.g. "she loves climbing and indie cafes, hates loud bars"'
          className="w-full bg-panel border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple resize-none"
        />
      </div>

      <LanguageSelector value={language} onChange={setLanguage} />

      <button
        onClick={run}
        disabled={loading}
        className="w-full bg-brand-gradient text-white font-semibold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-pink/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Cooking up date ideas…
          </>
        ) : (
          <>
            <CalendarHeart size={18} /> Generate date ideas
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {ideas && ideas.length > 0 && (
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-semibold">Date ideas</h2>
          {ideas.map((idea, i) => (
            <DateIdeaCard key={i} idea={idea} />
          ))}
        </section>
      )}
    </div>
  );
}
