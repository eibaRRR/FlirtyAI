"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Command,
  Search,
  Sparkles,
  Flame,
  Wrench,
  Wand2,
  MessageSquare,
  Bookmark,
  Clock,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Monitor,
  Zap,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tab } from "./Sidebar";
import { useTheme, type ThemeMode } from "@/lib/theme";
import type { SavedSettings } from "@/lib/storage";

type Action = {
  id: string;
  label: string;
  hint?: string;
  Icon: typeof Sparkles;
  group: "Navigate" | "Workspace" | "Theme" | "Settings";
  shortcut?: string;
  run: () => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onTab: (t: Tab) => void;
  onOpenSaved: () => void;
  onOpenHistory: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  settings: SavedSettings;
  toggleSpicy: (v: boolean) => void;
};

export function CommandPalette({
  open,
  onClose,
  onTab,
  onOpenSaved,
  onOpenHistory,
  onOpenStats,
  onOpenSettings,
  settings,
  toggleSpicy,
}: Props) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setTheme] = useTheme();

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
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

  const setT = (t: ThemeMode) => setTheme(t);

  const actions: Action[] = useMemo(
    () => [
      // Navigate
      { id: "nav-suggest", label: "Go to Suggest", Icon: Sparkles, group: "Navigate", run: () => onTab("suggest") },
      { id: "nav-roast", label: "Go to Roast", Icon: Flame, group: "Navigate", run: () => onTab("roast") },
      { id: "nav-tools", label: "Go to Tools", Icon: Wrench, group: "Navigate", run: () => onTab("tools") },
      { id: "nav-bio", label: "Go to Bio", Icon: Wand2, group: "Navigate", run: () => onTab("bio") },
      { id: "nav-wing", label: "Go to Wing", Icon: MessageSquare, group: "Navigate", run: () => onTab("wing") },

      // Workspace
      { id: "ws-saved", label: "Open Saved replies", Icon: Bookmark, group: "Workspace", run: onOpenSaved },
      { id: "ws-history", label: "Open History", Icon: Clock, group: "Workspace", run: onOpenHistory },
      { id: "ws-stats", label: "Open Reply stats", Icon: BarChart3, group: "Workspace", run: onOpenStats },

      // Theme
      { id: "theme-dark", label: "Switch to Dark theme", Icon: Moon, group: "Theme", run: () => setT("dark") },
      { id: "theme-light", label: "Switch to Light theme", Icon: Sun, group: "Theme", run: () => setT("light") },
      { id: "theme-system", label: "Use System theme", Icon: Monitor, group: "Theme", run: () => setT("system") },

      // Settings
      { id: "set-open", label: "Open Settings", Icon: Settings, group: "Settings", run: onOpenSettings },
      {
        id: "set-spicy",
        label: settings.spicyEnabled ? "Disable Spicy mode" : "Enable Spicy mode (+18)",
        hint: settings.spicyEnabled ? "Currently ON" : "Requires you to be 18+",
        Icon: Zap,
        group: "Settings",
        run: () => toggleSpicy(!settings.spicyEnabled),
      },
    ],
    // setT is stable from useTheme; suppress dep lint
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onTab, onOpenSaved, onOpenHistory, onOpenStats, onOpenSettings, settings.spicyEnabled, toggleSpicy]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(needle) ||
        a.group.toLowerCase().includes(needle) ||
        a.hint?.toLowerCase().includes(needle)
    );
  }, [actions, q]);

  // Keep active index in range when filter changes
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  const grouped = useMemo(() => {
    const m = new Map<Action["group"], Action[]>();
    filtered.forEach((a) => {
      const arr = m.get(a.group) ?? [];
      arr.push(a);
      m.set(a.group, arr);
    });
    return Array.from(m.entries());
  }, [filtered]);

  const run = (a: Action) => {
    a.run();
    onClose();
  };

  if (!open) return null;

  // Build flat array for keyboard nav
  const flatIds = filtered.map((a) => a.id);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-in"
      />
      <div className="absolute inset-0 flex items-start justify-center px-4 pt-[12vh]">
        <div className="w-full max-w-xl bg-surface/95 backdrop-blur-xl border border-border rounded-2xl shadow-pop overflow-hidden animate-scale-in">
          <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
            <Search size={16} className="text-muted shrink-0" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search actions, tabs, settings…"
              className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, flatIds.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const a = filtered[active];
                  if (a) run(a);
                }
              }}
            />
            <kbd className="text-[10px] font-mono bg-surface2 border border-border rounded px-1.5 py-0.5 text-muted">
              ESC
            </kbd>
          </div>
          <div className="max-h-[52vh] overflow-y-auto py-2">
            {grouped.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted">
                No actions match &ldquo;{q}&rdquo;.
              </div>
            )}
            {grouped.map(([group, list]) => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="px-4 pt-2 pb-1 text-eyebrow">{group}</div>
                {list.map((a) => {
                  const idx = flatIds.indexOf(a.id);
                  const isActive = idx === active;
                  return (
                    <button
                      key={a.id}
                      onClick={() => run(a)}
                      onMouseEnter={() => setActive(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition",
                        isActive ? "bg-surface2" : "hover:bg-surface2/60"
                      )}
                    >
                      <a.Icon size={15} className={cn(isActive ? "text-pink" : "text-muted")} />
                      <span className="flex-1">
                        {a.label}
                        {a.hint && <span className="text-muted ml-2 text-xs">· {a.hint}</span>}
                      </span>
                      {isActive && <CornerDownLeft size={13} className="text-muted" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="px-4 h-9 border-t border-border flex items-center justify-between text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Command size={12} /> palette
            </span>
            <span className="inline-flex items-center gap-3">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
