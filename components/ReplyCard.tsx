"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Sparkles,
  MessageCircle,
  Loader2,
  ChevronDown,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Share2,
} from "lucide-react";
import type { Language, MoodPreset, PredictOutput, Reply } from "@/lib/schema";
import { useSaved, useStats } from "@/lib/storage";
import { renderReplyShareImage, shareOrDownload } from "@/lib/share";
import { useCopyWithToast, useToast } from "./Toaster";
import { cn } from "@/lib/utils";
import { explainFetchError, explainResponseError } from "@/lib/errors";

const RISK_STYLES: Record<Reply["risk"], { label: string; dot: string; ring: string }> = {
  safe: {
    label: "Safe",
    dot: "bg-safe",
    ring: "hover:border-safe/40",
  },
  medium: {
    label: "Medium",
    dot: "bg-med",
    ring: "hover:border-med/40",
  },
  bold: {
    label: "Bold",
    dot: "bg-bold",
    ring: "hover:border-bold/40",
  },
};

const LIKELIHOOD_DOT: Record<"high" | "medium" | "low", string> = {
  high: "bg-safe",
  medium: "bg-med",
  low: "bg-bold",
};

type Props = {
  reply: Reply;
  moods?: MoodPreset[];
  language?: Language;
  index?: number;
  onMoreLikeThis?: () => void;
  onPredict?: (replyText: string) => Promise<PredictOutput | null>;
  /**
   * Demo mode — disables features that would call the API or pollute user stats.
   * Predict, More-like-this, and Worked/Flopped are gated. Save and Share still work.
   */
  demoMode?: boolean;
};

export function ReplyCard({
  reply,
  moods,
  language,
  index = 0,
  onMoreLikeThis,
  onPredict,
  demoMode = false,
}: Props) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<PredictOutput | null>(null);
  const [predictError, setPredictError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [outcome, setOutcome] = useState<"worked" | "flopped" | null>(null);
  const [pulseSave, setPulseSave] = useState(false);
  const [sharing, setSharing] = useState(false);

  const copyWithToast = useCopyWithToast();
  const { toast } = useToast();
  const saved = useSaved();
  const { log } = useStats();

  const allText = reply.messages.join("\n\n");
  const isSaved = saved.isSaved("reply", allText);

  const copyAll = async () => {
    await copyWithToast(allText, "Copied to clipboard");
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1400);
  };
  const copyOne = async (idx: number) => {
    await copyWithToast(reply.messages[idx], "Copied");
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1400);
  };

  const toggleSave = () => {
    if (isSaved) {
      const match = saved.items.find((s) => s.kind === "reply" && s.text === allText);
      if (match) {
        saved.remove(match.id);
        toast("Removed from saved", "info");
      }
    } else {
      saved.add({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: Date.now(),
        kind: "reply",
        text: allText,
        messages: reply.messages,
        reasoning: reply.reasoning,
        risk: reply.risk,
        moods,
        language,
      });
      toast("Saved to favorites ❤", "success");
      setPulseSave(true);
      setTimeout(() => setPulseSave(false), 450);
    }
  };

  const trackOutcome = (kind: "worked" | "flopped") => {
    if (outcome === kind) return;
    setOutcome(kind);
    log({
      text: allText,
      risk: reply.risk,
      moods,
      language,
      outcome: kind,
    });
    toast(
      kind === "worked"
        ? "Marked as worked — thanks for the data!"
        : "Marked as flopped — we'll learn from it",
      kind === "worked" ? "success" : "info"
    );
  };

  const onShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const blob = await renderReplyShareImage(reply, { eyebrow: "Reply suggestion" });
      if (!blob) {
        toast("Couldn't render image", "error");
        return;
      }
      const result = await shareOrDownload(blob);
      if (result === "shared") toast("Shared 🔥", "success");
      else if (result === "downloaded") toast("Image saved", "success");
      else toast("Share failed — try again", "error");
    } catch {
      toast("Share failed", "error");
    } finally {
      setSharing(false);
    }
  };

  const runPredict = async () => {
    if (!onPredict) return;
    if (prediction) {
      setExpanded((v) => !v);
      return;
    }
    setPredicting(true);
    setPredictError(null);
    try {
      const result = await onPredict(allText);
      if (result) {
        setPrediction(result);
        setExpanded(true);
      } else {
        setPredictError("Prediction failed.");
      }
    } catch (e: unknown) {
      setPredictError(explainFetchError(e));
    } finally {
      setPredicting(false);
    }
  };

  const r = RISK_STYLES[reply.risk];
  const multi = reply.messages.length > 1;

  return (
    <div
      className={cn(
        "relative bg-surface border border-border rounded-2xl p-4 transition shadow-[var(--shadow-card)] animate-slide-up",
        r.ring,
        "hover:shadow-lg",
        // Demo cards get a left edge gradient stripe so they're unmistakable
        demoMode && "pl-5"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {demoMode && (
        <span
          className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-brand-gradient"
          aria-hidden="true"
        />
      )}
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-text2">
            <span className={cn("w-2 h-2 rounded-full", r.dot)} />
            {r.label}
          </span>
          {multi && (
            <span className="text-[10px] uppercase tracking-wider text-muted bg-surface2 px-2 py-0.5 rounded-full border border-border">
              {reply.messages.length}-msg
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleSave}
            className={cn(
              "p-1.5 rounded-lg transition",
              isSaved
                ? "text-pink hover:bg-pink/10"
                : "text-muted hover:text-pink hover:bg-surface2",
              pulseSave && "animate-pop-in"
            )}
            title={isSaved ? "Remove from saved" : "Save to favorites"}
            aria-label={isSaved ? "Remove from saved" : "Save"}
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onShare}
            disabled={sharing}
            className="p-1.5 rounded-lg text-muted hover:text-pink hover:bg-surface2 transition disabled:opacity-50"
            title="Share as image"
            aria-label="Share as image"
          >
            {sharing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Share2 size={15} />
            )}
          </button>
          {onPredict && !demoMode && (
            <button
              onClick={runPredict}
              disabled={predicting}
              className="p-1.5 rounded-lg text-muted hover:text-pink hover:bg-surface2 transition disabled:opacity-50"
              title={
                prediction ? (expanded ? "Hide reactions" : "Show reactions") : "Predict reaction"
              }
              aria-label="Predict reaction"
            >
              {predicting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <MessageCircle size={15} />
              )}
            </button>
          )}
          {onMoreLikeThis && !demoMode && (
            <button
              onClick={onMoreLikeThis}
              className="p-1.5 rounded-lg text-muted hover:text-pink hover:bg-surface2 transition"
              title="Generate variations"
              aria-label="More like this"
            >
              <Sparkles size={15} />
            </button>
          )}
          <button
            onClick={copyAll}
            className="p-1.5 rounded-lg text-muted hover:text-pink hover:bg-panel2 transition"
            title={multi ? "Copy all" : "Copy"}
            aria-label="Copy"
          >
            {copiedAll ? <Check size={15} className="text-safe" /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      {/* Chat-bubble style messages */}
      <div className="space-y-2">
        {reply.messages.map((m, i) => (
          <div key={i} className="flex justify-end">
            <div
              className={cn(
                "relative max-w-[88%] px-4 py-2.5 leading-relaxed whitespace-pre-wrap text-[15px] rounded-2xl rounded-br-md",
                "bg-brand-gradient text-white shadow-lg shadow-pink/15"
              )}
              dir="auto"
            >
              {multi && (
                <button
                  onClick={() => copyOne(i)}
                  className="absolute -left-9 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-muted hover:text-pink transition p-1.5 rounded-lg bg-panel border border-border"
                  title="Copy this message"
                  aria-label="Copy this message"
                >
                  {copiedIdx === i ? <Check size={13} /> : <Copy size={13} />}
                </button>
              )}
              {m}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border text-xs text-muted italic leading-relaxed">
        {reply.reasoning}
      </div>

      {/* A/B success tracking — disabled in demo so we don't pollute real stats */}
      {demoMode ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1 opacity-60">
            <ThumbsUp size={12} /> Worked
          </span>
          <span className="inline-flex items-center gap-1 opacity-60">
            <ThumbsDown size={12} /> Flopped
          </span>
          <span className="text-[11px] italic">— locked in demo</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
          <span className="text-muted">Did it land?</span>
          <button
            onClick={() => trackOutcome("worked")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg border transition active:scale-95",
              outcome === "worked"
                ? "bg-safe/15 border-safe/40 text-safe"
                : "bg-surface2 border-border text-muted hover:border-safe/40 hover:text-safe"
            )}
            title="It worked"
            aria-pressed={outcome === "worked"}
          >
            <ThumbsUp size={12} /> Worked
          </button>
          <button
            onClick={() => trackOutcome("flopped")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg border transition active:scale-95",
              outcome === "flopped"
                ? "bg-bold/15 border-bold/40 text-bold"
                : "bg-surface2 border-border text-muted hover:border-bold/40 hover:text-bold"
            )}
            title="It flopped"
            aria-pressed={outcome === "flopped"}
          >
            <ThumbsDown size={12} /> Flopped
          </button>
        </div>
      )}

      {predictError && <div className="mt-3 text-xs text-bold">{predictError}</div>}

      {prediction && expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-wider text-muted font-semibold flex items-center gap-1.5">
              <MessageCircle size={12} /> How they might respond
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-muted hover:text-text"
              aria-label="Hide"
            >
              <ChevronDown size={14} className="rotate-180" />
            </button>
          </div>
          {prediction.overall && (
            <p className="text-xs text-muted italic">{prediction.overall}</p>
          )}
          <div className="space-y-2">
            {prediction.predictions.map((p, i) => (
              <div
                key={i}
                className="bg-panel2 border border-border rounded-lg px-3 py-2 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("w-2 h-2 rounded-full", LIKELIHOOD_DOT[p.likelihood])} />
                  <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">
                    {p.likelihood}
                  </span>
                  <span className="text-xs text-muted">· {p.vibe}</span>
                </div>
                <div className="text-sm" dir="auto">
                  {p.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
