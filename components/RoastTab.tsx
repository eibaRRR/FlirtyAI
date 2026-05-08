"use client";

import { useState } from "react";
import { Flame, Loader2, AlertCircle } from "lucide-react";
import { MultiUploader } from "./MultiUploader";
import { LanguageSelector } from "./LanguageSelector";
import { RoastResult } from "./RoastResult";
import type { Language, RoastOutput } from "@/lib/schema";

type Props = {
  persona: string;
  defaultLanguage: Language;
  spicy: boolean;
  model: "maverick" | "kimi";
};

export function RoastTab({ persona, defaultLanguage, spicy, model }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [context, setContext] = useState("");
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RoastOutput | null>(null);

  const run = async () => {
    if (files.length === 0) {
      setError("Upload a screenshot first.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("mode", "roast");
      files.forEach((f, i) => fd.append(`image${i}`, f));
      fd.append("context", context);
      fd.append("language", language);
      fd.append("persona", persona);
      // schema requires moods/intensity/genders even though roast ignores them — supply defaults
      fd.append("moods", "Funny");
      fd.append("intensity", "5");
      fd.append("userGender", "other");
      fd.append("targetGender", "other");
      fd.append("length", "medium");
      fd.append("spicy", spicy ? "true" : "false");
      fd.append("model", model);

      const res = await fetch("/api/suggest", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else if (data.roast) {
        setResult(data.roast);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-muted">
        Upload a chat where YOUR last message is the one to evaluate. The AI will rate it,
        explain what worked and flopped, and suggest better alternatives.
      </div>

      <MultiUploader files={files} onChange={setFiles} />

      <div>
        <label className="text-sm text-muted mb-2 block">
          What were you trying to do? <span className="text-muted/60">(optional)</span>
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={500}
          rows={2}
          placeholder='e.g. "trying to ask her out without being too direct"'
          className="w-full bg-panel border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple resize-none"
        />
      </div>

      <LanguageSelector value={language} onChange={setLanguage} />

      <button
        onClick={run}
        disabled={loading || files.length === 0}
        className="w-full bg-brand-gradient text-white font-semibold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-pink/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Roasting...
          </>
        ) : (
          <>
            <Flame size={18} />
            Roast my last message
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <RoastResult result={result} />
        </div>
      )}
    </div>
  );
}
