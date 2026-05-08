"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, AlertCircle, Copy, Check, Bookmark } from "lucide-react";
import { MoodControls } from "./MoodControls";
import { GenderToggle } from "./GenderToggle";
import { LanguageSelector } from "./LanguageSelector";
import { Segmented } from "./Segmented";
import { Toggle } from "./Toggle";
import { useToast, useCopyWithToast } from "./Toaster";
import {
  LENGTHS,
  LENGTH_LABELS,
  isSpicyMood,
  type Gender,
  type Language,
  type Length,
  type MoodPreset,
  type Opener,
} from "@/lib/schema";
import { useSaved, type SavedSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";

const RISK_STYLES: Record<Opener["risk"], { label: string; cls: string }> = {
  safe: { label: "Safe", cls: "bg-safe/15 text-safe border-safe/30" },
  medium: { label: "Medium", cls: "bg-med/15 text-med border-med/30" },
  bold: { label: "Bold", cls: "bg-bold/15 text-bold border-bold/30" },
};

function OpenerCard({ opener, language, moods }: { opener: Opener; language?: Language; moods?: MoodPreset[] }) {
  const [copied, setCopied] = useState(false);
  const copyWithToast = useCopyWithToast();
  const { toast } = useToast();
  const saved = useSaved();
  const isSaved = saved.isSaved("opener", opener.text);
  const r = RISK_STYLES[opener.risk];

  const onCopy = async () => {
    await copyWithToast(opener.text, "Copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const toggleSave = () => {
    if (isSaved) {
      const m = saved.items.find((s) => s.kind === "opener" && s.text === opener.text);
      if (m) {
        saved.remove(m.id);
        toast("Removed from saved", "info");
      }
    } else {
      saved.add({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: Date.now(),
        kind: "opener",
        text: opener.text,
        messages: [opener.text],
        reasoning: opener.reasoning,
        risk: opener.risk,
        moods,
        language,
      });
      toast("Saved to favorites ❤", "success");
    }
  };

  return (
    <div className="bg-panel border border-border rounded-2xl p-4 hover:border-purple/40 transition">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
            r.cls
          )}
        >
          {r.label}
        </span>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={toggleSave}
            className={cn(
              "transition flex items-center gap-1",
              isSaved ? "text-pink" : "text-muted hover:text-pink"
            )}
            title={isSaved ? "Remove from saved" : "Save to favorites"}
          >
            <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            onClick={onCopy}
            className="text-muted hover:text-pink transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </button>
        </div>
      </div>
      <div className="text-base leading-relaxed whitespace-pre-wrap" dir="auto">
        {opener.text}
      </div>
      <div className="mt-3 pt-3 border-t border-border text-xs text-muted italic">
        {opener.reasoning}
      </div>
    </div>
  );
}

type Props = {
  persona: string;
  settings: SavedSettings;
  spicy: boolean;
  model: "maverick" | "kimi";
};

export function OpenerTab({ persona, settings, spicy, model }: Props) {
  const [bio, setBio] = useState("");
  const [photosNote, setPhotosNote] = useState("");
  const [context, setContext] = useState("");
  const [platform, setPlatform] = useState("");
  const [moods, setMoods] = useState<MoodPreset[]>(["Playful"]);
  const [customMood, setCustomMood] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [userGender, setUserGender] = useState<Gender>("male");
  const [targetGender, setTargetGender] = useState<Gender>("female");
  const [language, setLanguage] = useState<Language>(settings.defaultLanguage);
  const [length, setLength] = useState<Length>("short");
  const [blendMode, setBlendMode] = useState(settings.defaultBlend);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openers, setOpeners] = useState<Opener[] | null>(null);

  // Strip spicy moods if adult mode is off
  useEffect(() => {
    if (!spicy) {
      setMoods((prev) => {
        const cleaned = prev.filter((m) => !isSpicyMood(m));
        return cleaned.length > 0 ? cleaned : (["Playful"] as MoodPreset[]);
      });
    }
  }, [spicy]);

  const onSetBlend = (v: boolean) => {
    setBlendMode(v);
    if (!v) setMoods((m) => (m.length > 1 ? [m[0]] : m));
  };

  const run = async () => {
    setError(null);
    setOpeners(null);
    setLoading(true);
    try {
      const res = await fetch("/api/opener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          photosNote,
          context,
          platform,
          moods,
          customMood,
          intensity,
          userGender,
          targetGender,
          language,
          length,
          persona,
          spicy,
          model,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setOpeners(data.openers);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-muted">
        No conversation yet? Paste their bio (and any quick notes about their photos), pick a
        vibe, and get opener candidates that hook into specifics.
      </div>

      <div>
        <label className="text-sm text-muted mb-2 block">Their bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={800}
          rows={4}
          placeholder='Paste the bio here, e.g. "med student | hiking, climbing | dog mom 🐕 | spotify on shuffle"'
          className="w-full bg-panel border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple resize-none"
        />
        <div className="text-right text-xs text-muted mt-1">{bio.length}/800</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-muted mb-2 block">Photos notes (optional)</label>
          <textarea
            value={photosNote}
            onChange={(e) => setPhotosNote(e.target.value)}
            maxLength={400}
            rows={2}
            placeholder='e.g. "one photo at a concert, another with a dog"'
            className="w-full bg-panel border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-muted mb-2 block">Platform (optional)</label>
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            maxLength={40}
            placeholder="Tinder, Hinge, IG..."
            className="w-full bg-panel border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted mb-2 block">
          What you want to convey <span className="text-muted/60">(optional)</span>
        </label>
        <input
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={400}
          placeholder='e.g. "show I actually read the bio, not creepy"'
          className="w-full bg-panel border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple"
        />
      </div>

      <div className="bg-panel/50 border border-border rounded-2xl p-5">
        <MoodControls
          moods={moods}
          setMoods={setMoods}
          blendMode={blendMode}
          customMood={customMood}
          setCustomMood={setCustomMood}
          intensity={intensity}
          setIntensity={setIntensity}
          spicyEnabled={spicy}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Toggle
          label="Mood blend"
          hint="Pick up to 3 moods to mix"
          checked={blendMode}
          onChange={onSetBlend}
        />
        <div className="bg-panel border border-border rounded-xl px-4 py-3">
          <div className="text-sm font-medium mb-2">Length</div>
          <Segmented<Length>
            options={LENGTHS.map((l) => ({ value: l, label: LENGTH_LABELS[l] }))}
            value={length}
            onChange={setLength}
            size="sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <GenderToggle label="You are" value={userGender} onChange={setUserGender} />
        <GenderToggle label="They are" value={targetGender} onChange={setTargetGender} />
      </div>

      <LanguageSelector value={language} onChange={setLanguage} />

      <button
        onClick={run}
        disabled={loading}
        className="w-full bg-brand-gradient text-white font-semibold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-pink/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Crafting openers...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Generate openers
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {openers && openers.length > 0 && (
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-semibold">Your openers</h2>
          {openers.map((o, i) => (
            <OpenerCard key={i} opener={o} language={language} moods={moods} />
          ))}
        </section>
      )}
    </div>
  );
}
