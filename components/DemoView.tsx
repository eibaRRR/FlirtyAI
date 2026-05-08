"use client";

import Link from "next/link";
import { Wand2, Sparkles, ArrowUpRight } from "lucide-react";
import { LANGUAGE_LABELS } from "@/lib/schema";
import type { DemoScenario } from "@/lib/demo";
import { Button } from "@/components/ui";
import { AnalysisPanel } from "./AnalysisPanel";
import { DemoConversationPreview } from "./DemoConversationPreview";
import { ReplyCard } from "./ReplyCard";

type Props = {
  scenario: DemoScenario;
  /** Where the "exit / use my own chat" button should go */
  appHref?: string;
};

/**
 * Standalone demo content. Used on the dedicated `/demo/[id]` route.
 * Renders:
 *  (1) the conversation that produced these replies (phone-style preview)
 *  (2) the settings used
 *  (3) the canned replies, with demoMode treatment + locked stats
 *  (4) a strong CTA back to the real app
 */
export function DemoView({ scenario, appHref = "/app" }: Props) {
  return (
    <div className="space-y-6 sm:space-y-8 pb-32 sm:pb-12">
      {/* Step 1: the conversation that prompted these replies */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-eyebrow">The conversation</span>
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] text-muted">step 1 of 2</span>
        </div>
        <DemoConversationPreview
          match={scenario.match}
          messages={scenario.conversation}
        />
      </div>

      {/* Settings used summary */}
      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-card">
        <div className="text-eyebrow mb-3">Settings used</div>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="flex items-start justify-between gap-3 sm:flex-col sm:gap-1">
            <dt className="text-muted text-[11px] uppercase tracking-wider sm:mb-1">Mood</dt>
            <dd className="font-medium gradient-text">{scenario.moods.join(" + ")}</dd>
          </div>
          <div className="flex items-start justify-between gap-3 sm:flex-col sm:gap-1">
            <dt className="text-muted text-[11px] uppercase tracking-wider sm:mb-1">
              Intensity
            </dt>
            <dd className="font-mono tabular-nums">{scenario.intensity}/10</dd>
          </div>
          <div className="flex items-start justify-between gap-3 sm:flex-col sm:gap-1">
            <dt className="text-muted text-[11px] uppercase tracking-wider sm:mb-1">
              Language
            </dt>
            <dd className="font-medium">{LANGUAGE_LABELS[scenario.language]}</dd>
          </div>
          <div className="flex items-start justify-between gap-3 sm:flex-col sm:gap-1">
            <dt className="text-muted text-[11px] uppercase tracking-wider sm:mb-1">Goal</dt>
            <dd className="font-medium text-balance leading-snug">{scenario.context}</dd>
          </div>
        </dl>
      </div>

      {/* Step 2: the replies */}
      <section className="space-y-4" aria-live="polite">
        <div className="flex items-center gap-2">
          <span className="text-eyebrow">FlirtyAI&apos;s replies</span>
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] text-muted">step 2 of 2</span>
        </div>
        {scenario.analysis && <AnalysisPanel analysis={scenario.analysis} />}
        <div className="space-y-3">
          {scenario.replies.map((r, i) => (
            <ReplyCard
              key={i}
              reply={r}
              index={i}
              moods={scenario.moods}
              language={scenario.language}
              demoMode
            />
          ))}
        </div>
      </section>

      {/* Bottom hero CTA */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-8 sm:px-10 sm:py-12 text-center mt-2">
        <div className="hero-glow opacity-50" />
        <div className="relative z-10 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold bg-pink/10 border border-pink/30 text-pink rounded-full px-3 py-1.5 mb-4">
            <Wand2 size={11} /> You just saw a demo
          </div>
          <h3 className="text-display text-3xl sm:text-4xl mb-3 text-balance">
            Now <span className="gradient-text">do it for real.</span>
          </h3>
          <p className="text-sm text-text2 leading-relaxed mb-5 text-balance">
            Drop your own chat screenshot, pick the vibe, and FlirtyAI replies to YOUR
            actual conversation in seconds.
          </p>
          <Link
            href={appHref}
            className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold rounded-xl px-6 h-12 text-[15px] shadow-cta hover:brightness-110 transition"
          >
            <Sparkles size={18} />
            Open the app
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="sm:hidden fixed left-0 right-0 z-20 px-4 pb-safe bottom-0 pointer-events-none">
        <div className="rounded-2xl bg-bg/90 backdrop-blur-xl border border-pink/40 shadow-pop p-2 flex gap-2 pointer-events-auto">
          <Link
            href={appHref}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-gradient text-white font-semibold rounded-xl h-12 text-[15px] shadow-cta hover:brightness-110 transition"
          >
            <Sparkles size={18} />
            Open the app
          </Link>
        </div>
      </div>
    </div>
  );
}
