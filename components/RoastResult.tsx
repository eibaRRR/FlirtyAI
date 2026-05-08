"use client";

import { useState } from "react";
import { Copy, Check, Flame, ThumbsUp, ThumbsDown } from "lucide-react";
import type { RoastOutput } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useCopyWithToast } from "./Toaster";

function scoreColor(s: number) {
  if (s >= 7) return "text-safe";
  if (s >= 4) return "text-med";
  return "text-bold";
}

export function RoastResult({ result }: { result: RoastOutput }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const copy = useCopyWithToast();
  const onCopy = async (i: number) => {
    await copy(result.betterAlternatives[i], "Copied");
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1400);
  };

  return (
    <div className="space-y-6">
      {/* Score hero — editorial */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-10 sm:py-14 text-center">
        <div className="hero-glow opacity-50" />
        <div className="relative z-10 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 text-eyebrow !text-bold mb-4">
            <Flame size={11} /> The verdict
          </div>
          <div className="leading-none">
            <span
              className={cn(
                "text-display font-normal text-7xl sm:text-8xl tabular-nums",
                scoreColor(result.score)
              )}
            >
              {result.score.toFixed(1)}
            </span>
            <span className="text-display text-3xl text-muted ml-1">/10</span>
          </div>
          <p className="text-[15px] mt-5 leading-relaxed text-balance" dir="auto">
            {result.verdict}
          </p>
        </div>
      </div>

      {/* Two columns */}
      <div className="relative">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
            <div className="text-eyebrow !text-safe inline-flex items-center gap-1.5 mb-3">
              <ThumbsUp size={11} /> What worked
            </div>
            {result.whatWorked.length === 0 ? (
              <p className="text-sm text-muted italic">Nothing notable.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {result.whatWorked.map((w, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-safe shrink-0 font-bold">+</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
            <div className="text-eyebrow !text-bold inline-flex items-center gap-1.5 mb-3">
              <ThumbsDown size={11} /> What flopped
            </div>
            {result.whatFlopped.length === 0 ? (
              <p className="text-sm text-muted italic">Surprisingly clean.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {result.whatFlopped.map((w, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-bold shrink-0 font-bold">−</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* "but" divider on desktop */}
        <span className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg border border-border items-center justify-center text-display italic text-base text-muted">
          but
        </span>
      </div>

      {/* Better alternatives */}
      <div>
        <div className="text-eyebrow mb-3">What you should have sent instead</div>
        <div className="space-y-2">
          {result.betterAlternatives.map((m, i) => (
            <div
              key={i}
              className="group bg-surface border border-border rounded-2xl p-4 flex items-start justify-between gap-3 hover:border-pink/40 shadow-card transition animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="leading-relaxed text-[15px]" dir="auto">
                {m}
              </span>
              <button
                onClick={() => onCopy(i)}
                className="p-1.5 rounded-lg text-muted hover:text-pink hover:bg-surface2 transition shrink-0 opacity-60 group-hover:opacity-100"
                aria-label="Copy"
                title="Copy"
              >
                {copiedIdx === i ? <Check size={14} className="text-safe" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
