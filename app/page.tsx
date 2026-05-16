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
  Heart,
  Star,
  Clock,
  Quote,
  ChevronRight,
  Stars,
  Check,
  Smile,
} from "lucide-react";
import { DEMO_SCENARIOS } from "@/lib/demo";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden text-text">
      {/* === Ambient background layers === */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
        {/* Mesh dots */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(rgb(255 255 255 / 0.6) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Animated blobs */}
        <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full blur-3xl opacity-50 bg-pink-500/30 float-y-slow" />
        <div className="absolute top-32 -right-40 w-[640px] h-[640px] rounded-full blur-3xl opacity-40 bg-purple-500/30 float-y-rev" />
        <div className="absolute bottom-0 left-1/3 w-[760px] h-[760px] rounded-full blur-3xl opacity-30 bg-amber-400/25 float-y" />
      </div>

      {/* === Top bar === */}
      <header className="sticky top-0 z-30 backdrop-blur-2xl bg-bg/60 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-cta group-hover:scale-105 transition">
              <Sparkles size={18} className="text-white" />
              <span className="absolute -inset-0.5 rounded-2xl ring-1 ring-white/10" />
            </div>
            <div>
              <div className="font-bold text-base leading-tight tracking-tight">
                <span className="gradient-text-animated">FlirtyAI</span>
              </div>
              <div className="text-[11px] text-muted leading-tight">your AI wingperson</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 text-sm">
            {[
              { href: "#demos", label: "Demos" },
              { href: "#features", label: "Features" },
              { href: "#how", label: "How it works" },
              { href: "#love", label: "Love" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hidden md:inline-flex items-center px-3 h-9 rounded-xl text-text2 hover:text-text hover:bg-card/60 transition"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/app"
              className="btn-glow ml-1 inline-flex items-center gap-1.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl px-4 h-9 shadow-cta"
            >
              Open app
              <ArrowUpRight size={14} />
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative">
        {/* === Hero === */}
        <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-16">
          <div className="absolute inset-x-0 top-0 -z-10 aurora rounded-[40px] h-[560px]" />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-text2 reveal">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>Live · LLM-powered · PWA-ready</span>
                <span className="h-3 w-px bg-border" />
                <span className="text-brand">v2 launched</span>
              </div>

              <h1 className="mt-6 text-5xl sm:text-7xl font-display font-extrabold tracking-tight leading-[1.02] reveal">
                Send the message{" "}
                <span className="rotator align-bottom">
                  <span className="gradient-text-animated">they actually reply to.</span>
                  <span className="gradient-text-animated">that lands the date.</span>
                  <span className="gradient-text-animated">that sounds like you.</span>
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-text2 max-w-2xl reveal">
                FlirtyAI reads the room — your screenshots, their bio, the vibe — and crafts replies, openers, and date plans that{" "}
                <span className="text-text font-medium">sound like the best version of you</span>.
              </p>

              {/* CTA row */}
              <div className="mt-8 flex flex-wrap items-center gap-3 reveal">
                <Link
                  href="/app"
                  className="btn-glow inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold rounded-2xl px-6 h-14 shadow-cta"
                >
                  <Sparkles size={16} />
                  Try it free
                  <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="/demo"
                  className="btn-glow inline-flex items-center gap-2 bg-card/70 border border-border rounded-2xl px-6 h-14 text-text hover:bg-card2 transition"
                >
                  <MessageSquare size={16} />
                  See live demos
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted ml-1">
                  <Check size={14} className="text-emerald-400" /> No sign-up
                  <span className="opacity-40">·</span>
                  <Check size={14} className="text-emerald-400" /> Works offline
                  <span className="opacity-40">·</span>
                  <Check size={14} className="text-emerald-400" /> BYO key
                </div>
              </div>

              {/* Mini stats badges */}
              <div className="mt-10 flex flex-wrap gap-2 reveal">
                {[
                  { k: "3.2×", v: "faster replies" },
                  { k: "11", v: "tones" },
                  { k: "5", v: "spice levels" },
                  { k: "12", v: "languages" },
                  { k: "100%", v: "on-device" },
                ].map((s) => (
                  <div
                    key={s.v}
                    className="group flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs hover:border-brand/40 transition"
                  >
                    <span className="font-display font-bold text-sm gradient-text-animated">{s.k}</span>
                    <span className="text-text2">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right hero card stack */}
            <div className="lg:col-span-5">
              <div className="relative perspective-[1200px]">
                {/* Floating sparkle */}
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-2xl bg-brand-gradient grid place-items-center shadow-cta float-y">
                  <Heart size={20} className="text-white" fill="white" />
                </div>
                <div className="absolute -top-3 right-2 w-10 h-10 rounded-full bg-card border border-border grid place-items-center float-y-rev shadow-card">
                  <Stars size={16} className="text-amber-300" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-card border border-border grid place-items-center float-y-slow shadow-glow">
                  <Smile size={20} className="text-brand" />
                </div>

                {/* Halo */}
                <div className="absolute -inset-8 bg-brand-gradient blur-3xl opacity-25 rounded-[40px]" />

                {/* Stacked cards */}
                <div className="relative">
                  {/* Back card */}
                  <div className="absolute -top-6 left-6 right-6 h-[88%] rounded-3xl bg-card2/80 border border-border opacity-70 rotate-[-2deg]" />
                  {/* Mid card */}
                  <div className="absolute -top-3 left-3 right-3 h-[94%] rounded-3xl bg-card/90 border border-border rotate-[1.5deg]" />

                  {/* Front card */}
                  <div className="relative tilt grain conic-ring rounded-3xl">
                    <div className="relative bg-card border border-border rounded-3xl p-5 shadow-card overflow-hidden">
                      {/* Window chrome */}
                      <div className="flex items-center gap-2 text-xs text-text2 mb-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        <span className="ml-2 font-mono">flirtyai · suggest</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          streaming
                        </span>
                      </div>

                      <div className="space-y-3 tilt-pop">
                        <div className="flex justify-end">
                          <div className="bg-brand-gradient text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-[82%] shadow-cta">
                            “you give librarian energy but i bet your playlist is unhinged”
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-card2 border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm max-w-[82%]">
                            “okay calling me out at 11pm is wild 😭 prove it — what would you put on it?”
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-brand-gradient text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-[82%] shadow-cta">
                            “phoebe bridgers, mitski, and exactly one charli xcx song to scare you 🫣
                            <span className="caret" />”
                          </div>
                        </div>
                      </div>

                      {/* Footer meta */}
                      <div className="mt-5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="chip chip-soft">
                            <Flame size={12} className="text-brand" /> Playful
                          </span>
                          <span className="chip chip-soft">
                            <Zap size={12} className="text-amber-400" /> Spice 3
                          </span>
                        </div>
                        <span className="pill pill-brand">92% confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === Marquee: platforms === */}
        <section className="relative py-6 border-y border-border/60 bg-card/30 backdrop-blur">
          <div className="marquee">
            <div className="marquee-track">
              {Array.from({ length: 2 }).map((_, dup) => (
                <div key={dup} className="flex items-center gap-10 px-5">
                  {[
                    "Tinder",
                    "Bumble",
                    "Hinge",
                    "Instagram",
                    "WhatsApp",
                    "iMessage",
                    "Snap",
                    "Discord",
                    "Telegram",
                    "X / DM",
                  ].map((p) => (
                    <span
                      key={`${dup}-${p}`}
                      className="text-text2/80 font-display font-semibold tracking-tight text-lg sm:text-xl whitespace-nowrap"
                    >
                      {p}
                      <span className="ml-10 text-brand/60">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === Bento features === */}
        <section id="features" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-brand mb-3">Features</div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                A whole <span className="gradient-text-animated">flirt-ops</span> stack.
              </h2>
              <p className="text-text2 mt-3 max-w-xl">
                Nine tools, one canvas. Built for the way modern conversations actually move.
              </p>
            </div>
            <Link
              href="/app"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-brand hover:text-brand2 transition"
            >
              Open the suite
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="bento">
            {/* Big hero feature */}
            <div className="b-4 reveal group relative overflow-hidden bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card hover:border-brand/40 transition">
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl bg-brand-gradient opacity-20 group-hover:opacity-30 transition" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient grid place-items-center shadow-cta">
                  <Flame size={18} className="text-white" />
                </div>
                <span className="text-xs uppercase tracking-widest text-text2">Reply Suggester</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
                Three replies, three vibes, one tap to send.
              </h3>
              <p className="text-text2 mt-3 max-w-md">
                Drop a screenshot or paste the chat. Get calibrated reply options with confidence,
                reasoning, and a pivot move when you need to change lanes.
              </p>
              <div className="mt-5 grid sm:grid-cols-3 gap-2">
                {[
                  { t: "Playful", c: "92%" },
                  { t: "Sincere", c: "81%" },
                  { t: "Smooth", c: "77%" },
                ].map((x, i) => (
                  <div
                    key={x.t}
                    className="glass rounded-2xl p-3 text-xs flex items-center justify-between"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <span className="text-text2">{x.t}</span>
                    <span className="pill pill-brand">{x.c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tone & spice */}
            <div className="b-2 reveal bg-card border border-border rounded-3xl p-6 shadow-card hover:border-brand/40 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-border grid place-items-center mb-3">
                <Wand2 size={18} className="text-brand" />
              </div>
              <div className="font-semibold mb-1">Tone × Spice dial</div>
              <p className="text-sm text-text2">11 tones, 5 spice levels — instant rewrites.</p>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i < 3 ? "bg-brand-gradient" : "bg-card2 border border-border"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="b-2 reveal bg-card border border-border rounded-3xl p-6 shadow-card hover:border-brand/40 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-border grid place-items-center mb-3">
                <Languages size={18} className="text-brand" />
              </div>
              <div className="font-semibold mb-1">Native in 12 languages</div>
              <p className="text-sm text-text2">Localized vibes, not Google-translate energy.</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["EN", "FR", "DE", "ES", "PT", "IT", "JP", "KO", "ZH", "AR", "NL", "PL"].map((c) => (
                  <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card2 border border-border text-text2">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Opener */}
            <div className="b-2 reveal bg-card border border-border rounded-3xl p-6 shadow-card hover:border-brand/40 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-border grid place-items-center mb-3">
                <MessageSquare size={18} className="text-brand" />
              </div>
              <div className="font-semibold mb-1">Opener Crafter</div>
              <p className="text-sm text-text2">From their bio + a vibe, openers nobody else will send.</p>
            </div>

            {/* Bio booster */}
            <div className="b-2 reveal bg-card border border-border rounded-3xl p-6 shadow-card hover:border-brand/40 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-border grid place-items-center mb-3">
                <Wrench size={18} className="text-brand" />
              </div>
              <div className="font-semibold mb-1">Bio Booster</div>
              <p className="text-sm text-text2">Punchy, specific, unmistakably you. Five variants, instantly.</p>
            </div>

            {/* Date ideas */}
            <div className="b-2 reveal bg-card border border-border rounded-3xl p-6 shadow-card hover:border-brand/40 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-border grid place-items-center mb-3">
                <Heart size={18} className="text-brand" />
              </div>
              <div className="font-semibold mb-1">Date Plans</div>
              <p className="text-sm text-text2">Place + budget aware. Confirm sequence ready to send.</p>
            </div>

            {/* Analysis (wide) */}
            <div className="b-4 reveal group relative overflow-hidden bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card hover:border-brand/40 transition">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-brand-soft opacity-50 pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-border grid place-items-center">
                  <BarChart3 size={18} className="text-brand" />
                </div>
                <span className="text-xs uppercase tracking-widest text-text2">Conversation Analysis</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight">
                Vibe meter, red flags, momentum.
              </h3>
              <p className="text-text2 mt-2 max-w-md">Know when to push, pivot, or pause — backed by signals from the chat.</p>
              {/* mini meter */}
              <div className="mt-5 space-y-2 max-w-md">
                {[
                  { l: "Engagement", v: 84, c: "from-emerald-400 to-emerald-300" },
                  { l: "Reciprocity", v: 67, c: "from-amber-400 to-amber-300" },
                  { l: "Tension", v: 41, c: "from-rose-500 to-pink-400" },
                ].map((m) => (
                  <div key={m.l} className="text-xs">
                    <div className="flex justify-between text-text2 mb-1">
                      <span>{m.l}</span>
                      <span className="font-mono">{m.v}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-card2 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${m.c}`} style={{ width: `${m.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="b-3 reveal bg-card border border-border rounded-3xl p-6 shadow-card hover:border-brand/40 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-border grid place-items-center mb-3">
                <Lock size={18} className="text-brand" />
              </div>
              <div className="font-semibold mb-1">Private by default</div>
              <p className="text-sm text-text2">
                Conversations stay on your device. BYO API key. Zero analytics. Ever.
              </p>
            </div>

            {/* Speed */}
            <div className="b-3 reveal bg-card border border-border rounded-3xl p-6 shadow-card hover:border-brand/40 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-border grid place-items-center mb-3">
                <Zap size={18} className="text-brand" />
              </div>
              <div className="font-semibold mb-1">Lightning fast</div>
              <p className="text-sm text-text2">Streaming responses, prompt caching, shareable result links.</p>
            </div>
          </div>
        </section>

        {/* === Demos === */}
        <section id="demos" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-brand mb-3">Live demos</div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Real chats. <span className="gradient-text-animated">Real saves.</span>
              </h2>
              <p className="text-text2 mt-3 max-w-xl">
                Hand-picked scenarios. Pick a vibe, see the analysis, ship the reply.
              </p>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-sm text-brand hover:text-brand2 transition"
            >
              View all demos
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_SCENARIOS.slice(0, 6).map((s, i) => (
              <Link
                key={s.id}
                href={`/demo?id=${s.id}`}
                className="reveal tilt group relative overflow-hidden bg-card border border-border rounded-3xl p-5 hover:border-brand/50 transition shadow-card hover:shadow-glow"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl bg-brand-gradient opacity-0 group-hover:opacity-25 transition duration-500" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="chip chip-soft uppercase text-[10px] tracking-widest">
                      {s.platform}
                    </span>
                    <span className="text-[10px] text-muted">#{i + 1}</span>
                  </div>
                  <ArrowUpRight size={14} className="text-text2 group-hover:text-brand transition" />
                </div>
                <div className="font-display font-semibold text-lg leading-snug mb-2">
                  {s.title}
                </div>
                <div className="text-sm leading-relaxed text-text2 line-clamp-3 italic">
                  “{s.conversation[s.conversation.length - 1]?.text || ""}”
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {s.replies.slice(0, 3).map((sg, idx) => (
                      <span
                        key={`${sg.risk}-${idx}`}
                        className="text-[10px] uppercase tracking-wide bg-card2 border border-border rounded-full px-2 py-0.5 text-text2"
                      >
                        {sg.risk}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-text2 group-hover:text-brand transition">Open →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* === How it works (timeline) === */}
        <section id="how" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-brand mb-3">How it works</div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight mb-12">
            Three steps. Ten seconds. <span className="gradient-text-animated">Magic.</span>
          </h2>

          <div className="relative grid md:grid-cols-3 gap-6">
            {/* Connector line (desktop) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
            />
            {[
              {
                n: "01",
                title: "Drop the chat",
                blurb: "Screenshot, image, or paste — FlirtyAI parses platform, tone, and intent.",
                icon: MessageSquare,
              },
              {
                n: "02",
                title: "Pick the vibe",
                blurb: "Set tone (playful, sincere, dry, smooth…) and spice (1–5). Add a one-line nudge.",
                icon: Wand2,
              },
              {
                n: "03",
                title: "Send the winner",
                blurb: "Pick from 3 distinct options. Save winners. Share or export anytime.",
                icon: Sparkles,
              },
            ].map((s, i) => (
              <div
                key={s.n}
                className="reveal relative bg-card border border-border rounded-3xl p-6 shadow-card hover:border-brand/40 transition"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="absolute -top-6 left-6 w-12 h-12 rounded-2xl bg-brand-gradient grid place-items-center shadow-cta pulse-ring">
                  <s.icon size={18} className="text-white" />
                </div>
                <div className="text-xs text-brand font-mono mt-4 mb-2">{s.n}</div>
                <div className="text-xl font-display font-semibold mb-2">{s.title}</div>
                <div className="text-sm text-text2">{s.blurb}</div>
              </div>
            ))}
          </div>
        </section>

        {/* === Testimonials marquee === */}
        <section id="love" className="relative py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-brand mb-3">Reviews</div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
              People are{" "}
              <span className="gradient-text-animated">soft-launching FlirtyAI</span>{" "}
              already.
            </h2>
          </div>

          <div className="marquee py-2">
            <div className="marquee-track gap-5">
              {Array.from({ length: 2 }).map((_, dup) => (
                <div key={dup} className="flex gap-5">
                  {TESTIMONIALS.map((t) => (
                    <figure
                      key={`${dup}-${t.author}`}
                      className="w-[340px] sm:w-[400px] shrink-0 bg-card border border-border rounded-3xl p-6 shadow-card"
                    >
                      <Quote size={18} className="text-brand mb-3" />
                      <blockquote className="text-sm text-text2 leading-relaxed italic">
                        “{t.quote}”
                      </blockquote>
                      <figcaption className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full bg-brand-gradient grid place-items-center text-white text-xs font-bold"
                            aria-hidden
                          >
                            {t.author.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{t.author}</div>
                            <div className="text-[11px] text-muted">{t.role}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className="text-amber-400" fill="currentColor" />
                          ))}
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === Privacy & PWA === */}
        <section className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="reveal relative overflow-hidden bg-card border border-border rounded-3xl p-8 shadow-card">
              <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl bg-emerald-400/15" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 grid place-items-center">
                  <Lock size={18} className="text-emerald-300" />
                </div>
                <div className="font-display font-semibold text-lg">Private by design</div>
              </div>
              <p className="text-text2 text-sm leading-relaxed">
                Conversations stay on your device. We don&apos;t train on your data. Bring your own
                OpenAI / Anthropic / Google key — or use the local fallback for demos. No accounts,
                no tracking, no surprises.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-text2">
                {["E2E local storage", "No analytics", "BYO key", "Open source*"].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal relative overflow-hidden bg-card border border-border rounded-3xl p-8 shadow-card">
              <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl bg-brand/20" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient/20 border border-brand/30 grid place-items-center">
                  <Globe2 size={18} className="text-brand" />
                </div>
                <div className="font-display font-semibold text-lg">Install as a PWA</div>
              </div>
              <p className="text-text2 text-sm leading-relaxed">
                Works offline once installed. Add to home screen on iOS/Android, or install on
                desktop with one click. Native share targets supported.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {["iOS", "Android", "macOS", "Windows", "Linux"].map((x) => (
                  <span key={x} className="chip chip-soft">{x}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === Final CTA === */}
        <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-28">
          <div className="reveal relative overflow-hidden rounded-[32px] border border-border shadow-card">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-card" />
            <div className="absolute inset-0 aurora opacity-90" />
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-40 bg-brand-gradient"
            />
            <div
              aria-hidden
              className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 bg-purple-500/40"
            />

            <div className="relative grid md:grid-cols-5 gap-8 p-10 sm:p-14 items-center">
              <div className="md:col-span-3">
                <div className="inline-flex items-center gap-2 chip chip-soft mb-5">
                  <Clock size={12} /> 10 seconds to your next great reply
                </div>
                <h3 className="text-3xl sm:text-5xl font-display font-bold tracking-tight leading-[1.05]">
                  Stop overthinking. <span className="gradient-text-animated">Send it.</span>
                </h3>
                <p className="mt-4 text-text2 max-w-md text-lg">
                  Open FlirtyAI in your browser. No download, no account. The next reply is one tap away.
                </p>
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
                <Link
                  href="/app"
                  className="btn-glow inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold rounded-2xl px-7 h-16 text-lg shadow-cta"
                >
                  <Sparkles size={18} />
                  Open FlirtyAI
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 bg-card border border-border rounded-2xl px-6 h-14 text-text hover:bg-card2 transition"
                >
                  <MessageSquare size={16} />
                  Try a live demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* === Footer === */}
      <footer className="relative border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm text-text2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient grid place-items-center shadow-cta">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-text">FlirtyAI</div>
              <div className="text-[11px] text-muted">© {new Date().getFullYear()} · made with care.</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/demo" className="hover:text-text">Demos</Link>
            <a href="#features" className="hover:text-text">Features</a>
            <a href="#how" className="hover:text-text">How it works</a>
            <a href="#love" className="hover:text-text">Reviews</a>
            <Link href="/app" className="hover:text-text">Open app</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const TESTIMONIALS: { quote: string; author: string; role: string }[] = [
  {
    quote:
      "The reply suggester literally read the energy off a 1-line text. We have a date Friday.",
    author: "Maya K.",
    role: "Product designer · Brooklyn",
  },
  {
    quote:
      "My openers used to flop. FlirtyAI gave me three I'd actually send — one of them got an instant reply.",
    author: "Theo R.",
    role: "Software engineer · Berlin",
  },
  {
    quote:
      "The vibe meter is wild. It told me to pivot and the convo unstuck in two messages.",
    author: "Priya S.",
    role: "PhD student · London",
  },
  {
    quote:
      "Bio booster turned my Hinge profile into something my friends actually screenshot.",
    author: "Lina M.",
    role: "Photographer · Lisbon",
  },
  {
    quote:
      "I love that nothing leaves my phone. Privacy-first dating tools shouldn't be rare, but here we are.",
    author: "Daniel A.",
    role: "Privacy researcher · Amsterdam",
  },
  {
    quote:
      "Spice 4 + dry tone is dangerously good. Use responsibly.",
    author: "Riko N.",
    role: "DJ · Tokyo",
  },
];
