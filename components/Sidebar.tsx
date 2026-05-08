"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Flame,
  Wrench,
  Wand2,
  MessageSquare,
  Bookmark,
  Clock,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type Tab = "suggest" | "roast" | "tools" | "bio" | "wing";

export const SIDEBAR_TABS: { id: Tab; label: string; Icon: typeof Sparkles; hint: string }[] = [
  { id: "suggest", label: "Suggest", Icon: Sparkles, hint: "Reply suggestions" },
  { id: "roast", label: "Roast", Icon: Flame, hint: "Score your last message" },
  { id: "tools", label: "Tools", Icon: Wrench, hint: "Openers · dates · closure" },
  { id: "bio", label: "Bio", Icon: Wand2, hint: "Rewrite your dating bio" },
  { id: "wing", label: "Wing", Icon: MessageSquare, hint: "Chat with your wingperson" },
];

type Props = {
  tab: Tab;
  onTab: (t: Tab) => void;
  savedCount: number;
  historyCount: number;
  statsCount: number;
  onOpenSaved: () => void;
  onOpenHistory: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenCommand: () => void;
  spicyEnabled: boolean;
};

export function Sidebar({
  tab,
  onTab,
  savedCount,
  historyCount,
  statsCount,
  onOpenSaved,
  onOpenHistory,
  onOpenStats,
  onOpenSettings,
  onOpenCommand,
  spicyEnabled,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useTheme();

  // Persist collapsed state
  useEffect(() => {
    const stored = localStorage.getItem("flirtyai.sidebar.collapsed");
    if (stored === "1") setCollapsed(true);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("flirtyai.sidebar.collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const cycleTheme = () => {
    setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark");
  };

  return (
    <aside
      className={cn(
        "hidden md:flex sticky top-0 h-screen flex-col border-r border-border bg-bg/60 backdrop-blur-xl transition-[width] duration-200",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
      aria-label="Primary"
    >
      {/* Brand */}
      <div className={cn("flex items-center px-4 pt-5 pb-6", collapsed && "justify-center")}>
        <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-cta shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="ml-2.5">
            <div className="font-bold text-base leading-tight tracking-tight">
              <span className="gradient-text">FlirtyAI</span>
            </div>
            <div className="text-[11px] text-muted leading-tight">your AI wingperson</div>
          </div>
        )}
      </div>

      {/* Command palette trigger */}
      <button
        onClick={onOpenCommand}
        className={cn(
          "mx-3 mb-4 inline-flex items-center gap-2 rounded-xl border border-border bg-surface text-muted hover:text-text hover:border-borderStrong transition px-3 h-9 text-sm",
          collapsed && "justify-center px-0"
        )}
        title="Command palette (⌘K)"
        aria-label="Open command palette"
      >
        <Command size={14} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">Search…</span>
            <kbd className="text-[10px] font-mono bg-surface2 border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </>
        )}
      </button>

      {/* Tabs */}
      <nav className="px-2 flex flex-col gap-0.5">
        {SIDEBAR_TABS.map(({ id, label, Icon, hint }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onTab(id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 h-10 transition text-sm",
                active
                  ? "bg-surface text-text shadow-card"
                  : "text-text2 hover:text-text hover:bg-surface2/60"
              )}
              aria-current={active ? "page" : undefined}
              title={collapsed ? `${label} — ${hint}` : undefined}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-brand-gradient" />
              )}
              <Icon
                size={17}
                className={cn("shrink-0", active ? "text-pink" : "text-muted group-hover:text-text")}
              />
              {!collapsed && <span className="font-medium">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Workspace section */}
      {!collapsed && (
        <div className="px-5 mt-7 mb-2 text-eyebrow">Workspace</div>
      )}
      <nav className="px-2 flex flex-col gap-0.5">
        {[
          {
            label: "Saved",
            Icon: Bookmark,
            onClick: onOpenSaved,
            badge: savedCount,
            tone: "pink",
          },
          {
            label: "History",
            Icon: Clock,
            onClick: onOpenHistory,
            badge: historyCount,
            tone: "purple",
          },
          {
            label: "Stats",
            Icon: BarChart3,
            onClick: onOpenStats,
            badge: statsCount,
            tone: "purple",
          },
        ].map(({ label, Icon, onClick, badge, tone }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 h-9 transition text-sm",
              "text-text2 hover:text-text hover:bg-surface2/60"
            )}
            title={collapsed ? label : undefined}
          >
            <Icon size={16} className="shrink-0 text-muted group-hover:text-text" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{label}</span>
                {badge > 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold rounded-full px-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center bg-surface2 border border-border",
                      tone === "pink" ? "text-pink" : "text-purple"
                    )}
                  >
                    {Math.min(99, badge)}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-3 flex flex-col gap-1.5">
        <button
          onClick={cycleTheme}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 h-9 transition text-sm text-text2 hover:text-text hover:bg-surface2/60",
            collapsed && "justify-center"
          )}
          title={`Theme: ${theme}`}
          aria-label={`Theme: ${theme}`}
        >
          <ThemeIcon size={16} className="text-muted group-hover:text-text" />
          {!collapsed && <span className="capitalize">{theme}</span>}
        </button>
        <button
          onClick={onOpenSettings}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 h-9 transition text-sm text-text2 hover:text-text hover:bg-surface2/60",
            collapsed && "justify-center"
          )}
          aria-label="Settings"
        >
          <Settings size={16} className="text-muted group-hover:text-text" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Settings</span>
              {spicyEnabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
              )}
            </>
          )}
        </button>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="group flex items-center gap-3 rounded-xl px-3 h-9 transition text-sm text-muted hover:text-text hover:bg-surface2/60"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
