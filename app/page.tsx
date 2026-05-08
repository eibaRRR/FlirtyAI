"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Settings,
  Flame,
  Wrench,
  Wand2,
  MessageSquare,
  Bookmark,
  Clock,
  BarChart3,
  Command,
} from "lucide-react";
import { SuggestTab } from "@/components/SuggestTab";
import { RoastTab } from "@/components/RoastTab";
import { WingChat } from "@/components/WingChat";
import { ToolsTab } from "@/components/ToolsTab";
import { BioTab } from "@/components/BioTab";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { SavedDrawer } from "@/components/SavedDrawer";
import { StatsDrawer } from "@/components/StatsDrawer";
import { OverflowMenu, type OverflowItem } from "@/components/OverflowMenu";
import { Sidebar, SIDEBAR_TABS, type Tab } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { usePersona, useSettings, useHistory, useSaved, useStats } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function Home() {
  const [tab, setTab] = useState<Tab>("suggest");
  const [persona, setPersona] = usePersona();
  const [settings, updateSettings] = useSettings();
  const { history, add, remove, clear } = useHistory();
  const { items: savedItems } = useSaved();
  const { stats } = useStats();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K / Ctrl-K to open the command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const overflowItems: OverflowItem[] = [
    { label: "Saved replies", Icon: Bookmark, onClick: () => setSavedOpen(true), badge: savedItems.length, accent: "pink" },
    { label: "History", Icon: Clock, onClick: () => setHistoryOpen(true), badge: history.length, accent: "pink" },
    { label: "Reply stats", Icon: BarChart3, onClick: () => setStatsOpen(true), badge: stats.entries.length, accent: "purple" },
  ];

  const currentTab = SIDEBAR_TABS.find((t) => t.id === tab)!;
  const TabIcon = currentTab.Icon;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar
        tab={tab}
        onTab={setTab}
        savedCount={savedItems.length}
        historyCount={history.length}
        statsCount={stats.entries.length}
        onOpenSaved={() => setSavedOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenStats={() => setStatsOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenCommand={() => setPaletteOpen(true)}
        spicyEnabled={settings.spicyEnabled}
      />

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar (sticky, blurred) */}
        <header className="md:hidden sticky top-0 z-30 px-4 pt-3 pb-3 bg-bg/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-cta">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-base leading-tight tracking-tight">
                  <span className="gradient-text">FlirtyAI</span>
                </div>
                <div className="text-[11px] text-muted leading-tight">your AI wingperson</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPaletteOpen(true)}
                className="p-2.5 rounded-xl bg-surface border border-border hover:border-borderStrong transition"
                aria-label="Command palette"
              >
                <Command size={16} />
              </button>
              <OverflowMenu items={overflowItems} />
              <button
                onClick={() => setSettingsOpen(true)}
                className={cn(
                  "p-2.5 rounded-xl bg-surface border transition relative",
                  settings.spicyEnabled
                    ? "border-pink/50 hover:border-pink"
                    : "border-border hover:border-borderStrong"
                )}
                aria-label="Settings"
              >
                <Settings size={16} />
                {settings.spicyEnabled && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Active section eyebrow on mobile */}
        <div className="md:hidden mt-4 px-4 flex items-center gap-2">
          <TabIcon size={13} className="text-pink" />
          <span className="text-eyebrow !text-text">{currentTab.label}</span>
          <span className="text-[11px] text-muted">· {currentTab.hint}</span>
        </div>

        {/* Tab content — centered, max-width column */}
        <main className="flex-1 px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-10 pb-safe-plus md:pb-12">
          <div key={tab} className="mx-auto max-w-[720px] animate-slide-up">
            {tab === "suggest" && (
              <SuggestTab persona={persona} settings={settings} saveToHistory={add} />
            )}
            {tab === "roast" && (
              <RoastTab
                persona={persona}
                defaultLanguage={settings.defaultLanguage}
                spicy={settings.spicyEnabled}
                model={settings.model}
              />
            )}
            {tab === "tools" && <ToolsTab persona={persona} settings={settings} />}
            {tab === "bio" && <BioTab settings={settings} model={settings.model} />}
            {tab === "wing" && (
              <WingChat
                persona={persona}
                defaultLanguage={settings.defaultLanguage}
                spicy={settings.spicyEnabled}
                model={settings.model}
              />
            )}
          </div>
        </main>

        <footer className="hidden md:block py-6 text-center text-[11px] text-muted">
          Screenshots are processed in real-time and never stored on the server.
        </footer>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg/85 backdrop-blur-xl border-t border-border pb-safe"
        aria-label="Primary"
      >
        <div className="grid grid-cols-5">
          {SIDEBAR_TABS.map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 transition relative",
                  active ? "text-pink" : "text-muted"
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <span className="absolute top-0 inset-x-6 h-0.5 bg-brand-gradient rounded-full animate-fade-in" />
                )}
                <Icon size={18} />
                <span className={cn("text-[10px] font-medium", active && "text-text")}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Drawers */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        persona={persona}
        setPersona={setPersona}
        settings={settings}
        updateSettings={updateSettings}
      />
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={history}
        onRemove={remove}
        onClear={clear}
      />
      <SavedDrawer open={savedOpen} onClose={() => setSavedOpen(false)} />
      <StatsDrawer open={statsOpen} onClose={() => setStatsOpen(false)} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onTab={setTab}
        onOpenSaved={() => setSavedOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenStats={() => setStatsOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        settings={settings}
        toggleSpicy={(v) =>
          updateSettings({
            spicyEnabled: v,
            spicyAcknowledged: v ? true : settings.spicyAcknowledged,
          })
        }
      />
    </div>
  );
}
