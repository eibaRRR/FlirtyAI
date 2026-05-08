"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  size?: "sm" | "md";
  tone?: "default" | "pink" | "purple" | "safe" | "med" | "bold";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const SIZES = {
  sm: "h-7 px-2.5 text-xs gap-1",
  md: "h-9 px-3.5 text-sm gap-1.5",
};

const TONE_SELECTED: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-brand-gradient text-white border-transparent shadow-glow",
  pink: "bg-pink text-white border-transparent shadow-glow",
  purple: "bg-purple/20 text-purple border-purple/40",
  safe: "bg-safe/20 text-safe border-safe/40",
  med: "bg-med/20 text-med border-med/40",
  bold: "bg-bold/20 text-bold border-bold/40",
};

const TONE_IDLE = "bg-surface2 border-border text-text2 hover:border-borderStrong hover:text-text";

export const Pill = forwardRef<HTMLButtonElement, Props>(function Pill(
  { selected = false, size = "md", tone = "default", leftIcon, rightIcon, className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-medium transition select-none whitespace-nowrap",
        "active:scale-95",
        SIZES[size],
        selected ? TONE_SELECTED[tone] : TONE_IDLE,
        className
      )}
      {...rest}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});
