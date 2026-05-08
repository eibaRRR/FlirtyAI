"use client";

import { useState } from "react";
import { Wand2, Loader2, AlertCircle, Copy, Check } from "lucide-react";
import { GenderToggle } from "./GenderToggle";
import { LanguageSelector } from "./LanguageSelector";
import {
  BIO_VIBES,
  type BioVariant,
  type BioVibe,
  type Gender,
  type Language,
} from "@/lib/schema";
import type { SavedSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";

function VariantCard({ v }: { v: BioVariant }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(v.bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="bg-panel border border-border rounded-2xl p-4 hover:border-purple/40 transition">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-gradient text-white">
          {v.vibe}
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted">{v.bio.length} chars</span>
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
      <div className="text-sm leading-relaxed whitespace-pre-wrap" dir="auto">
        {v.bio}
      </div>
      <div className="mt-3 pt-3 border-t border-border text-xs text-muted italic">
        {v.note}
      </div>
    </div>
  );
}

type Props = {
  settings: SavedSettings;
  model: "maverick" | "kimi";
};

export function BioTab({ settings, model }: Props) {
  const [bio, setBio] = useState("");
  const [vibes, setVibes] = useState<BioVibe[]>(["Funny", "Sincere", "Bold"]);
  const [language, setLanguage] = useState<Language>(settings.defaultLanguage);
  const [userGender, setUserGender] = useState<Gender>("male");
  const [maxChars, setMaxChars] = useState(300);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<BioVariant[] | null>(null);

  const toggleVibe = (v: BioVibe) => {
    if (vibes.includes(v)) {
      if (vibes.length === 1) return;
      setVibes(vibes.filter((x) => x !== v));
    } else {
      if (vibes.length >= 4) return;
      setVibes([...vibes, v]);
    }
  };

  const run = async () => {
    if (bio.trim().length === 0) {
      setError("Paste your current bio first.");
      return;
    }
    setError(null);
    setVariants(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, vibes, language, userGender, maxChars, model }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setVariants(data.variants);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-muted">
        Paste your current dating-profile bio. Pick the vibes you want and get rewrites that
        keep the facts but change the energy.
      </div>

      <div>
        <label className="text-sm text-muted mb-2 block">Your current bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={1000}
          rows={5}
          placeholder='Paste your bio here...'
          className="w-full bg-panel border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple resize-none"
        />
        <div className="text-right text-xs text-muted mt-1">{bio.length}/1000</div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-muted">Vibes (pick 1-4)</label>
          <span className="text-xs text-muted">{vibes.length}/4</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {BIO_VIBES.map((v) => {
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
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Max characters per variant</label>
          <span className="text-sm font-mono text-pink">{maxChars}</span>
        </div>
        <input
          type="range"
          min={60}
          max={800}
          step={10}
          value={maxChars}
          onChange={(e) => setMaxChars(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>60</span>
          <span>Tinder ~500</span>
          <span>800</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <GenderToggle label="You are" value={userGender} onChange={setUserGender} />
      </div>

      <LanguageSelector value={language} onChange={setLanguage} />

      <button
        onClick={run}
        disabled={loading || bio.trim().length === 0}
        className="w-full bg-brand-gradient text-white font-semibold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-pink/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Rewriting...
          </>
        ) : (
          <>
            <Wand2 size={18} />
            Rewrite my bio
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {variants && variants.length > 0 && (
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-semibold">Your rewrites</h2>
          {variants.map((v, i) => (
            <VariantCard key={i} v={v} />
          ))}
        </section>
      )}
    </div>
  );
}
