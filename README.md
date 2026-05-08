# FlirtyAI

> Your AI wingperson. Upload a chat screenshot, pick a vibe, get replies that actually land — in English, French, Arabic, or Moroccan Darija.

Live demo: [`/demo`](./app/demo) · App: [`/app`](./app/app) · Landing: [`/`](./app/page.tsx)

---

## What it is

FlirtyAI is a dating-text wingperson built as a Next.js PWA. Drop a chat screenshot, calibrate the vibe, and a vision-capable LLM produces reply options calibrated to where the conversation is headed — not generic "hey how are you" garbage.

Beyond raw suggestions, it also roasts the last message you sent, generates openers from a bio, plans dates with ready-to-send pitches, drafts closure messages, rewrites your dating profile, and runs a chat coach you can ask anything. All output can be in English, French, Modern Standard Arabic, Moroccan Darija in Arabic script (الدارجة), or Moroccan Darija in Latin/Arabizi script (`labas 3lik`, `wach kayna`).

It's a side project by [Rabie](https://github.com/eibaRRR). No sign-up, no tracking, screenshots are processed in real-time and never stored on the server. Saved replies, history, and stats live in your browser.

---

## Features

### Five primary tabs

| Tab | What it does |
|---|---|
| **Suggest** | Upload 1–3 screenshots. Pick moods, intensity (1–10), length, language, identities. Get 3–5 reply options tagged Safe / Medium / Bold, each with reasoning. Optional flag-detection on the other person's behavior. |
| **Roast** | Scores your last-sent message out of 10, writes a sharp verdict, lists what worked / what flopped, and gives 2–4 better alternatives. |
| **Tools** | Three sub-modes: **Opener** (first message from a bio), **Date ideas** (with a ready-to-send pitch per idea), **Closure** (mature, warm, cold, honest, brief, or apologetic messages). |
| **Bio** | Paste your dating bio, pick up to 4 vibes (Mysterious / Funny / Sincere / Bold / Smooth / Playful / Minimal / Adventurous), get rewrites that keep the facts but change the energy. |
| **Wing** | Real chat UI with the wingperson. Ask for advice, have it rewrite a message, talk through a situation. |

### Reply features

- **Multi-message mode** — chained double-texts as a sequence of short bubbles
- **Mood blend** — pick up to 3 moods at once for fusion vibes
- **Compare moods** — generate two side-by-side groups with different mood combos
- **Spicy / +18 mode** — opt-in gate. Unlocks explicit content plus 5 extra moods (Dominant, Submissive, Teasing, Possessive, Filthy). Hard lines remain (no minors, non-consent, slurs, threats).
- **Predict reaction** — see how the other person is likely to respond to a candidate reply
- **More like this** — regenerate variations on a reply you liked
- **Conversation summary** — quick TL;DR of where things stand, stage, vibe, next move recommendation
- **Save to favorites** — bookmark replies you love, browse them in the Saved drawer
- **Share as image** — render a reply card to a 1080×1350 PNG for Instagram Story / TikTok sharing, using `navigator.share` where supported and falling back to download
- **A/B success tracking** — mark replies as Worked / Flopped. The Stats drawer shows your success rate overall and broken down by risk level, mood, and language

### Humanized AI output

The AI prompts include a `HUMAN_TEXTER_GUIDE` block that explicitly bans the usual AI tells (em dashes as literary flex, "I have to admit", symmetrical "not just X but Y" sentences, triple-period mystery dots, "I'd love to", etc.) and enforces real-texter patterns (mirror capitalization and punctuation density, specificity over vibes, tease over praise, subtext over declaration, leave things unsaid). Calibrated intensity is risk and assertiveness, not volume. Every output obeys the guide across Suggest, Roast, Opener, Wing, and Predict.

### Multilingual

- **Moroccan Darija** — Arabic script (الدارجة المغربية) and Latin/Arabizi with the digits 3 (ع), 7 (ح), 9 (ق), 5 (خ), 8 (غ), 2 (ء). Example: `labas 3lik?`, `bghit nchoufk`, `wach kayna`
- **French** — casual, familiar register
- **Modern Standard Arabic**
- **English**
- **Auto** — mirrors the conversation's language, script, and code-switching

### App shell

- **Desktop**: collapsible left sidebar (260 → 68 px) with brand mark, ⌘K trigger, tabs with active gradient indicator, workspace section (Saved / History / Stats) with badge counts, theme cycle button, settings
- **Mobile**: sticky blurred top bar + bottom 5-tab nav with safe-area padding + animated active-tab gradient indicator. Overflow menu for workspace features
- **Command palette** (⌘K / Ctrl-K): 13+ grouped actions (Navigate, Workspace, Theme, Settings), arrow-key navigation, instant filter
- **Drawers** (Settings, History, Saved, Stats): slide-in side drawer on desktop, bottom sheet with grab handle on mobile, backdrop blur, focus trap, ESC to close
- **Theme picker**: light / dark / system, with flash-free initialization via a pre-paint script
- **PWA**: installable via manifest, `start_url: /app` so the installed app opens straight into the tool
- **Toasts**: success / error / info, translucent blurred surface, gradient left bar, auto-dismiss

### Routing

| Path | Purpose |
|---|---|
| `/` | Landing page (marketing) |
| `/demo` | Demo gallery — 3 scenario cards with mini chat previews |
| `/demo/[id]` | Individual demo page with its own URL, SEO metadata, full scenario preview |
| `/app` | The actual app |
| `/api/suggest` | Reply suggestions + compare + roast |
| `/api/summary` | Conversation TL;DR |
| `/api/predict` | Predict their reaction |
| `/api/opener` | Opener generator (no images) |
| `/api/date-ideas` | Date plan generator |
| `/api/closure` | Closure message drafter |
| `/api/bio` | Bio rewriter |
| `/api/wingperson` | Chat coach |
| `/api/models` | Public model metadata |

Demo pages are statically prerendered at build time for instant loads.

### Demo mode

Every scenario on `/demo/[id]` is a guided 2-step preview:

1. **The conversation** — rendered phone-style with alternating gray/gradient bubbles, the match's name, timestamps, and a "↓ FlirtyAI replies to this" divider
2. **Settings used** — mood, intensity, language, and the user goal that produced the canned replies
3. **Replies** — same ReplyCards as the real app, but with a brand-gradient stripe on the left edge, Predict / More-like-this buttons hidden (they'd need a real screenshot), and Worked / Flopped locked so demo views don't pollute real stats

Three scenarios ship in `lib/demo.ts`:
- `left-on-read` — cold after two days of banter
- `first-message` — fresh match with hookable bio details
- `ask-out` — week of rapport, time to propose meeting up

---

## Tech stack

- **Next.js 14** (App Router) · React 18 · TypeScript 5
- **Tailwind CSS 3** with CSS-variable-driven tokens (3 surface levels per theme, mode-aware shadows, pink/purple brand gradient, `hero-glow` blob keyframes, grain overlay)
- **next/font** — Inter (UI) + Instrument Serif (editorial italic)
- **lucide-react** icons, **clsx** + **tailwind-merge** for class composition, **zod** for validation
- **OpenAI SDK** pointed at NVIDIA NIM (works for both Llama 4 Maverick and Kimi K2.6)

### Design system

- `app/globals.css` defines every design token as a CSS variable, mode-aware. `tailwind.config.ts` re-exports them as Tailwind colors (`surface`, `surface2`, `surface3`, `text2`, `borderStrong`, `warm` + backwards-compat aliases)
- Shared primitives in `components/ui/`:
  - `Button` — `primary` / `solid` / `ghost` / `outline` / `danger` · `sm` / `md` / `lg` · loading state with animated 3-dot wave
  - `Pill` — selectable chip with tonal selected states
  - `Card` + `CardHeader` with optional `accent` hover rings and gradient border
  - `Slider` — custom pink slider with gradient fill and live mono value badge
  - `Segmented` — FLIP-style sliding indicator using measured `ResizeObserver`
  - `Section` — form-group wrapper with eyebrow + trailing slot
  - `Tooltip`, `EmptyState`, `ProgressDots`, `IconButton`
- `Toggle` with icon-card variant, `OverflowMenu`, `Drawer` with bottom-sheet mode, `CommandPalette`, `Sidebar`, `Toaster`, `Skeleton`

---

## Quick start

```bash
npm install
cp .env.example .env.local
# edit .env.local — paste your NVIDIA NIM key(s)
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The landing page is at `/`, the app is at `/app`, demos are at `/demo`.

### Environment variables

| Var | What | Required |
|---|---|---|
| `MAVERICK_API_KEY` | NVIDIA NIM key for Llama 4 Maverick. Get one at [build.nvidia.com](https://build.nvidia.com/). | Yes (or set `LLM_API_KEY`) |
| `KIMI_API_KEY` | NVIDIA NIM key for Kimi K2.6. Same source. | Optional |
| `LLM_API_KEY` | Fallback if you only have one key — used when the model-specific key is missing. | Optional |
| `MAVERICK_BASE_URL` | Override base URL for Maverick. Default `https://integrate.api.nvidia.com/v1`. | Optional |
| `KIMI_BASE_URL` | Override base URL for Kimi. Same default. | Optional |
| `LLM_MAX_TOKENS` | Cap. Default `1500` (`1000` in the example). | Optional |
| `LLM_TEMPERATURE` | Default `1.05` (humanization bump). Lower it for safer output. | Optional |
| `LLM_REASONING_EFFORT` | Override reasoning effort (auto-set to `none` for Mistral). | Optional |
| `LLM_EXTRA_PARAMS` | JSON-encoded extras to merge into the chat completion request body. | Optional |
| `SITE_URL` | Sent as `HTTP-Referer` header. | Optional |
| `SITE_NAME` | Sent as `X-Title` header. | Optional |

### Deploy to Vercel

```bash
vercel
```

Add the env vars in the Vercel project settings for Production, Preview, and Development. Vercel auto-detects Next.js — no other configuration needed. The repo at [github.com/eibaRRR/FlirtyAI](https://github.com/eibaRRR/FlirtyAI) is already wired to auto-redeploy on push to `main`.

---

## Project structure

```
app/
  page.tsx                    # landing page
  layout.tsx                  # fonts + ToasterProvider + theme init script
  globals.css                 # design tokens + animations
  manifest.ts                 # PWA manifest
  app/page.tsx                # the actual app (sidebar shell + tabs)
  demo/page.tsx               # demo gallery
  demo/[id]/page.tsx          # individual demo pages (statically prerendered)
  api/
    suggest/route.ts          # reply suggestions + compare mode + roast
    summary/route.ts          # conversation TL;DR
    predict/route.ts          # predict their reaction
    opener/route.ts           # openers from a bio
    date-ideas/route.ts       # date plans with pitches
    closure/route.ts          # closure messages
    bio/route.ts              # bio rewriter
    wingperson/route.ts       # chat coach
    models/route.ts           # public model metadata

components/
  Sidebar.tsx                 # desktop sidebar
  CommandPalette.tsx          # ⌘K palette
  OverflowMenu.tsx            # mobile overflow dropdown
  Drawer.tsx                  # side drawer + bottom sheet
  SettingsDrawer.tsx
  HistoryDrawer.tsx
  SavedDrawer.tsx
  StatsDrawer.tsx
  Toaster.tsx                 # ToasterProvider + useToast + useCopyWithToast
  SuggestTab.tsx              # main Suggest flow
  RoastTab.tsx
  WingChat.tsx                # real chat UI
  ToolsTab.tsx                # Opener · Date ideas · Closure sub-nav
  OpenerTab.tsx
  DateIdeasTab.tsx
  ClosureTab.tsx
  BioTab.tsx
  MultiUploader.tsx           # drop zone / filmstrip
  MoodControls.tsx            # mood chips + intensity slider
  GenderToggle.tsx
  LanguageSelector.tsx
  Segmented.tsx               # FLIP-style indicator
  Toggle.tsx
  ReplyCard.tsx               # iMessage-style bubbles + action row
  AnalysisPanel.tsx           # "Read of the situation"
  RoastResult.tsx             # editorial roast layout
  Skeleton.tsx
  DemoView.tsx                # standalone demo layout
  DemoConversationPreview.tsx # phone-style fake chat
  ui/
    Button.tsx · IconButton.tsx · Card.tsx · Pill.tsx · Slider.tsx
    Tooltip.tsx · EmptyState.tsx · ProgressDots.tsx · Section.tsx
    index.ts

lib/
  llm.ts                      # NVIDIA NIM client + all generation functions
  prompt.ts                   # system prompts + HUMAN_TEXTER_GUIDE
  schema.ts                   # Zod schemas + enums (moods, languages, tones…)
  models.ts                   # model registry (Maverick + Kimi)
  storage.ts                  # localStorage hooks (persona, settings, history, saved, stats)
  theme.ts                    # useTheme + pre-paint init script
  pwa.ts                      # useInstallPrompt
  demo.ts                     # canned scenarios
  share.ts                    # render ReplyCard to PNG + navigator.share
  utils.ts                    # cn() helper

public/
  icon.svg                    # PWA + favicon
```

---

## How it works

1. User drops a chat screenshot (auto-resized to ≤1024 px to save tokens), picks moods + intensity + length + identities, optionally writes their goal.
2. The relevant `/api/...` route validates input with Zod, base64-encodes each image, builds a system prompt from `lib/prompt.ts` (injecting `HUMAN_TEXTER_GUIDE` + spicy guardrails if adult mode is on), and calls the selected model via OpenAI-compatible SDK pointed at NVIDIA NIM.
3. The model returns structured JSON matching the Zod schema for that task (`SuggestOutputSchema`, `RoastOutputSchema`, etc.). If the first call returns invalid JSON, the server retries in "strict mode" with a stronger system reminder before surfacing the error.
4. The UI renders cards with gradient chat-bubble messages, dot-style risk badges, ghost icon-button action rows, and stagger animations.

All user data — persona, settings, history, saved replies, reply stats, theme preference — lives in `localStorage` under versioned keys (`flirtyai.persona.v1`, `flirtyai.history.v1`, `flirtyai.settings.v1`, `flirtyai.saved.v1`, `flirtyai.stats.v1`, `flirtyai.theme.v1`). Screenshots are sent to the model and never stored server-side.

---

## Safety

- Hard rules enforced in every prompt: no harassment, slurs, threats, content targeting minors, or manipulation tactics — ever, including in adult mode
- Adult mode is opt-in behind an acknowledgement modal that requires users to confirm they are 18+. Preference is stored locally
- If the model infers the other person may be a minor, it's instructed to refuse and return a structured error instead of generating replies
- Adult mode does not unlock non-consent, pressure tactics, or hate speech

---

## Credit

Made with care by [Rabie](https://github.com/eibaRRR). All results are AI-generated — use your judgment.
