"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  tone?: "default" | "pink" | "danger" | "muted";
  icon: ReactNode;
  /** Required for accessibility — icon-only buttons must have an aria-label */
  "aria-label": string;
};

const SIZE_CLS = {
  sm: "w-7 h-7 [&>svg]:w-3.5 [&>svg]:h-3.5",
  md: "w-9 h-9 [&>svg]:w-4 [&>svg]:h-4",
  lg: "w-10 h-10 [&>svg]:w-[18px] [&>svg]:h-[18px]",
};

const TONE_CLS = {
  default:
    "text-muted hover:text-text hover:bg-surface2 border-transparent",
  pink:
    "text-pink hover:bg-pink/10 border-transparent",
  danger:
    "text-bold hover:bg-bold/10 border-transparent",
  muted:
    "text-muted hover:text-text hover:bg-surface2 border-transparent",
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { size = "md", tone = "default", icon, className, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border transition active:scale-95 disabled:opacity-50",
        SIZE_CLS[size],
        TONE_CLS[tone],
        className
      )}
      {...rest}
    >
      {icon}
    </button>
  );
});
