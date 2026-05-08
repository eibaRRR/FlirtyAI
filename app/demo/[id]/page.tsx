import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles, ArrowLeft, ArrowUpRight, Wand2 } from "lucide-react";
import { DEMO_SCENARIOS } from "@/lib/demo";
import { DemoView } from "@/components/DemoView";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return DEMO_SCENARIOS.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const scenario = DEMO_SCENARIOS.find((s) => s.id === params.id);
  if (!scenario) return { title: "Demo not found · FlirtyAI" };
  return {
    title: `Demo · ${scenario.title} — FlirtyAI`,
    description: scenario.blurb,
  };
}

export default function DemoPage({ params }: { params: Params }) {
  const scenario = DEMO_SCENARIOS.find((s) => s.id === params.id);
  if (!scenario) notFound();

  return (
    <div className="min-h-screen relative">
      {/* Top chrome — minimal */}
      <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group min-w-0"
            aria-label="Back to landing"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-cta shrink-0 group-hover:scale-105 transition">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-base leading-tight tracking-tight truncate">
                <span className="gradient-text">FlirtyAI</span>
              </div>
              <div className="text-[11px] text-muted leading-tight truncate">
                live demo · {scenario.title}
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

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* Page eyebrow + title */}
        <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-text transition mb-2"
            >
              <ArrowLeft size={13} /> all demos
            </Link>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold bg-purple/10 border border-purple/30 text-purple rounded-full px-2.5 py-1 mb-3">
              <Wand2 size={11} /> Live demo · no API call
            </div>
            <h1 className="text-display text-3xl sm:text-5xl text-balance leading-tight">
              {scenario.title}
            </h1>
            <p className="text-sm sm:text-base text-text2 leading-relaxed mt-2 text-balance max-w-xl">
              {scenario.blurb}
            </p>
          </div>
        </div>

        <DemoView scenario={scenario} appHref="/app" />

        {/* Other demos */}
        <section className="mt-12 pt-10 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-eyebrow">Try another scenario</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DEMO_SCENARIOS.filter((s) => s.id !== scenario.id).map((s, i) => (
              <Link
                key={s.id}
                href={`/demo/${s.id}`}
                className="group bg-surface border border-border rounded-2xl p-4 hover:border-pink/40 shadow-card transition animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2 mb-2 text-pink">
                  <span className="w-7 h-7 rounded-lg bg-pink/15 border border-pink/30 flex items-center justify-center">
                    <Wand2 size={13} />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted">
                    Demo
                  </span>
                </div>
                <h4 className="font-semibold text-[15px] tracking-tight leading-snug mb-1.5">
                  {s.title}
                </h4>
                <p className="text-xs text-text2 leading-relaxed">{s.blurb}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-pink font-semibold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition">
                  Open demo
                  <span className="transition group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
