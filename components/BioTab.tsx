"use client";

import { useState } from "react";
import { Wand2, AlertCircle, Copy, Check } from "lucide-react";
import { GenderToggle } from "./GenderToggle";
import { LanguageSelector } from "./LanguageSelector";
import { Button, Pill, Section, Slider } from "@/components/ui";
import { useCopyWithToast } from "./Toaster";
import {
  BIO_VIBES,
  type BioVariant,
  type BioVibe,
  type Gender,
  type Language,
} from "@/lib/schema";
import type { SavedSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";

function VariantCard({ v, index = 0 }: { v: BioVariant; index?: number }) {
  const [copied, setCopied] = useState(false);
  const copy = useCopyWithToast();
  const onCopy = async () => {
    await copy(v.bio, "Bio copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div
      className="group bg-surface border border-border rounded-2xl p-5 hover:border-pink/40 shadow-card transition animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-gradient text-white shadow-cta">
          {v.vibe}
        </span>
        <span className="text-[11px] text-muted tabular-nums">{v.bio.length} chars</span>
      </div>
      {/* Profile-card preview frame */}
      <div className="rounded-xl border border-border bg-surface2 px-4 py-4 text-[15px] leading-relaxed whitespace-pre-wrap" dir="auto">
        {v.bio}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="text-xs text-muted italic flex-1 leading-relaxed">{v.note}</p>
        <Button
          variant="outline"
          size="sm"
          leftIcon={copied ? <Check size={13} className="text-safe" /> : <Copy size={13} />}
          onClick={onCopy}
        >
          {copied ? "Copied" : "Use this"}
        </Button>
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

  // Bar color for char count
  const pctOver = bio.length / 1000;
  const barColor =
    pctOver > 0.95 ? "bg-bold" : pctOver > 0.8 ? "bg-med" : "bg-brand-gradient";

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 sm:pb-0">
      {/* Hero */}
      {!variants && (
        <header className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-10 sm:px-10 sm:py-14 text-center">
          <div className="hero-glow opacity-50" />
          <div className="relative z-10 max-w-md mx-auto">
            <div className="text-eyebrow !text-pink mb-3">Bio</div>
            <h1 className="text-display text-4xl sm:text-5xl mb-3 text-balance">
              Same facts. <span className="gradient-text">Better energy.</span>
            </h1>
            <p className="text-sm sm:text-base text-text2 leading-relaxed text-balance">
              Paste your current bio. Pick the vibes. Keep what&apos;s true, change how
              it lands.
            </p>
          </div>
        </header>
      )}

      <Section eyebrow="Your current bio">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={1000}
          rows={5}
          placeholder="Paste your bio here…"
          className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink/60 resize-none placeholder:text-muted"
        />
        <div className="mt-2">
          <div className="h-1 bg-surface2 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all", barColor)}
              style={{ width: `${Math.min(100, pctOver * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted mt-1 tabular-nums">
            <span>{bio.length} chars</span>
            <span>1000 max</span>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Vibes"
        hint="Pick 1-4 — one rewrite per vibe."
        trailing={<span className="text-[11px] text-muted tabular-nums">{vibes.length}/4</span>}
      >
        <div className="flex flex-wrap gap-2">
          {BIO_VIBES.map((v) => (
            <Pill key={v} selected={vibes.includes(v)} onClick={() => toggleVibe(v)}>
              {v}
            </Pill>
          ))}
        </div>
      </Section>

      <Section eyebrow="Constraints">
        <Slider
          value={maxChars}
          onChange={setMaxChars}
          min={60}
          max={800}
          step={10}
          label="Max characters per variant"
          leftLabel="60"
          rightLabel="800"
          formatValue={(n) => `${n} chars`}
        />
        <div className="text-[11px] text-muted mt-1.5 text-center">
          Tinder caps at ~500 · Hinge at ~150
        </div>
      </Section>

      <Section eyebrow="Identity">
        <div className="flex flex-wrap gap-x-8 gap-y-4 mb-4">
          <GenderToggle label="You are" value={userGender} onChange={setUserGender} />
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </Section>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        leftIcon={<Wand2 size={18} />}
        onClick={run}
        disabled={bio.trim().length === 0}
      >
        {loading ? "Rewriting…" : "Rewrite my bio"}
      </Button>

      {error && (
        <div className="flex items-start gap-2.5 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3.5 text-sm animate-slide-up">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {variants && variants.length > 0 && (
        <section className="space-y-3 pt-2">
          <div>
            <div className="text-eyebrow">Rewrites · {variants.length}</div>
            <h2 className="text-xl font-semibold tracking-tight">Pick your bio.</h2>
          </div>
          {variants.map((v, i) => (
            <VariantCard key={i} v={v} index={i} />
          ))}
        </section>
      )}
    </div>
  );
}
