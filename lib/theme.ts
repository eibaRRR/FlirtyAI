"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "light" | "system";

const KEY = "flirtyai.theme.v1";

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const isDark = mode === "dark" || (mode === "system" && systemPrefersDark());
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(KEY)) as ThemeMode | null;
    const initial: ThemeMode = stored === "dark" || stored === "light" || stored === "system" ? stored : "dark";
    setMode(initial);
    applyTheme(initial);
  }, []);

  // Listen for system changes when in "system" mode
  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [mode]);

  const update = (m: ThemeMode) => {
    setMode(m);
    try {
      localStorage.setItem(KEY, m);
    } catch {}
    applyTheme(m);
  };

  return [mode, update] as const;
}

// Run once before paint to avoid flash
export const THEME_INIT_SCRIPT = `
(function(){try{
  var k='${KEY}';
  var s=localStorage.getItem(k);
  var m=(s==='light'||s==='dark'||s==='system')?s:'dark';
  var dark = m==='dark' || (m==='system' && (window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches));
  var r=document.documentElement;
  r.classList.toggle('dark',dark);
  r.classList.toggle('light',!dark);
  r.style.colorScheme = dark?'dark':'light';
}catch(e){}})();
`;
