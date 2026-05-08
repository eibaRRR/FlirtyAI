"use client";

import { useState } from "react";
import { Send, CalendarHeart, Heart } from "lucide-react";
import { OpenerTab } from "./OpenerTab";
import { DateIdeasTab } from "./DateIdeasTab";
import { ClosureTab } from "./ClosureTab";
import type { SavedSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";

type ToolMode = "opener" | "date" | "closure";

const TOOLS: { id: ToolMode; label: string; Icon: typeof Send; tagline: string }[] = [
  {
    id: "opener",
    label: "Opener",
    Icon: Send,
    tagline: "First message that hooks.",
  },
  {
    id: "date",
    label: "Date ideas",
    Icon: CalendarHeart,
    tagline: "Plan the next meet-up.",
  },
  {
    id: "closure",
    label: "Closure",
    Icon: Heart,
    tagline: "End it kindly, end it cleanly.",
  },
];

type Props = {
  persona: string;
  settings: SavedSettings;
};

export function ToolsTab({ persona, settings }: Props) {
  const [mode, setMode] = useState<ToolMode>("opener");
  const current = TOOLS.find((t) => t.id === mode)!;

  return (
    <div className="space-y-6">
      {/* Editorial hero with tool selector */}
      <header className="relative overflow-hidden rounded-3xl border border-border bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <div className="hero-glow opacity-40" />
        <div className="relative z-10">
          <div className="text-eyebrow !text-pink mb-2">Tools</div>
          <h1 className="text-display text-3xl sm:text-4xl mb-4 text-balance">
            <span className="gradient-text">{current.tagline}</span>
          </h1>
          <div className="grid grid-cols-3 gap-1.5 bg-surface2/70 border border-border rounded-xl p-1 max-w-md">
            {TOOLS.map(({ id, label, Icon }) => {
              const active = mode === id;
              return (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition",
                    active
                      ? "bg-brand-gradient text-white shadow-cta"
                      : "text-muted hover:text-text"
                  )}
                  aria-pressed={active}
                >
                  <Icon size={14} />
                  <span className="hidden xs:inline sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div key={mode} className="animate-fade-in">
        {mode === "opener" && (
          <OpenerTab
            persona={persona}
            settings={settings}
            spicy={settings.spicyEnabled}
            model={settings.model}
          />
        )}
        {mode === "date" && <DateIdeasTab settings={settings} />}
        {mode === "closure" && <ClosureTab persona={persona} settings={settings} />}
      </div>
    </div>
  );
}
