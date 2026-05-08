"use client";

import { Flame } from "lucide-react";
import { MOOD_PRESETS, isSpicyMood, type MoodPreset } from "@/lib/schema";
import { Pill, Slider } from "@/components/ui";

type Props = {
  moods: MoodPreset[];
  setMoods: (m: MoodPreset[]) => void;
  blendMode: boolean;
  customMood: string;
  setCustomMood: (s: string) => void;
  intensity: number;
  setIntensity: (n: number) => void;
  spicyEnabled?: boolean;
};

export function MoodControls({
  moods,
  setMoods,
  blendMode,
  customMood,
  setCustomMood,
  intensity,
  setIntensity,
  spicyEnabled = false,
}: Props) {
  const regular = MOOD_PRESETS.filter((m) => !isSpicyMood(m));
  const spicy = MOOD_PRESETS.filter((m) => isSpicyMood(m));

  const toggleMood = (m: MoodPreset) => {
    if (blendMode) {
      if (moods.includes(m)) {
        if (moods.length === 1) return;
        setMoods(moods.filter((x) => x !== m));
      } else {
        if (moods.length >= 3) return;
        setMoods([...moods, m]);
      }
    } else {
      setMoods([m]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Mood chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-eyebrow">
            Mood {blendMode && <span className="text-pink not-italic">· blend up to 3</span>}
          </div>
          {blendMode && (
            <span className="text-[11px] text-muted">{moods.length}/3 selected</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {regular.map((m) => (
            <Pill key={m} selected={moods.includes(m)} onClick={() => toggleMood(m)}>
              {m}
            </Pill>
          ))}
        </div>

        {spicyEnabled && (
          <>
            <div className="flex items-center gap-2 my-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] uppercase tracking-wider text-pink font-semibold inline-flex items-center gap-1">
                <Flame size={10} /> +18 only
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-wrap gap-2">
              {spicy.map((m) => (
                <Pill
                  key={m}
                  tone="pink"
                  selected={moods.includes(m)}
                  onClick={() => toggleMood(m)}
                  leftIcon={<Flame size={11} />}
                >
                  {m}
                </Pill>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Custom note */}
      <div>
        <label className="text-eyebrow block mb-2">Custom note</label>
        <input
          type="text"
          value={customMood}
          onChange={(e) => setCustomMood(e.target.value)}
          maxLength={200}
          placeholder='e.g. "act like I don&apos;t care but actually do"'
          className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink/60 placeholder:text-muted"
        />
      </div>

      {/* Intensity */}
      <Slider
        value={intensity}
        onChange={setIntensity}
        min={1}
        max={10}
        label="Intensity"
        leftLabel="subtle"
        rightLabel="maximum"
      />
    </div>
  );
}
