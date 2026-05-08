"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "right" | "left";
};

export function Drawer({ open, onClose, title, children, side = "right" }: Props) {
  // Keep mounted briefly during exit so the close animation can play
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
    else {
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const exiting = !open;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        exiting ? "pointer-events-none" : "pointer-events-auto"
      )}
      aria-hidden={exiting}
    >
      {/* Backdrop with blur */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200",
          exiting ? "opacity-0" : "opacity-100 animate-backdrop-in"
        )}
      />

      {/* Sheet / drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          // Mobile: bottom sheet
          "absolute left-0 right-0 bottom-0 max-h-[92vh] sm:max-h-none rounded-t-3xl sm:rounded-none",
          // Desktop: side drawer
          "sm:top-0 sm:bottom-0 sm:w-[420px] sm:max-w-[92vw] sm:rounded-none",
          side === "right" ? "sm:right-0 sm:left-auto sm:border-l" : "sm:left-0 sm:right-auto sm:border-r",
          "bg-bg/95 backdrop-blur-xl border-t border-border sm:border-t-0 flex flex-col shadow-[var(--shadow-pop)]",
          // animations
          exiting
            ? "opacity-0 transition-all duration-200 sm:translate-x-full"
            : "sm:hidden-bug-fix animate-sheet-up-in sm:animate-none",
          !exiting && side === "right" ? "sm:animate-drawer-right-in" : "",
          !exiting && side === "left" ? "sm:animate-drawer-left-in" : ""
        )}
      >
        {/* Mobile grab handle */}
        <div className="sm:hidden pt-2.5 flex justify-center">
          <div className="w-10 h-1.5 bg-border rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pt-3 pb-3 sm:py-4 border-b border-border">
          <h2 className="font-semibold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition rounded-full p-1.5 hover:bg-panel"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8 sm:pb-5 pb-safe overscroll-contain">
          {children}
        </div>
      </aside>
    </div>
  );
}
