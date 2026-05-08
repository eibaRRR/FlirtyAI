"use client";

import { useEffect, useState } from "react";
import type { Analysis, Reply, MoodPreset, Language, Length, Risk } from "./schema";

const PERSONA_KEY = "flirtyai.persona.v1";
const HISTORY_KEY = "flirtyai.history.v1";
const SETTINGS_KEY = "flirtyai.settings.v1";
const SAVED_KEY = "flirtyai.saved.v1";
const STATS_KEY = "flirtyai.stats.v1";

export type ModelChoice = "maverick" | "kimi";

export type SavedSettings = {
  defaultLanguage: Language;
  defaultLength: Length;
  defaultMultiMessage: boolean;
  defaultBlend: boolean;
  defaultCompare: boolean;
  spicyEnabled: boolean;        // master +18 toggle
  spicyAcknowledged: boolean;   // user has confirmed they're 18+
  model: ModelChoice;           // which model preset to use
};

export const DEFAULT_SETTINGS: SavedSettings = {
  defaultLanguage: "auto",
  defaultLength: "medium",
  defaultMultiMessage: false,
  defaultBlend: false,
  defaultCompare: false,
  spicyEnabled: false,
  spicyAcknowledged: false,
  model: "maverick",
};

export type HistoryItem = {
  id: string;
  ts: number;
  thumbnails: string[]; // small data URLs
  moods: MoodPreset[];
  language: Language;
  intensity: number;
  context: string;
  analysis?: Analysis;
  replies: Reply[];
};

// --- Saved replies / favorites (#6) ---
export type SavedReplyKind = "reply" | "opener";
export type SavedReply = {
  id: string;
  ts: number;
  kind: SavedReplyKind;
  text: string;             // joined message text for previewing/copying
  messages: string[];       // raw split messages (for replies w/ multi-message)
  reasoning?: string;
  risk?: Risk;
  moods?: MoodPreset[];
  language?: Language;
  note?: string;            // user-added note
};

// --- A/B success tracking (#7) ---
export type Outcome = "worked" | "flopped";
export type StatEntry = {
  id: string;
  ts: number;
  text: string;
  risk?: Risk;
  moods?: MoodPreset[];
  language?: Language;
  outcome: Outcome;
};
export type Stats = { entries: StatEntry[] };

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore (quota etc.)
  }
}

export function usePersona() {
  const [persona, setPersona] = useState("");
  useEffect(() => {
    setPersona(readLS<string>(PERSONA_KEY, ""));
  }, []);
  const update = (v: string) => {
    setPersona(v);
    writeLS(PERSONA_KEY, v);
  };
  return [persona, update] as const;
}

export function useSettings() {
  const [settings, setSettings] = useState<SavedSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    setSettings(readLS<SavedSettings>(SETTINGS_KEY, DEFAULT_SETTINGS));
  }, []);
  const update = (v: Partial<SavedSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...v };
      writeLS(SETTINGS_KEY, next);
      return next;
    });
  };
  return [settings, update] as const;
}

const MAX_HISTORY = 20;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    setHistory(readLS<HistoryItem[]>(HISTORY_KEY, []));
  }, []);
  const add = (item: HistoryItem) => {
    setHistory((prev) => {
      const next = [item, ...prev].slice(0, MAX_HISTORY);
      writeLS(HISTORY_KEY, next);
      return next;
    });
  };
  const remove = (id: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      writeLS(HISTORY_KEY, next);
      return next;
    });
  };
  const clear = () => {
    setHistory([]);
    writeLS(HISTORY_KEY, []);
  };
  return { history, add, remove, clear };
}

const MAX_SAVED = 100;

export function useSaved() {
  const [items, setItems] = useState<SavedReply[]>([]);
  useEffect(() => {
    setItems(readLS<SavedReply[]>(SAVED_KEY, []));
  }, []);
  const add = (item: SavedReply) => {
    setItems((prev) => {
      // dedupe by text+kind
      const dup = prev.find((s) => s.kind === item.kind && s.text === item.text);
      if (dup) return prev;
      const next = [item, ...prev].slice(0, MAX_SAVED);
      writeLS(SAVED_KEY, next);
      return next;
    });
  };
  const remove = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((s) => s.id !== id);
      writeLS(SAVED_KEY, next);
      return next;
    });
  };
  const clear = () => {
    setItems([]);
    writeLS(SAVED_KEY, []);
  };
  const isSaved = (kind: SavedReplyKind, text: string) =>
    items.some((s) => s.kind === kind && s.text === text);
  return { items, add, remove, clear, isSaved };
}

const MAX_STATS = 500;

export function useStats() {
  const [stats, setStats] = useState<Stats>({ entries: [] });
  useEffect(() => {
    setStats(readLS<Stats>(STATS_KEY, { entries: [] }));
  }, []);
  const log = (entry: Omit<StatEntry, "id" | "ts">) => {
    const e: StatEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
    };
    setStats((prev) => {
      const next: Stats = { entries: [e, ...prev.entries].slice(0, MAX_STATS) };
      writeLS(STATS_KEY, next);
      return next;
    });
  };
  const clear = () => {
    setStats({ entries: [] });
    writeLS(STATS_KEY, { entries: [] });
  };
  return { stats, log, clear };
}

// Aggregate stats helpers
export type Aggregate = {
  total: number;
  worked: number;
  flopped: number;
  successRate: number; // 0..1
};

export function aggregate(entries: StatEntry[]): Aggregate {
  const worked = entries.filter((e) => e.outcome === "worked").length;
  const total = entries.length;
  return {
    total,
    worked,
    flopped: total - worked,
    successRate: total === 0 ? 0 : worked / total,
  };
}

export function aggregateByKey<K extends keyof StatEntry>(
  entries: StatEntry[],
  key: K
): { value: string; agg: Aggregate }[] {
  const groups = new Map<string, StatEntry[]>();
  for (const e of entries) {
    const v = e[key];
    if (v == null) continue;
    const arr = Array.isArray(v) ? v : [v];
    for (const item of arr) {
      const k = String(item);
      const list = groups.get(k) ?? [];
      list.push(e);
      groups.set(k, list);
    }
  }
  return Array.from(groups.entries())
    .map(([value, list]) => ({ value, agg: aggregate(list) }))
    .sort((a, b) => b.agg.total - a.agg.total);
}

// Resize an image File to a small data URL thumbnail for history storage
export async function fileToThumb(file: File, maxDim = 220): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(bitmap, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.6);
  } catch {
    return "";
  }
}
