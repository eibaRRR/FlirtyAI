"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  hint?: string;
  /** Show tick labels at min/mid/max */
  ticks?: boolean;
  className?: string;
  formatValue?: (n: number) => string;
  leftLabel?: string;
  rightLabel?: string;
};

export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  label,
  hint,
  ticks = false,
  className,
  formatValue,
  leftLabel,
  rightLabel,
}: Props) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      {(label || hint) && (
        <div className="flex items-center justify-between mb-2">
          <label htmlFor={id} className="text-sm text-text2">
            {label}
            {hint && <span className="text-muted ml-1">· {hint}</span>}
          </label>
          <span className="font-mono text-sm font-semibold gradient-text tabular-nums">
            {formatValue ? formatValue(value) : `${value}/${max}`}
          </span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-surface2" />
        {/* Filled portion */}
        <div
          className="absolute left-0 h-1.5 rounded-full bg-brand-gradient pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        {/* Thumb glow */}
        <div
          className="absolute w-4 h-4 rounded-full bg-pink shadow-[0_0_0_4px_rgb(var(--c-pink)/0.18)] pointer-events-none transition-[left] duration-100"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-6 opacity-0 cursor-pointer z-10"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      {(ticks || leftLabel || rightLabel) && (
        <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted mt-1.5">
          <span>{leftLabel ?? min}</span>
          {ticks && <span>{Math.round((min + max) / 2)}</span>}
          <span>{rightLabel ?? max}</span>
        </div>
      )}
    </div>
  );
}
