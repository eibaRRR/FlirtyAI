"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  /** Optional 24px icon shown top-left of the card */
  icon?: ReactNode;
  /** Compact = no card wrapper (inline switch only) */
  compact?: boolean;
};

export function Toggle({ checked, onChange, label, hint, icon, compact = false }: Props) {
  const Switch = (
    <span
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition",
        checked
          ? "bg-brand-gradient shadow-[0_0_0_4px_rgb(var(--c-pink)/0.18)]"
          : "bg-surface2 border border-border"
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </span>
  );

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="inline-flex items-center gap-2"
      >
        {Switch}
        <span className="text-sm">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={cn(
        "group w-full text-left rounded-2xl border p-4 transition relative overflow-hidden",
        checked
          ? "bg-surface border-pink/40 shadow-card"
          : "bg-surface border-border hover:border-borderStrong"
      )}
    >
      {checked && (
        <div className="absolute inset-0 bg-brand-gradient-soft opacity-60 pointer-events-none" />
      )}
      <div className="relative flex items-start gap-3">
        {icon && (
          <span
            className={cn(
              "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition",
              checked
                ? "bg-pink/15 border-pink/30 text-pink"
                : "bg-surface2 border-border text-muted group-hover:text-text"
            )}
          >
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold leading-snug">{label}</div>
          {hint && <div className="text-xs text-text2 mt-1 leading-snug">{hint}</div>}
        </div>
        {Switch}
      </div>
    </button>
  );
}
