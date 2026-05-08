import Link from "next/link";
import {
  Sparkles,
  Flame,
  Wrench,
  Wand2,
  MessageSquare,
  ArrowUpRight,
  Globe2,
  Lock,
  Zap,
  Bookmark,
  BarChart3,
  Languages,
} from "lucide-react";
import { DEMO_SCENARIOS } from "@/lib/demo";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-bg/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-cta group-hover:scale-105 transition">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-base leading-tight tracking-tight">
                <span className="gradient-text">FlirtyAI</span>
              </div>
              <div className="text-[11px] text-muted leading-tight">your AI wingperson</div>
            </div>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4 text-sm">
            <a
              href="#demos"
              className="hidden sm:inline text-text2 hover:text-text transition"
            >
              Demos
            </a>
            <a
              href="#features"
              className="hidden sm:inline text-text2 hover:text-text transition"
            >
              Features
            </a>
            <a
              href="#how"
              className="hidden sm:inline text-text2 hover:text-text transition"
            >
              How it works
            </a>
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl px-4 h-9 shadow-cta hover:brightness-110 transition"
            >
              Open app
              <ArrowUpRight size={14} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-70 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-28 pb-20 sm:pb-32 text-center">
          {/* Eyebrow chip */}
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold bg-surface/70 backdrop-blur-xl border border-border rounded-full px-3 py-1.5 mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gradient animate-pulse" />
            <span className="text-text2">
              <span className="text-pink">New</span> · spicy mode + 9 AI tools
            </span>
          </div>

          <h1 className="text-display text-5xl sm:text-7xl lg:text-[88px] mb-6 text-balance animate-slide-up">
            Send the message
            <br />
            you&apos;d be{" "}
            <span className="gradient-text">proud of.</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-text2 max-w-2xl mx-auto leading-relaxed text-balance mb-10 animate-slide-up"
            style={{ animationDelay: "80ms" }}
          >
            Drop a chat screenshot, pick a vibe, and FlirtyAI cooks up reply options
            calibrated to where things are headed. Bio rewrites, opener generation,
            date plans, and a wingperson chat — all in one app.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up"
            style={{ animationDelay: "160ms" }}
          >
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold rounded-xl px-6 h-12 text-[15px] shadow-cta hover:brightness-110 transition"
            >
              <Sparkles size={16} />
              Open the app
              <ArrowUpRight size={15} />
            </Link>
            <Link
              href={`/demo/${DEMO_SCENARIOS[0].id}`}
              className="inline-flex items-center gap-2 bg-surface border border-border text-text font-medium rounded-xl px-5 h-12 text-[15px] hover:border-pink/40 transition"
            >
              <Wand2 size={15} className="text-pink" />
              See a demo
              <span className="text-muted text-xs">no upload</span>
            </Link>
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-4 text-[11px] text-muted animate-fade-in"
            style={{ animationDelay: "260ms" }}
          >
            <span className="inline-flex items-center gap-1">
              <Lock size={11} /> Screenshots never stored
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Globe2 size={11} /> EN · FR · AR · Darija
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Zap size={11} /> ~2-5s replies
            </span>
          </div>
        </div>

        {/* Showcase chat-bubble preview */}
        <ShowcaseConversation />
      </section>

      {/* Demo gallery */}
      <section
        id="demos"
        className="border-t border-border bg-surface/30"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-eyebrow !text-pink mb-3 inline-flex items-center gap-1.5 justify-center">
              <Wand2 size={11} /> Live demos · no API call
            </div>
            <h2 className="text-display text-4xl sm:text-5xl text-balance">
              See it before you upload anything.
            </h2>
            <p className="text-sm sm:text-base text-text2 leading-relaxed mt-3 text-balance">
              Three real scenarios with the full conversation, the settings used, and
              the replies FlirtyAI cooked up. One click, no sign-up.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
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
                    <span className="w-8 h-8 rounded-lg bg-pink/15 border border-pink/30 flex items-center justify-center">
                      <Wand2 size={14} />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted">
                      Scenario {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[16px] tracking-tight leading-snug mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-text2 leading-relaxed mb-4">{s.blurb}</p>
                  <div className="inline-flex items-center gap-1 text-[11px] text-pink font-semibold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition">
                    Open demo
                    <ArrowUpRight
                      size={12}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24"
      >
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="text-eyebrow !text-pink mb-3">Five tabs, one wingperson</div>
          <h2 className="text-display text-4xl sm:text-5xl text-balance">
            Built for every awkward step.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card hover:border-pink/30 transition animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition bg-brand-gradient-soft" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center text-pink mb-4">
                  <f.Icon size={18} />
                </div>
                <h3 className="font-semibold text-[17px] tracking-tight mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm text-text2 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border bg-surface/30">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-eyebrow !text-pink mb-3">How it works</div>
            <h2 className="text-display text-4xl sm:text-5xl text-balance">
              Three taps to a better text.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="relative bg-surface border border-border rounded-2xl p-6 shadow-card animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-display gradient-text text-5xl mb-3">{i + 1}</div>
                <h3 className="font-semibold text-[17px] tracking-tight mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-text2 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-70 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
          <h2 className="text-display text-4xl sm:text-6xl mb-4 text-balance">
            Stop overthinking.
            <br />
            <span className="gradient-text">Start sending.</span>
          </h2>
          <p className="text-base sm:text-lg text-text2 max-w-lg mx-auto leading-relaxed mb-8 text-balance">
            Free to use. No sign-up. Your data stays on your device. Try a demo
            scenario or upload a screenshot — see for yourself.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold rounded-xl px-7 h-14 text-base shadow-cta hover:brightness-110 transition"
          >
            <Sparkles size={18} />
            Open FlirtyAI
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-muted">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span>
              <span className="gradient-text font-semibold">FlirtyAI</span>{" "}
              · all results are AI-generated, use your judgment.
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic">made with care by</span>
            <a
              href="https://github.com/eibaRRR"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-text font-semibold hover:underline underline-offset-4"
            >
              Rabie
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===== Static showcase preview (decorative, not interactive) =====
function ShowcaseConversation() {
  return (
    <div className="relative max-w-2xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28 -mt-2">
      <div className="relative bg-surface/70 backdrop-blur-xl border border-border rounded-3xl shadow-pop overflow-hidden">
        {/* Faux header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-surface/60">
          <div className="w-9 h-9 rounded-full bg-brand-gradient" />
          <div className="flex-1">
            <div className="text-sm font-semibold leading-tight">Salma</div>
            <div className="text-[11px] text-muted leading-tight">active now</div>
          </div>
          <div className="text-eyebrow">FlirtyAI demo</div>
        </div>
        {/* Messages */}
        <div className="px-5 py-6 space-y-3">
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-surface2 border border-border rounded-2xl rounded-bl-md px-4 py-2.5 text-[15px] leading-relaxed">
              soo what u doing this weekend
            </div>
          </div>
          <div className="flex justify-end animate-slide-up">
            <div className="max-w-[80%] bg-brand-gradient text-white rounded-2xl rounded-br-md px-4 py-2.5 text-[15px] leading-relaxed shadow-cta">
              probably plotting how to get you to come along — what&apos;s your saturday looking like
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3">
            <span className="text-eyebrow">Suggested · medium risk</span>
            <span className="h-px flex-1 bg-border" />
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              <Sparkles size={11} /> generated in 2.4s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Suggest replies",
    body:
      "Upload a chat screenshot. Pick a vibe (Flirty, Smooth, Unhinged…). Get 3-5 reply options across safe / medium / bold risk.",
    Icon: Sparkles,
  },
  {
    title: "Roast your last text",
    body:
      "Brutal, funny, calibrated. Get a score, a verdict, what worked, what flopped, and what you should have sent instead.",
    Icon: Flame,
  },
  {
    title: "Opener · date · closure",
    body:
      "First-message generator from a bio. Date ideas with a ready-to-send pitch. Closure messages when it&apos;s time to end it.",
    Icon: Wrench,
  },
  {
    title: "Bio rewriter",
    body:
      "Same facts, different energy. Mysterious, Funny, Sincere, Bold — pick your vibes and get rewrites under your character cap.",
    Icon: Wand2,
  },
  {
    title: "Wingperson chat",
    body:
      "A direct, witty AI chat coach you can ask anything. Pastes back ideas in your texting style. Will push back when you&apos;re about to do something cringe.",
    Icon: MessageSquare,
  },
  {
    title: "Saved · history · stats",
    body:
      "Bookmark replies you love. Mark what worked vs flopped. See your win rate by risk level, mood, and language. Stored locally.",
    Icon: Bookmark,
  },
  {
    title: "Darija + 4 more languages",
    body:
      "Native Moroccan Darija (Arabic & Latin script with 3/7/9), French, Arabic, English. Mirrors code-switching naturally.",
    Icon: Languages,
  },
  {
    title: "Privacy by default",
    body:
      "Screenshots are processed in real-time and never stored on the server. All your saved replies, history, and stats live on your device.",
    Icon: Lock,
  },
  {
    title: "Track what lands",
    body:
      "A/B success tracking on every reply. Mark Worked or Flopped — your stats panel shows what mood + risk wins for you.",
    Icon: BarChart3,
  },
];

const STEPS = [
  {
    title: "Drop the chat.",
    body:
      "Click, drag, or paste from clipboard. Up to 3 screenshots — leftmost is the oldest. Or skip and try one of the demo scenarios.",
  },
  {
    title: "Pick the vibe.",
    body:
      "Flirty? Nonchalant? Bold? Mix up to three moods. Crank the intensity slider, pick your length, opt into spicy if you&apos;re 18+.",
  },
  {
    title: "Send the one that lands.",
    body:
      "Get 3-5 reply options with reasoning. Predict how they&apos;ll react. Save the keepers. Mark what worked. Send the message you&apos;d be proud of.",
  },
];
