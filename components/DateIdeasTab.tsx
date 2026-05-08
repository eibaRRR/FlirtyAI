"use client";

import { useState } from "react";
import { CalendarHeart, AlertCircle, Copy, Check, Bookmark, MapPin } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { Segmented } from "./Segmented";
import { Button, Pill, Section, Slider } from "@/components/ui";
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
import { useSaved, type SavedSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";

const BUDGET_DOT: Record<DateBudget, string> = {
  free: "bg-safe",
  cheap: "bg-safe",
  moderate: "bg-med",
  fancy: "bg-pink",
};

const VIBE_DOT: Record<DateVibe, string> = {
  Chill: "bg-safe",
  Adventurous: "bg-warm",
  Romantic: "bg-pink",
  Active: "bg-safe",
  Foodie: "bg-warm",
  Cultural: "bg-purple",
  Playful: "bg-pink",
  Spicy: "bg-bold",
};

function DateIdeaCard({ idea, index = 0 }: { idea: DateIdea; index?: number }) {
  const [copied, setCopied] = useState(false);
  const copy = useCopyWithToast();
  const { toast } = useToast();
  const saved = useSaved();
  const isSaved = saved.isSaved("reply", idea.pitch);

  const onCopy = async () => {
    await copy(idea.pitch, "Pitch copied");
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
    <div
      className="group bg-surface border border-border rounded-2xl p-5 shadow-card hover:border-pink/40 transition animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-[17px] tracking-tight leading-snug">
            {idea.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] uppercase tracking-wider text-muted">
            <span className={cn("w-1.5 h-1.5 rounded-full", VIBE_DOT[idea.vibe])} />
            <span className="text-text2">{idea.vibe}</span>
            <span>·</span>
            <span className={cn("w-1.5 h-1.5 rounded-full", BUDGET_DOT[idea.budget])} />
            <span className="text-text2">{DATE_BUDGET_LABELS[idea.budget]}</span>
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
            "p-1.5 rounded-lg transition shrink-0",
            isSaved
              ? "text-pink hover:bg-pink/10"
              : "text-muted hover:text-pink hover:bg-surface2"
          )}
          aria-label={isSaved ? "Remove from saved" : "Save"}
        >
          <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="text-[15px] leading-relaxed mb-2">{idea.description}</p>
      <p className="text-xs text-text2 italic leading-relaxed mb-4">{idea.why}</p>

      {/* Pitch as a chat-bubble preview */}
      <div className="relative">
        <div className="text-eyebrow mb-2">The pitch</div>
        <div
          className="bg-brand-gradient text-white rounded-2xl rounded-bl-md px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap shadow-cta"
          dir="auto"
        >
          {idea.pitch}
        </div>
        <button
          onClick={onCopy}
          className="absolute top-7 right-2 p-1.5 rounded-lg bg-bg/30 backdrop-blur text-white/80 hover:text-white hover:bg-bg/50 transition opacity-0 group-hover:opacity-100"
          aria-label="Copy pitch"
        >
          {copied ? <Check size={13} className="text-white" /> : <Copy size={13} />}
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
    <div className="space-y-6">
      {!ideas && (
        <p className="text-sm text-text2 leading-relaxed text-balance">
          Plan a real-world meet-up. Pick vibes, budget, and (optionally) a city — get
          ideas with a ready-to-send pitch for each.
        </p>
      )}

      <Section eyebrow="Where & when">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-eyebrow block mb-2">City / area</label>
            <div className="relative">
              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={80}
                placeholder="Casablanca, Paris, NYC…"
                className="w-full bg-surface2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-pink/60 placeholder:text-muted"
              />
            </div>
          </div>
          <div>
            <Slider
              value={meetingNumber}
              onChange={setMeetingNumber}
              min={1}
              max={10}
              label="Meeting #"
              hint={meetingNumber === 1 ? "first date" : `date ${meetingNumber}`}
              formatValue={(n) => `#${n}`}
              leftLabel="1st"
              rightLabel="10th"
            />
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Vibes"
        trailing={<span className="text-[11px] text-muted tabular-nums">{vibes.length}/4</span>}
      >
        <div className="flex flex-wrap gap-2">
          {DATE_VIBES.map((v) => (
            <Pill
              key={v}
              selected={vibes.includes(v)}
              onClick={() => toggleVibe(v)}
              leftIcon={<span className={cn("w-1.5 h-1.5 rounded-full", VIBE_DOT[v])} />}
            >
              {v}
            </Pill>
          ))}
        </div>
      </Section>

      <Section eyebrow="Budget">
        <Segmented<DateBudget>
          fullWidth
          options={DATE_BUDGETS.map((b) => ({ value: b, label: DATE_BUDGET_LABELS[b] }))}
          value={budget}
          onChange={setBudget}
          size="sm"
        />
      </Section>

      <Section
        eyebrow="Their interests"
        hint="Optional — but it sharpens the suggestions a lot."
      >
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          maxLength={400}
          rows={2}
          placeholder='e.g. "loves climbing and indie cafes, hates loud bars"'
          className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink/60 resize-none placeholder:text-muted"
        />
      </Section>

      <Section eyebrow="Output language">
        <LanguageSelector value={language} onChange={setLanguage} />
      </Section>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        leftIcon={<CalendarHeart size={18} />}
        onClick={run}
      >
        {loading ? "Cooking up date ideas…" : "Generate date ideas"}
      </Button>

      {error && (
        <div className="flex items-start gap-2.5 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3.5 text-sm animate-slide-up">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {ideas && ideas.length > 0 && (
        <section className="space-y-3 pt-2">
          <div>
            <div className="text-eyebrow">Date ideas · {ideas.length}</div>
            <h2 className="text-xl font-semibold tracking-tight">Pick your move.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {ideas.map((idea, i) => (
              <DateIdeaCard key={i} idea={idea} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
