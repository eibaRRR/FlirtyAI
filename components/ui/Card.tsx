"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Hover ring color */
  accent?: "none" | "pink" | "purple" | "safe" | "med" | "bold";
  /** Gradient border treatment */
  gradient?: boolean;
  /** Drop the shadow + bg, leave only the border (used for nested groups) */
  flat?: boolean;
  padded?: boolean; // adds default p-5 sm:p-6
  /** Used to make the card itself appear with a slide-up animation */
  animate?: boolean;
};

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  none: "hover:border-borderStrong",
  pink: "hover:border-pink/40",
  purple: "hover:border-purple/40",
  safe: "hover:border-safe/40",
  med: "hover:border-med/40",
  bold: "hover:border-bold/40",
};

export const Card = forwardRef<HTMLDivElement, Props>(function Card(
  {
    accent = "none",
    gradient = false,
    flat = false,
    padded = false,
    animate = false,
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border transition",
        flat
          ? "border-border bg-transparent"
          : "border-border bg-surface shadow-card",
        ACCENT[accent],
        gradient && "gradient-border bg-surface",
        padded && "p-5 sm:p-6",
        animate && "animate-slide-up",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export function CardHeader({
  eyebrow,
  title,
  trailing,
  className,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-3 mb-4", className)}>
      <div>
        {eyebrow && <div className="text-eyebrow mb-1">{eyebrow}</div>}
        {title && <h2 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h2>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
