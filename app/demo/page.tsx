import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles,
  ArrowUpRight,
  Wand2,
  ArrowLeft,
} from "lucide-react";
import { DEMO_SCENARIOS } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Demos · FlirtyAI",
  description:
    "See FlirtyAI in action. Three real scenarios with the full conversation, the settings used, and the replies it cooked up. No upload, no sign-up.",
};

export default function DemoIndex() {
  return (
    <div className="min-h-screen relative">
      {/* Top chrome */}
      <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-cta shrink-0 group-hover:scale-105 transition">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-base leading-tight tracking-tight truncate">
                <span className="gradient-text">FlirtyAI</span>
              </div>
              <div className="text-[11px] text-muted leading-tight truncate">
                live demos · pick one
              </div>
            </div>
          </Link>
          <Link
            href="/app"
            className="hidden sm:inline-flex items-center gap-1.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl px-4 h-9 shadow-cta hover:brightness-110 transition"
          >
            Open the app
            <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/app"
            className="sm:hidden inline-flex items-center justify-center bg-brand-gradient text-white rounded-lg w-9 h-9 shadow-cta"
            aria-label="Open the app"
          >
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-text transition mb-4"
        >
          <ArrowLeft size={13} /> back to FlirtyAI
        </Link>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-10 sm:px-12 sm:py-14 text-center mb-10">
          <div className="hero-glow opacity-50" />
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold bg-purple/10 border border-purple/30 text-purple rounded-full px-3 py-1.5 mb-4">
              <Wand2 size={11} /> Live demos · no API call
            </div>
            <h1 className="text-display text-4xl sm:text-6xl mb-4 text-balance">
              Pick a <span className="gradient-text">scenario.</span>
            </h1>
            <p className="text-sm sm:text-base text-text2 leading-relaxed text-balance">
              Each demo shows the actual conversation, the settings used, and the
              replies FlirtyAI cooked up. No upload. No sign-up. One click.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-eyebrow">{DEMO_SCENARIOS.length} scenarios</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {DEMO_SCENARIOS.map((s, i) => (
              <Link
                key={s.id}
                href={`/demo/${s.id}`}
                className="group relative overflow-hidden bg-surface border border-border rounded-2xl p-5 hover:border-pink/40 shadow-card transition animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition bg-brand-gradient-soft" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3 text-pink">
                    <span className="w-9 h-9 rounded-xl bg-pink/15 border border-pink/30 flex items-center justify-center">
                      <Wand2 size={15} />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted">
                      Scenario {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[17px] tracking-tight leading-snug mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-text2 leading-relaxed mb-4">{s.blurb}</p>

                  {/* Mini conversation preview */}
                  <div className="bg-surface2 border border-border rounded-xl p-3 space-y-1.5 mb-4 max-h-24 overflow-hidden relative">
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface2 to-transparent pointer-events-none" />
                    {s.conversation.slice(-2).map((m, j) => {
                      const isMe = m.from === "me";
                      return (
                        <div
                          key={j}
                          className={
                            isMe
                              ? "flex justify-end"
                              : "flex justify-start"
                          }
                        >
                          <div
                            className={
                              isMe
                                ? "max-w-[82%] bg-brand-gradient text-white px-2.5 py-1 rounded-lg text-[11px] leading-snug"
                                : "max-w-[82%] bg-surface border border-border px-2.5 py-1 rounded-lg text-[11px] leading-snug"
                            }
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                      <span className="gradient-text font-bold">
                        {s.moods.join(" + ")}
                      </span>
                      <span>·</span>
                      <span>{s.replies.length} replies</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] text-pink font-semibold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition">
                      Open
                      <ArrowUpRight
                        size={12}
                        className="transition group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-12 sm:mt-16 relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-10 sm:py-14 text-center">
          <div className="hero-glow opacity-50" />
          <div className="relative z-10 max-w-md mx-auto">
            <h3 className="text-display text-3xl sm:text-4xl mb-3 text-balance">
              Ready to <span className="gradient-text">do it for real?</span>
            </h3>
            <p className="text-sm text-text2 leading-relaxed mb-5 text-balance">
              Drop your own chat screenshot and FlirtyAI replies to YOUR actual
              conversation in seconds.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold rounded-xl px-6 h-12 text-[15px] shadow-cta hover:brightness-110 transition"
            >
              <Sparkles size={18} />
              Open the app
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
