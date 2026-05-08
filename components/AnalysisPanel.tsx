"use client";

import { Eye, Flag as FlagIcon } from "lucide-react";
import type { Analysis } from "@/lib/schema";
import { STAGE_LABELS } from "@/lib/schema";
import { cn } from "@/lib/utils";

const RISK_DOT: Record<Analysis["recommendedRisk"], string> = {
  safe: "bg-safe",
  medium: "bg-med",
  bold: "bg-bold",
};

export function AnalysisPanel({ analysis }: { analysis: Analysis }) {
  const flags = analysis.flags ?? [];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple/30 bg-surface p-5 shadow-card animate-slide-up">
      <div className="absolute inset-0 bg-brand-gradient-soft opacity-50 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-lg bg-purple/15 text-purple flex items-center justify-center">
            <Eye size={14} />
          </span>
          <span className="text-eyebrow !text-purple">Read of the situation</span>
        </div>

        <p className="text-[15px] leading-relaxed mb-4 text-balance" dir="auto">
          {analysis.vibe || "—"}
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-surface2 border border-border">
            <span className="text-muted">Stage · </span>
            <span className="text-text">{STAGE_LABELS[analysis.stage] ?? analysis.stage}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-surface2 border border-border inline-flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", RISK_DOT[analysis.recommendedRisk])} />
            <span className="text-muted">Recommended · </span>
            <span className="text-text">{analysis.recommendedRisk}</span>
          </span>
          {analysis.languageDetected && (
            <span className="px-2.5 py-1 rounded-full bg-surface2 border border-border">
              <span className="text-muted">Language · </span>
              <span className="text-text">{analysis.languageDetected}</span>
            </span>
          )}
        </div>

        {flags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple/20">
            <div className="text-eyebrow mb-2 inline-flex items-center gap-1.5">
              <FlagIcon size={11} /> Flags spotted
            </div>
            <div className="space-y-1.5">
              {flags.map((f, i) => {
                const isGreen = f.type === "green";
                return (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs flex items-start gap-2 border",
                      isGreen
                        ? "bg-safe/10 border-safe/30 text-safe"
                        : "bg-bold/10 border-bold/30 text-bold"
                    )}
                  >
                    <span className="font-bold mt-0.5 shrink-0">{isGreen ? "✓" : "⚠"}</span>
                    <div className="min-w-0">
                      <div className="font-semibold">{f.label}</div>
                      <div className="text-text/70 mt-0.5">{f.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
