"use client";

import { useState } from "react";
import { Send, CalendarHeart, Heart } from "lucide-react";
import { OpenerTab } from "./OpenerTab";
import { DateIdeasTab } from "./DateIdeasTab";
import { ClosureTab } from "./ClosureTab";
import type { SavedSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";

type ToolMode = "opener" | "date" | "closure";

const TOOLS: { id: ToolMode; label: string; Icon: typeof Send; blurb: string }[] = [
  {
    id: "opener",
    label: "Opener",
    Icon: Send,
    blurb: "First-message generator from a bio.",
  },
  {
    id: "date",
    label: "Date ideas",
    Icon: CalendarHeart,
    blurb: "Plan the next meet-up with ready-to-send pitches.",
  },
  {
    id: "closure",
    label: "Closure",
    Icon: Heart,
    blurb: "End things cleanly, kindly, and on your terms.",
  },
];

type Props = {
  persona: string;
  settings: SavedSettings;
};

export function ToolsTab({ persona, settings }: Props) {
  const [mode, setMode] = useState<ToolMode>("opener");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 bg-panel border border-border rounded-2xl p-1">
        {TOOLS.map(({ id, label, Icon }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition",
                active
                  ? "bg-brand-gradient text-white shadow-lg shadow-pink/20"
                  : "text-muted hover:text-text"
              )}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-muted -mt-2">
        {TOOLS.find((t) => t.id === mode)?.blurb}
      </div>

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
  );
}
