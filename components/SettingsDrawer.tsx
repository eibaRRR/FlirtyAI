"use client";

import { useState } from "react";
import { Flame, Cpu, Zap, Heart, Sun, Moon, Monitor, Download, Check } from "lucide-react";
import { Drawer } from "./Drawer";
import { Toggle } from "./Toggle";
import { Segmented } from "./Segmented";
import { useToast } from "./Toaster";
import { useTheme, type ThemeMode } from "@/lib/theme";
import { useInstallPrompt } from "@/lib/pwa";
import {
  LANGUAGES,
  LANGUAGE_LABELS,
  LENGTHS,
  LENGTH_LABELS,
  type Length,
  type Language,
} from "@/lib/schema";
import type { SavedSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  persona: string;
  setPersona: (v: string) => void;
  settings: SavedSettings;
  updateSettings: (v: Partial<SavedSettings>) => void;
};

const THEME_OPTIONS: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
];

export function SettingsDrawer({
  open,
  onClose,
  persona,
  setPersona,
  settings,
  updateSettings,
}: Props) {
  const [showAdultModal, setShowAdultModal] = useState(false);
  const [theme, setTheme] = useTheme();
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const { toast } = useToast();

  const onToggleSpicy = (v: boolean) => {
    if (v && !settings.spicyAcknowledged) {
      setShowAdultModal(true);
      return;
    }
    updateSettings({ spicyEnabled: v });
    toast(v ? "Spicy mode enabled 🔥" : "Spicy mode disabled", v ? "success" : "info");
  };

  const confirmAdult = () => {
    updateSettings({ spicyEnabled: true, spicyAcknowledged: true });
    setShowAdultModal(false);
    toast("Spicy mode enabled 🔥", "success");
  };

  const onInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === "accepted") toast("FlirtyAI installed!", "success");
    else if (outcome === "dismissed") toast("Install dismissed", "info");
    else toast("Install not available — try your browser's menu", "info");
  };

  return (
    <Drawer open={open} onClose={onClose} title="Settings">
      <div className="space-y-7">
        {/* Theme picker (#23) */}
        <section>
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <Sun size={14} /> Appearance
          </h3>
          <p className="text-xs text-muted mb-3">Light, dark, or follow system.</p>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map(({ value, label, Icon }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={cn(
                    "rounded-xl border px-3 py-3 transition flex flex-col items-center gap-1.5 text-xs font-medium",
                    active
                      ? "bg-pink/10 border-pink/40 text-text"
                      : "bg-panel border-border text-muted hover:border-purple/40"
                  )}
                >
                  <Icon size={16} className={active ? "text-pink" : ""} />
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* PWA install (#21) */}
        {(canInstall || installed) && (
          <section>
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Download size={14} /> Install FlirtyAI
            </h3>
            <p className="text-xs text-muted mb-3">
              {installed
                ? "Installed as an app — open it from your home screen."
                : "Add to home screen for one-tap access and a focused, full-screen experience."}
            </p>
            {installed ? (
              <div className="flex items-center gap-2 text-sm text-safe">
                <Check size={16} /> Installed
              </div>
            ) : (
              <button
                type="button"
                onClick={onInstall}
                className="w-full bg-brand-gradient text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Download size={15} /> Install app
              </button>
            )}
          </section>
        )}

        {/* Model picker */}
        <section>
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <Cpu size={14} /> AI model
          </h3>
          <p className="text-xs text-muted mb-3">
            Choose speed vs depth. Both support vision and Darija.
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => updateSettings({ model: "maverick" })}
              className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                settings.model === "maverick"
                  ? "bg-pink/10 border-pink/40"
                  : "bg-panel border-border hover:border-purple/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium flex items-center gap-2">
                  <Zap size={14} className="text-pink" /> Llama 4 Maverick
                </div>
                <span className="text-[10px] uppercase tracking-wider text-pink font-bold bg-pink/15 px-2 py-0.5 rounded-full">
                  Fast
                </span>
              </div>
              <div className="text-xs text-muted">
                ~1-3s · balanced quality · moderate alignment
              </div>
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ model: "kimi" })}
              className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                settings.model === "kimi"
                  ? "bg-pink/10 border-pink/40"
                  : "bg-panel border-border hover:border-purple/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium flex items-center gap-2">
                  <Heart size={14} className="text-purple" /> Kimi K2.6
                </div>
                <span className="text-[10px] uppercase tracking-wider text-purple font-bold bg-purple/15 px-2 py-0.5 rounded-full">
                  Quality
                </span>
              </div>
              <div className="text-xs text-muted">
                ~3-8s · richer creative · best for spicy / Darija
              </div>
            </button>
          </div>
        </section>

        {/* Persona */}
        <section>
          <h3 className="text-sm font-semibold mb-1">Your texting persona</h3>
          <p className="text-xs text-muted mb-3">
            Describe how YOU normally text so suggestions match your voice. Saved on this device.
          </p>
          <textarea
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            maxLength={500}
            rows={5}
            placeholder='e.g. "dry humor, lowercase only, almost never use emojis, short messages, slightly sarcastic"'
            className="w-full bg-panel border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple resize-none"
          />
          <div className="text-right text-xs text-muted mt-1">{persona.length}/500</div>
        </section>

        {/* Defaults */}
        <section>
          <h3 className="text-sm font-semibold mb-3">Defaults</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted block mb-2">Default language</label>
              <Segmented<Language>
                size="sm"
                options={LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_LABELS[l] }))}
                value={settings.defaultLanguage}
                onChange={(v) => updateSettings({ defaultLanguage: v })}
              />
            </div>
            <div>
              <label className="text-xs text-muted block mb-2">Default reply length</label>
              <Segmented<Length>
                options={LENGTHS.map((l) => ({ value: l, label: LENGTH_LABELS[l] }))}
                value={settings.defaultLength}
                onChange={(v) => updateSettings({ defaultLength: v })}
              />
            </div>
          </div>
        </section>

        {/* Adult mode */}
        <section>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Flame size={14} className="text-pink" /> Adult / +18 mode
          </h3>
          <div className={settings.spicyEnabled ? "ring-2 ring-pink/40 rounded-xl" : ""}>
            <Toggle
              label={settings.spicyEnabled ? "Spicy mode is ON 🔥" : "Enable spicy mode"}
              hint="Unlocks explicit, NSFW, suggestive replies and spicy moods (Dominant, Submissive, Teasing…). Hard limits stay (no minors, no non-consent, no slurs)."
              checked={settings.spicyEnabled}
              onChange={onToggleSpicy}
            />
          </div>
          {settings.spicyEnabled && settings.model === "maverick" && (
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Tip: Maverick is moderate on explicit content. For fully unfiltered output, switch to
              <button
                onClick={() => updateSettings({ model: "kimi" })}
                className="text-pink hover:underline ml-1"
              >
                Kimi K2.6
              </button>{" "}
              above.
            </p>
          )}
        </section>

        {/* Advanced toggles */}
        <section>
          <h3 className="text-sm font-semibold mb-3">Advanced (default state)</h3>
          <div className="space-y-2">
            <Toggle
              label="Multi-message mode"
              hint="Generate 2-3 chained messages (double-text style) by default"
              checked={settings.defaultMultiMessage}
              onChange={(v) => updateSettings({ defaultMultiMessage: v })}
            />
            <Toggle
              label="Mood blend"
              hint="Allow selecting up to 3 moods at once and blend their energies"
              checked={settings.defaultBlend}
              onChange={(v) => updateSettings({ defaultBlend: v })}
            />
            <Toggle
              label="Compare moods"
              hint="When 2+ moods are picked, generate side-by-side groups"
              checked={settings.defaultCompare}
              onChange={(v) => updateSettings({ defaultCompare: v })}
            />
          </div>
        </section>
      </div>

      {/* Adult-mode confirmation modal */}
      {showAdultModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80">
          <div className="bg-panel border border-pink/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-pink font-semibold mb-3">
              <Flame size={18} /> Enable adult mode
            </div>
            <p className="text-sm leading-relaxed mb-2">
              Spicy mode unlocks explicit, NSFW, sexual reply suggestions. By turning this on you
              confirm:
            </p>
            <ul className="text-sm text-muted space-y-1 mb-4 list-disc list-inside">
              <li>You are <b className="text-text">18 years or older</b>.</li>
              <li>Both you and the person you&apos;re texting are consenting adults.</li>
              <li>You won&apos;t use it to harass anyone.</li>
            </ul>
            <p className="text-xs text-muted mb-5">
              Hard limits stay: no minors, no non-consent, no slurs, no threats. Ever.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdultModal(false)}
                className="flex-1 bg-panel2 border border-border rounded-xl py-2.5 text-sm hover:border-purple/40 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAdult}
                className="flex-1 bg-brand-gradient text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 transition"
              >
                I&apos;m 18+, enable
              </button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
