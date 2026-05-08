"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  AlertCircle,
  RefreshCw,
  Flame,
  FileText,
  ChevronDown,
  Loader2,
  Layers3,
  GitCompareArrows,
  MessageSquareDashed,
  Flag,
} from "lucide-react";
import { MultiUploader } from "./MultiUploader";
import { MoodControls } from "./MoodControls";
import { GenderToggle } from "./GenderToggle";
import { LanguageSelector } from "./LanguageSelector";
import { ReplyCard } from "./ReplyCard";
import { ReplyCardSkeleton } from "./Skeleton";
import { AnalysisPanel } from "./AnalysisPanel";
import { Segmented } from "./Segmented";
import { Toggle } from "./Toggle";
import { Button, Section } from "@/components/ui";
import {
  LENGTHS,
  LENGTH_LABELS,
  isSpicyMood,
  type Analysis,
  type Gender,
  type Language,
  type Length,
  type MoodPreset,
  type PredictOutput,
  type Reply,
  type SummaryOutput,
} from "@/lib/schema";
import {
  fileToThumb,
  type HistoryItem,
  type SavedSettings,
} from "@/lib/storage";

const LOADING_TAGLINES = [
  "Reading the vibe…",
  "Cooking up replies…",
  "Calculating rizz…",
  "Decoding their texting style…",
  "Channeling main-character energy…",
];

type CompareGroup = {
  moods: MoodPreset[];
  analysis?: Analysis;
  replies: Reply[];
};

type Props = {
  persona: string;
  settings: SavedSettings;
  saveToHistory: (item: HistoryItem) => void;
};

export function SuggestTab({ persona, settings, saveToHistory }: Props) {
  // form state
  const [files, setFiles] = useState<File[]>([]);
  const [context, setContext] = useState("");
  const [moods, setMoods] = useState<MoodPreset[]>(["Flirty"]);
  const [customMood, setCustomMood] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [userGender, setUserGender] = useState<Gender>("male");
  const [targetGender, setTargetGender] = useState<Gender>("female");
  const [language, setLanguage] = useState<Language>(settings.defaultLanguage);
  const [length, setLength] = useState<Length>(settings.defaultLength);
  const [multiMessage, setMultiMessage] = useState(settings.defaultMultiMessage);
  const [blendMode, setBlendMode] = useState(settings.defaultBlend);
  const [compareMode, setCompareMode] = useState(settings.defaultCompare);
  const [detectFlags, setDetectFlags] = useState(false);

  // result state
  const [loading, setLoading] = useState(false);
  const [tagline, setTagline] = useState(LOADING_TAGLINES[0]);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [replies, setReplies] = useState<Reply[] | null>(null);
  const [compare, setCompare] = useState<{ a: CompareGroup; b: CompareGroup } | null>(null);

  // Summary state
  const [summary, setSummary] = useState<SummaryOutput | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    if (!settings.spicyEnabled) {
      setMoods((prev) => {
        const cleaned = prev.filter((m) => !isSpicyMood(m));
        return cleaned.length > 0 ? cleaned : (["Flirty"] as MoodPreset[]);
      });
    }
  }, [settings.spicyEnabled]);

  const onSetBlend = (v: boolean) => {
    setBlendMode(v);
    if (!v) {
      setMoods((m) => (m.length > 1 ? [m[0]] : m));
      setCompareMode(false);
    }
  };

  const callApi = async (refineFrom?: string) => {
    if (files.length === 0) {
      setError("Upload at least one screenshot.");
      return;
    }
    if (compareMode && moods.length < 2) {
      setError("Pick at least 2 moods to compare.");
      return;
    }
    setError(null);
    setReplies(null);
    setCompare(null);
    setAnalysis(null);
    setLoading(true);

    const tagInterval = setInterval(() => {
      setTagline(LOADING_TAGLINES[Math.floor(Math.random() * LOADING_TAGLINES.length)]);
    }, 1800);

    try {
      const fd = new FormData();
      fd.append("mode", "suggest");
      files.forEach((f, i) => fd.append(`image${i}`, f));
      fd.append("context", context);
      moods.forEach((m) => fd.append("moods", m));
      fd.append("customMood", customMood);
      fd.append("intensity", String(intensity));
      fd.append("userGender", userGender);
      fd.append("targetGender", targetGender);
      fd.append("language", language);
      fd.append("length", length);
      fd.append("multiMessage", multiMessage ? "true" : "false");
      fd.append("detectFlags", detectFlags ? "true" : "false");
      fd.append("spicy", settings.spicyEnabled ? "true" : "false");
      fd.append("model", settings.model);
      fd.append("persona", persona);
      if (refineFrom) fd.append("refineFrom", refineFrom);
      if (compareMode && moods.length >= 2 && !refineFrom)
        fd.append("compareMode", "true");

      const res = await fetch("/api/suggest", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else if (data.compare) {
        setCompare(data.compare);
      } else {
        setReplies(data.replies ?? []);
        setAnalysis(data.analysis ?? null);
        const thumbnails = await Promise.all(files.map((f) => fileToThumb(f)));
        saveToHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ts: Date.now(),
          thumbnails,
          moods,
          language,
          intensity,
          context,
          analysis: data.analysis,
          replies: data.replies ?? [],
        });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      clearInterval(tagInterval);
      setLoading(false);
    }
  };

  const moreLikeThis = (reply: Reply) => callApi(reply.messages.join(" / "));

  const summarize = async () => {
    if (files.length === 0) {
      setSummaryError("Upload at least one screenshot first.");
      return;
    }
    setSummaryError(null);
    setSummaryLoading(true);
    setSummaryOpen(true);
    try {
      const fd = new FormData();
      files.forEach((f, i) => fd.append(`image${i}`, f));
      fd.append("language", language);
      fd.append("persona", persona);
      fd.append("model", settings.model);
      const res = await fetch("/api/summary", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setSummaryError(data.error || "Couldn't summarize.");
      } else {
        setSummary(data.summary);
      }
    } catch (e: unknown) {
      setSummaryError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSummaryLoading(false);
    }
  };

  const predictReaction = async (replyText: string): Promise<PredictOutput | null> => {
    if (files.length === 0) return null;
    const fd = new FormData();
    files.forEach((f, i) => fd.append(`image${i}`, f));
    fd.append("replyText", replyText);
    fd.append("language", language);
    fd.append("persona", persona);
    fd.append("spicy", settings.spicyEnabled ? "true" : "false");
    fd.append("model", settings.model);
    const res = await fetch("/api/predict", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Prediction failed");
    return data as PredictOutput;
  };

  const hasResults = !!replies?.length || !!compare;
  const ready = files.length > 0 && !loading;

  return (
    <div className="space-y-6 sm:space-y-8 pb-28 sm:pb-0">
      {/* ===== Hero ===== */}
      {files.length === 0 ? (
        <>
          <header className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-10 sm:px-10 sm:py-14 text-center">
            <div className="hero-glow opacity-50" />
            <div className="relative z-10 max-w-md mx-auto">
              {settings.spicyEnabled && (
                <div className="inline-flex items-center gap-1.5 text-[11px] text-pink bg-pink/10 border border-pink/30 rounded-full py-1 px-2.5 mb-4 font-semibold uppercase tracking-wider">
                  <Flame size={11} /> Spicy mode
                </div>
              )}
              <h1 className="text-display text-4xl sm:text-5xl mb-3 text-balance">
                Send the message you&apos;d be{" "}
                <span className="gradient-text">proud of.</span>
              </h1>
              <p className="text-sm sm:text-base text-text2 leading-relaxed text-balance">
                Drop a chat screenshot, pick a vibe, and we&apos;ll cook up reply options
                calibrated to where things are headed.
              </p>
            </div>
          </header>

        </>
      ) : (
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="text-eyebrow">Suggest</div>
            <h1 className="text-2xl font-semibold tracking-tight">Your reply, in three flavors.</h1>
          </div>
          {settings.spicyEnabled && (
            <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-pink bg-pink/10 border border-pink/30 rounded-full py-1 px-2.5 font-semibold uppercase tracking-wider">
              <Flame size={11} /> Spicy mode
            </div>
          )}
        </header>
      )}

      {/* ===== Uploader ===== */}
      <MultiUploader
        files={files}
        onChange={(f) => {
          setFiles(f);
          setSummary(null);
          setSummaryOpen(false);
          setSummaryError(null);
        }}
      />

      {/* ===== Summary disclosure ===== */}
      {files.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <button
            type="button"
            onClick={() => {
              if (!summary && !summaryLoading) summarize();
              else setSummaryOpen((o) => !o);
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-surface2/60 transition"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-purple/15 text-purple flex items-center justify-center">
                <FileText size={14} />
              </span>
              <span>
                <span className="font-medium block leading-tight">
                  {summaryLoading
                    ? "Reading the conversation…"
                    : summary
                    ? "Conversation summary"
                    : "Read the convo first"}
                </span>
                <span className="text-[11px] text-muted">
                  Get a TL;DR + recommended next move
                </span>
              </span>
            </span>
            {summaryLoading ? (
              <Loader2 size={14} className="animate-spin text-muted" />
            ) : (
              <ChevronDown
                size={16}
                className={`text-muted transition ${summaryOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>
          {summaryOpen && (summary || summaryError) && (
            <div className="border-t border-border p-4 sm:p-5 space-y-3 text-sm animate-slide-up">
              {summaryError && <div className="text-bold text-xs">{summaryError}</div>}
              {summary && (
                <>
                  <div className="leading-relaxed">{summary.tldr}</div>
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wider">
                    <span className="bg-surface2 border border-border rounded-full px-2.5 py-1 text-muted">
                      Stage: {summary.stage}
                    </span>
                    <span className="bg-surface2 border border-border rounded-full px-2.5 py-1 text-muted">
                      Risk: {summary.riskLevel}
                    </span>
                    {summary.vibe && (
                      <span className="bg-surface2 border border-border rounded-full px-2.5 py-1 text-muted normal-case tracking-normal">
                        {summary.vibe}
                      </span>
                    )}
                  </div>
                  {summary.keyMoments.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-text2 space-y-0.5 pt-1">
                      {summary.keyMoments.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  )}
                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    {summary.whatTheyWant && (
                      <div className="bg-surface2 border border-border rounded-lg p-2.5">
                        <div className="text-eyebrow !text-[10px] mb-0.5">They want</div>
                        <div>{summary.whatTheyWant}</div>
                      </div>
                    )}
                    {summary.whatYouWant && (
                      <div className="bg-surface2 border border-border rounded-lg p-2.5">
                        <div className="text-eyebrow !text-[10px] mb-0.5">You want</div>
                        <div>{summary.whatYouWant}</div>
                      </div>
                    )}
                  </div>
                  {summary.nextMove && (
                    <div className="bg-pink/10 border border-pink/30 rounded-lg p-3 text-xs">
                      <span className="text-pink font-semibold">Next move · </span>
                      {summary.nextMove}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== Form sections ===== */}
      <Section eyebrow="The intent" hint="What are you trying to do?">
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={500}
          rows={2}
          placeholder='e.g. "ask her out without sounding desperate"'
          className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink/60 resize-none placeholder:text-muted"
        />
      </Section>

      <Section eyebrow="The vibe">
        <MoodControls
          moods={moods}
          setMoods={setMoods}
          blendMode={blendMode}
          customMood={customMood}
          setCustomMood={setCustomMood}
          intensity={intensity}
          setIntensity={setIntensity}
          spicyEnabled={settings.spicyEnabled}
        />
      </Section>

      <Section
        eyebrow="Output"
        trailing={
          <Segmented<Length>
            options={LENGTHS.map((l) => ({ value: l, label: LENGTH_LABELS[l] }))}
            value={length}
            onChange={setLength}
            size="sm"
          />
        }
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle
            icon={<Layers3 size={16} />}
            label="Mood blend"
            hint="Mix up to 3 moods"
            checked={blendMode}
            onChange={onSetBlend}
          />
          <Toggle
            icon={<GitCompareArrows size={16} />}
            label="Compare moods"
            hint="Side-by-side groups"
            checked={compareMode}
            onChange={(v) => {
              setCompareMode(v);
              if (v) setBlendMode(true);
            }}
          />
          <Toggle
            icon={<MessageSquareDashed size={16} />}
            label="Multi-message"
            hint="Chained double-text"
            checked={multiMessage}
            onChange={setMultiMessage}
          />
          <Toggle
            icon={<Flag size={16} />}
            label="Detect flags"
            hint="Spot green/red flags"
            checked={detectFlags}
            onChange={setDetectFlags}
          />
        </div>
      </Section>

      <Section eyebrow="Who's who">
        <div className="flex flex-wrap gap-x-8 gap-y-4 mb-4">
          <GenderToggle label="You are" value={userGender} onChange={setUserGender} />
          <GenderToggle label="They are" value={targetGender} onChange={setTargetGender} />
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </Section>

      {/* ===== Errors ===== */}
      {error && (
        <div className="flex items-start gap-2.5 bg-bold/10 border border-bold/30 text-bold rounded-xl p-3.5 text-sm animate-slide-up">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ===== CTA — sticky on mobile, inline on desktop ===== */}
      <div className="hidden sm:flex gap-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          leftIcon={<Sparkles size={18} />}
          onClick={() => callApi()}
          disabled={!ready}
        >
          {loading ? tagline : "Generate replies"}
        </Button>
        {hasResults && !loading && (
          <Button
            variant="outline"
            size="lg"
            leftIcon={<RefreshCw size={16} />}
            onClick={() => callApi()}
          >
            Regenerate
          </Button>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="sm:hidden fixed left-0 right-0 z-20 px-4 pb-safe bottom-[64px]">
        <div className="rounded-2xl bg-bg/90 backdrop-blur-xl border border-border shadow-pop p-2 flex gap-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            leftIcon={<Sparkles size={18} />}
            onClick={() => callApi()}
            disabled={!ready}
          >
            {loading ? tagline : "Generate replies"}
          </Button>
          {hasResults && !loading && (
            <Button
              variant="outline"
              size="lg"
              aria-label="Regenerate"
              onClick={() => callApi()}
              leftIcon={<RefreshCw size={16} />}
            >
              <span className="sr-only">Regenerate</span>
            </Button>
          )}
        </div>
      </div>

      {/* ===== Loading skeletons ===== */}
      {loading && !replies && !compare && (
        <section className="space-y-3 pt-2" aria-live="polite">
          <div className="text-eyebrow animate-pulse">Generating</div>
          {[0, 1, 2].map((i) => (
            <ReplyCardSkeleton key={i} delay={i * 80} />
          ))}
        </section>
      )}

      {/* ===== Single results ===== */}
      {replies && replies.length > 0 && (
        <section className="space-y-4 pt-2" aria-live="polite">
          {analysis && <AnalysisPanel analysis={analysis} />}
          <div className="flex items-end justify-between gap-3 pt-1">
            <div>
              <div className="text-eyebrow">Replies · {replies.length} options</div>
              <h2 className="text-xl font-semibold tracking-tight">Pick your line.</h2>
            </div>
          </div>
          <div className="space-y-3">
            {replies.map((r, i) => (
              <ReplyCard
                key={i}
                reply={r}
                index={i}
                moods={moods}
                language={language}
                onMoreLikeThis={() => moreLikeThis(r)}
                onPredict={predictReaction}
              />
            ))}
          </div>
        </section>
      )}

      {/* ===== Compare results ===== */}
      {compare && (
        <section className="pt-2 space-y-4" aria-live="polite">
          <div>
            <div className="text-eyebrow">Compare</div>
            <h2 className="text-xl font-semibold tracking-tight">Two vibes, side by side.</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            {(["a", "b"] as const).map((k) => {
              const g = compare[k];
              return (
                <div key={k} className="space-y-3">
                  <div className="bg-brand-gradient text-white rounded-xl px-4 py-2 text-sm font-semibold text-center shadow-cta">
                    {g.moods.join(" + ")}
                  </div>
                  {g.analysis && <AnalysisPanel analysis={g.analysis} />}
                  {g.replies.map((r, i) => (
                    <ReplyCard
                      key={i}
                      reply={r}
                      index={i}
                      moods={g.moods}
                      language={language}
                      onMoreLikeThis={() => moreLikeThis(r)}
                      onPredict={predictReaction}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
