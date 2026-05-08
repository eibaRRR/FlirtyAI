"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ProgressDots } from "./ProgressDots";

export type ButtonVariant =
  | "primary"   // gradient hero
  | "solid"     // filled neutral
  | "ghost"     // text + hover bg
  | "outline"   // bordered neutral
  | "danger";   // destructive

export type ButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

const SIZE_CLS: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 text-[15px] gap-2 rounded-xl",
};

const VARIANT_CLS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-gradient text-white shadow-cta hover:brightness-110 active:scale-[0.98] " +
    "bg-[length:200%_200%] hover:animate-gradient-shift",
  solid:
    "bg-surface2 text-text border border-border hover:border-borderStrong active:scale-[0.98]",
  ghost:
    "bg-transparent text-text hover:bg-surface2 active:scale-[0.98]",
  outline:
    "bg-transparent text-text border border-border hover:border-pink/60 hover:bg-surface2 active:scale-[0.98]",
  danger:
    "bg-bold text-white hover:brightness-110 active:scale-[0.98]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "solid",
    size = "md",
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium whitespace-nowrap select-none",
        "transition-[transform,filter,background-color,border-color,opacity] duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        SIZE_CLS[size],
        VARIANT_CLS[variant],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? (
        <ProgressDots
          color={variant === "primary" || variant === "danger" ? "white" : "currentColor"}
        />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});
