"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  icon?: ReactNode;
  headline: string;
  subhead?: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md";
};

/** Editorial empty state with serif italic headline and a soft glow. */
export function EmptyState({ icon, headline, subhead, action, className, size = "md" }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-surface text-center",
        size === "sm" ? "px-6 py-10" : "px-6 py-14 sm:py-20",
        className
      )}
    >
      <div className="hero-glow opacity-50" />
      <div className="relative z-10 flex flex-col items-center gap-3 max-w-sm mx-auto">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-surface2 border border-border flex items-center justify-center text-pink mb-1">
            {icon}
          </div>
        )}
        <h3 className={cn("text-display", size === "sm" ? "text-2xl" : "text-3xl sm:text-4xl")}>
          {headline}
        </h3>
        {subhead && <p className="text-sm text-text2 leading-relaxed text-balance">{subhead}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
