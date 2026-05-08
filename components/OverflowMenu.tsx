"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type OverflowItem = {
  label: string;
  Icon: typeof MoreHorizontal;
  onClick: () => void;
  badge?: number;
  /** Tint icon/badge color */
  accent?: "pink" | "purple";
};

type Props = {
  items: OverflowItem[];
  className?: string;
};

export function OverflowMenu({ items, className }: Props) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const totalBadge = items.reduce((sum, it) => sum + (it.badge ?? 0), 0);

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="p-2.5 rounded-xl bg-panel border border-border hover:border-purple/60 transition relative"
        title="More"
      >
        <MoreHorizontal size={16} />
        {totalBadge > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
            {Math.min(99, totalBadge)}
          </span>
        )}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-panel/95 backdrop-blur-xl border border-border rounded-2xl shadow-[var(--shadow-pop)] overflow-hidden z-40 animate-scale-in origin-top-right"
        >
          {items.map((it) => {
            const accentCls =
              it.accent === "purple" ? "text-purple" : "text-pink";
            return (
              <button
                key={it.label}
                role="menuitem"
                onClick={() => {
                  it.onClick();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-panel2 transition text-left"
              >
                <it.Icon size={15} className="text-muted" />
                <span className="flex-1">{it.label}</span>
                {it.badge ? (
                  <span
                    className={cn(
                      "text-[10px] font-semibold rounded-full px-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center bg-panel2 border border-border",
                      accentCls
                    )}
                  >
                    {Math.min(99, it.badge)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
