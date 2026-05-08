"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = false,
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Recalc indicator position when value or layout changes
  useEffect(() => {
    const recalc = () => {
      const el = containerRef.current;
      if (!el) return;
      const idx = options.findIndex((o) => o.value === value);
      const btn = el.querySelectorAll<HTMLButtonElement>("[data-seg-btn]")[idx];
      if (!btn) return;
      const containerRect = el.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex bg-surface2 border border-border rounded-xl p-1",
        fullWidth && "w-full"
      )}
    >
      {indicator && (
        <span
          className="absolute top-1 bottom-1 rounded-lg bg-brand-gradient shadow-glow transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-events-none"
          style={{ left: indicator.left, width: indicator.width }}
          aria-hidden="true"
        />
      )}
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            data-seg-btn
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn(
              "relative z-[1] rounded-lg transition-colors duration-200 font-medium whitespace-nowrap",
              fullWidth && "flex-1",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
              active ? "text-white" : "text-muted hover:text-text"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
