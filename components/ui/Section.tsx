"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title?: string;
  hint?: string;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Tighten or remove inner padding */
  bare?: boolean;
};

/** Sectioned group for forms — eyebrow label + optional title + content. */
export function Section({ eyebrow, title, hint, trailing, children, className, bare = false }: Props) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-card",
        bare ? "p-0" : "p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <div className="text-eyebrow">{eyebrow}</div>
          {title && (
            <h3 className="text-base font-semibold tracking-tight mt-0.5">{title}</h3>
          )}
          {hint && <div className="text-xs text-text2 mt-1">{hint}</div>}
        </div>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
      {children}
    </section>
  );
}
