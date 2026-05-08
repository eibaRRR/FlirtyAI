"use client";

import { cloneElement, useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  side?: "top" | "bottom";
  children: ReactElement;
  className?: string;
};

/** Lightweight tooltip — pointer-only, 200ms delay, fades in. */
export function Tooltip({ label, side = "top", children, className }: Props) {
  const [open, setOpen] = useState(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const onEnter = () => {
    timer = setTimeout(() => setOpen(true), 200);
  };
  const onLeave = () => {
    if (timer) clearTimeout(timer);
    setOpen(false);
  };

  const child = cloneElement(
    children as ReactElement<Record<string, unknown>>,
    {
      onMouseEnter: onEnter,
      onMouseLeave: onLeave,
      onFocus: () => setOpen(true),
      onBlur: () => setOpen(false),
    }
  );

  return (
    <span className={cn("relative inline-flex", className)}>
      {child}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 -translate-x-1/2 z-50",
            "bg-surface3 text-text text-xs px-2 py-1 rounded-md border border-border whitespace-nowrap",
            "shadow-pop animate-fade-in",
            side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
