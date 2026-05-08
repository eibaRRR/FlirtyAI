"use client";

import { cn } from "@/lib/utils";

/** Animated 3-dot wave used inside loading buttons. */
export function ProgressDots({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-end gap-1", className)}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full animate-dot-wave"
          style={{
            background: color,
            animationDelay: `${i * 120}ms`,
          }}
        />
      ))}
    </span>
  );
}
