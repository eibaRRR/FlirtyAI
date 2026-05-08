# FlirtyAI — Visual & Interaction Redesign Brief

You are a senior product designer + front-end engineer. Your job is to do a **complete visual & UX overhaul** of an existing Next.js 14 (App Router) + Tailwind app called **FlirtyAI**. All product features must keep working — only the look, layout, hierarchy, motion, and feel should change. Make it **modern, opinionated, eye-catching, and editorial** — not generic SaaS.

This brief is the source of truth. Read it end to end before touching any file.

---

## 1. Product context (so the design has a soul)

FlirtyAI is a **dating-text wingperson**. Users upload chat screenshots and get reply suggestions, plus tools for openers, date ideas, closure messages, bio rewrites, an AI roast of their last message, and a chat coach. The app supports Moroccan Darija (Arabic + Latin script), French, English, Arabic. There is an opt-in **+18 / Spicy mode** that unlocks NSFW replies and extra moods.

**Audience:** 18–34, mobile-first, late-night users, switches between casual and spicy. Expects something that feels closer to **Linear / Arc / Vercel / Cred / Granola** than to a Bootstrap CRUD form. Should feel **playful, bold, a little risqué, but premium** — never tacky, never childish, never stocky-stocky.

**Tone of design**: confident, flirty, tasteful. Pink + purple gradient is core to the brand and should be used **rarely and powerfully** — not painted across every surface.

---

## 2. Mission

Take the current implementation (functional but visually generic — gradient header, plain cards, dense forms) and redesign it into a UI that feels **alive, modern, and crafted**. Specifically:

- Strong visual hierarchy: hero moments where it counts (results, the Suggest CTA, the spicy state), calm everywhere else.
- Editorial layout instead of forms-on-forms.
- Generous whitespace, sharp typography, thoughtful motion.
- A real **identity**: when a user opens it they should know "this is FlirtyAI" before reading any text.
- Mobile-first but the **desktop layout should not just be "phone but wider"** — give it a proper multi-column / sidebar where it earns its keep.

---

## 3. Brand & mood

**Mood board (verbal):** Linear's product calm + Arc's softness + a smoky neon late-night bar with a single pink sign. Editorial magazine ("a personal love coach" featurette), not "AI productivity dashboard".

**Aesthetic primitives**:
- Glassy translucent surfaces with subtle internal highlights (top-inset white at low alpha, like macOS).
- One **signature gradient** (pink → purple) used as a brand mark / accent, not as a button-paint.
- Ambient glow behind hero areas (gradient blobs) — like Vercel's hero, but warmer and pinker.
- Clean, geometric type. Big numbers when there are stats. Italic serif accents for editorial moments (e.g., the "How they might respond" quote treatment).
- **Grain / noise overlay** on backgrounds at very low opacity (~3-4%) to fight banding and feel premium.

**Don't do**:
- Heart emoji confetti, cartoon characters, candy stripes.
- Full-screen pink gradients on every panel.
- Material Design ripples, glassmorphism on every card, neon outlines everywhere.
- Stock illustration libraries.

---

## 4. Design system (build this first, in `app/globals.css` + `tailwind.config.ts`)

### Colors (CSS variables, RGB triplets so Tailwind opacity works)

Already wired via CSS custom properties — keep that approach. Refine the palette:

**Dark theme (default)**
- `--c-bg`: deep midnight, slightly warm (e.g. `12 12 18`)
- `--c-surface`: `18 18 26` — primary card surface
- `--c-surface-2`: `26 26 38` — nested surface
- `--c-surface-3`: `36 36 50` — floating popovers
- `--c-border`: `42 42 56`
- `--c-border-strong`: `64 64 82`
- `--c-text`: `245 245 250`
- `--c-text-2`: `175 175 190` — secondary
- `--c-muted`: `120 120 135`
- `--c-pink`: `255 70 145`
- `--c-purple`: `170 90 255`
- `--c-accent-warm`: `255 180 110` — for "tip" / "spicy halo" highlights, used very sparingly
- Status: `--c-safe 52 211 153`, `--c-med 250 176 5`, `--c-bold 244 79 95`

**Light theme**
- `--c-bg`: `250 248 252` (warm off-white, NOT pure #FAFAFA)
- `--c-surface`: `255 255 255`
- `--c-surface-2`: `247 245 252`
- `--c-surface-3`: `255 255 255`
- `--c-border`: `230 226 240`
- `--c-border-strong`: `205 200 220`
- `--c-text`: `22 18 30`
- `--c-text-2`: `90 86 110`
- `--c-muted`: `135 130 155`
- `--c-pink`: `230 50 120` (slightly deeper for contrast)
- `--c-purple`: `135 70 220`
- Status: keep darker/saturated variants for AA contrast

**Gradient**: `linear-gradient(135deg, rgb(var(--c-pink)) 0%, rgb(var(--c-purple)) 100%)`. Use only for: brand mark, primary CTA when "hero", active tab indicator, mood-pill when selected, and the small "Spicy mode active" chip. **Not** for every selected state.

### Typography

Use **Inter** for UI (variable font, tabular numbers on for stats). For editorial accents (the "How they might respond" header, the brand wordmark, key headlines on empty states), use **Instrument Serif** or **Fraunces** italic, loaded via `next/font/google`. Two fonts max.

Type scale (mobile → desktop):
- `display`: 36 → 56, serif italic, tight tracking (-0.02em)
- `h1`: 24 → 32, sans 700
- `h2`: 18 → 22, sans 600
- `body`: 15 → 16, sans 400, line-height 1.55
- `body-sm`: 13 → 14
- `caption`: 11 → 12, uppercase, tracking 0.08em, used for section eyebrows like "REPLIES" / "ANALYSIS"

Use `font-feature-settings: "ss01", "cv11"` on Inter for the cleaner shapes.

### Spacing

Stick to a 4-pt scale (Tailwind defaults are fine), but make the **section rhythm** generous: `gap-y-6` minimum between major sections on mobile, `gap-y-10` on desktop. Cards have `p-5` mobile / `p-6` desktop. **No 16px cramping.**

### Radii

- 10px for inputs and chips
- 14px for small cards / sub-cards
- 20px for primary cards
- 28px for sheets / drawers / hero containers
- Rounded-full only for pills and avatars

### Shadows

Two named shadow tokens, mode-aware:
- `--shadow-card`: very soft, layered. Dark mode: barely-there outer + inset highlight at top. Light mode: real soft drop shadow (`0 1px 2px rgba(0,0,0,.04), 0 12px 32px -16px rgba(20,20,40,.10)`)
- `--shadow-pop`: for floating popovers / drawers — bigger, longer

### Motion

- Default easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (used everywhere)
- Snappy easing for closes: `cubic-bezier(0.4, 0, 1, 0.4)`
- Entrance staggers at 60ms steps
- Respect `prefers-reduced-motion: reduce`
- Skeleton shimmer loop ~1.4s
- All hover transitions ≤ 180ms
- Page-level: when switching tabs, content fades + slides up 8px in 250ms

---

## 5. Layout & information architecture

### Desktop ( ≥ 1024px ) — proper app shell

```
┌─────────────────────────────────────────────────────────────┐
│  [Brand]  ───  Suggest · Roast · Tools · Bio · Wing  ── ⚙ │  ← top bar (sticky, blurred)
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│  Sidebar │              Main content area                   │
│  (Saved, │              (max-w 720px, centered)             │
│  History,│                                                  │
│  Stats)  │                                                  │
│          │                                                  │
│ collapsi-│                                                  │
│ ble      │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

- Left **collapsible sidebar** (260px wide, collapses to icon rail at 64px) for Saved / History / Stats / Persona quick-edit. Replaces the current right-side drawers on desktop.
- Top bar stays sticky, blurred. Brand mark on the left, **horizontal tab pills centered**, settings cog on the right. No badges — counts move into the sidebar.
- Main content has a **max-w of 720px**, centered. Keep generous gutter on each side.
- A small floating "What's new / Tips" card on the right (xl screens only) with rotating one-liner tips ("Press ⌘K to summarize", "Try Compare moods to A/B-test vibes"). Subtle — not a popover.

### Tablet ( 768px – 1023px )

- Same as desktop but sidebar collapses to icon rail by default.
- Tabs stay horizontal at the top.

### Mobile ( <768px )

- Top bar: brand mark + **single overflow menu button** + settings cog.
- **Bottom navigation bar** with 5 icon+label slots (Suggest / Roast / Tools / Bio / Wing). Active state: animated pink-purple gradient underline + label color flip. Respect `safe-area-inset-bottom`.
- Drawers become **bottom sheets** with a grab handle, drag-to-dismiss, snap points if practical.
- All forms become **single-column with sticky bottom CTA** (Generate button) so users never have to scroll back up to act.

### Global navigation primitives

- ⌘K (Cmd/Ctrl-K) opens a **command palette** with: jump to tab, open Settings, toggle Spicy mode, toggle theme, open Saved, summarize current screenshot, etc. Built from scratch (no `cmdk` lib unless trivial).
- Theme toggle has a **small animated sun/moon morph** (CSS or a tiny SVG path).

---

## 6. Per-screen direction

### 6.1 Suggest tab (the hero of the app)

This is where 80% of usage lives. It must feel premium.

**Top of the tab — when no screenshot is uploaded yet (empty state)**:
- Editorial **hero block**: a serif italic line ("Send the message you'd be proud of.") + a one-sentence subhead, with a soft gradient blob behind it.
- The uploader becomes the **primary visual focus** below the hero — large, bordered with a dashed gradient border, an animated upload icon (gradient stroke), and a clean caption "Drop, paste (⌘V), or click. Up to 3 screenshots."
- Below uploader, a tiny inline row: 3 example "see how it works" thumbnails users can click to **try a demo** (use bundled placeholder images in `/public/demo/*.png`). When clicked, prefills the form and runs a fake demo.

**Top of the tab — once screenshots are uploaded**:
- Uploader collapses into a compact **filmstrip** at the top showing the thumbs in a row with a "+ add" tile.
- Right under it: a **horizontal "Conversation summary" pill** that's clickable and expands to the existing summary card. Initially says "Tap to read the convo first →" with a small spark icon.
- Form fields below stack into clean **labeled groups** with section eyebrows ("THE VIBE", "HOW LONG", "WHO'S WHO", "OUTPUT"). Each group is a soft-bordered card with internal divider lines, NOT a stack of disjoint inputs.

**Mood selector**: Redesign as a **wrap of pill-shaped chips** with a subtle shimmer when selected (gradient fill). Spicy moods sit visually separated under a hairline divider that says "+18 only" with a small flame, only when spicy mode is on. Selected count badge top-right of the section.

**Intensity slider**: replace the basic range with a **custom slider** — a thicker track, a glowing pink thumb, and a tick row from "subtle" to "max" with mid labels at 1, 5, 10. Live numeric value displayed in a monospace pill that animates the count.

**Toggles row** (Mood blend, Compare moods, Multi-message, Detect flags): replace 4 separate toggle cards with a single **2x2 grid of toggle cards** with icons. Each card has a 24px icon top-left, label, tiny 1-liner hint, toggle on the right. Selected card has gradient border and slight scale-up.

**Generate CTA**:
- Desktop: full-width primary gradient button at the bottom of the form.
- Mobile: **sticky** at the bottom, ABOVE the bottom nav, with a translucent blur backdrop. Always visible while scrolling the form.
- During loading: button text rotates through tagline phrases (already exists). Replace the static spinner with a tiny **animated 3-dot wave** in pink + purple. Disable button + show shimmer skeletons in the results area.

**Results section**:
- Section eyebrow: "REPLIES • {n} options" in caption type.
- Each `ReplyCard` is now a **chat-bubble preview** (already started — make it perfect): right-aligned gradient bubble with rounded-tail, sender = "You" tiny label above first bubble. Cards stagger in 60ms apart.
- Risk badge moved to top-LEFT corner as a tiny **dot + label** (a colored dot, then "Bold").
- Action row at bottom of card: 4 icon buttons (Save, Predict, More like this, Copy) using the icon ghost style (no labels by default; reveal on hover/long-press tooltip). On mobile, an extra primary "Copy & open WhatsApp" CTA could chain a copy+share intent (use `navigator.share` if available).
- "Did it land?" row: redesigned as a **single segmented control** with 3 segments (👍 Worked / 😐 Mid / 👎 Flopped) — Mid is new. Already-selected state gets a soft tint + checkmark.
- "Predict reaction" expansion: when expanded, predictions render as a **threaded mini-conversation** below the bubble — left-aligned reply bubbles in `--c-surface-2`, each with a vibe label and likelihood dot. Looks like a real chat.

**Compare mode**:
- When active, results render as a **2-column side-by-side** (or a swipeable carousel on mobile with snap and dot indicators). Each column has its own header pill ("Mood: Flirty + Funny") and an animated **VS** divider in the middle.

### 6.2 Roast tab

Editorial layout:
- Big **score number** centered (display serif italic), e.g. "6.5/10", in gradient text.
- Below it, the verdict in body-large italic.
- Two columns: "WHAT WORKED" (green check icons) | "WHAT FLOPPED" (red x icons). Hairline divider between, with the word "but" set in italic serif at 14px.
- "Better alternatives" section at the bottom: same chat-bubble treatment as Suggest.
- Make the upload step at the top a **compact filmstrip** like Suggest.

### 6.3 Tools tab

- Three-up segmented hero: "Opener · Date Ideas · Closure". Each segment shows a tiny illustration glyph (inline SVG, simple, gradient stroke) when active.
- Tool sub-pages each get a small editorial intro line above the form (one sentence). No huge subhead blocks.
- Date ideas results: card grid (1 col mobile, 2 col tablet+). Each card shows: title (h2), a colored vibe dot, budget tier as a small pill, duration, then the description, then a hovering **"Copy pitch"** affordance.
- Closure tab: tone chips at the top, then **a single column of message cards**, each tagged with the tone (purple pill).

### 6.4 Bio tab

- Input: a single big textarea styled like a real bio editor — character count in the bottom-right, character cap visualized as a thin bar that turns yellow then red.
- Vibe selector becomes a row of **icon chips** (Mysterious 🌙, Funny 😂, etc.). Show 8 chips, multi-select up to 4.
- Results: stack of "bio variant" cards. Each has the vibe pill at the top, the bio text in a bordered "card-within-card" styled like a dating profile preview. Add a **"Use this" → copy to clipboard** primary action.

### 6.5 Wing tab (chat)

- Real chat UI: messages on alternating sides, user on right (gradient bubble), assistant on left (`surface-2` bubble with a small AI badge at top-left of the first message in a sequence).
- Input bar **stuck to the bottom** with a textarea that auto-grows up to 6 lines. Send button is a circular gradient button with the arrow icon.
- Empty state: serif italic prompt suggestions chip-row ("How do I open?", "She left me on read", "Help me ask her out"). Tapping one prefills the input.

---

## 7. Components & primitives to (re)build

Make sure these are first-class components in `/components`:

- `Button` — variants: `primary` (gradient hero), `solid` (filled neutral), `ghost`, `outline`, `danger`. Sizes: `sm`, `md`, `lg`. Loading state baked in (3-dot wave). Icons left or right.
- `IconButton` — square ghost button with hover bg, accessible labels.
- `Card` — elevated surface with `--shadow-card`, optional `accent` ring on hover ("safe" / "med" / "bold" / "pink").
- `Pill` / `Chip` — selectable, with `selected`/`disabled` states; supports a leading icon and trailing remove (×).
- `Toggle` — animated track with a glow on the active state.
- `Segmented` — modern: animated pill background that translates between segments using transform (no opacity flicker).
- `Slider` — custom pink slider with tick marks and live value badge.
- `BottomSheet` / `Drawer` — same component, two modes (already partially done — refine).
- `Tooltip` — small floating tooltip, 200ms delay, fades in.
- `EmptyState` — accepts an icon, headline (serif italic), subhead, optional action button.
- `Skeleton` — primitive + composed (`ReplyCardSkeleton`, `OpenerCardSkeleton`, etc.).
- `CommandPalette` — ⌘K palette.
- `ProgressDots` — animated 3-dot wave used in loading buttons.
- `Banner` — for the small "Spicy mode is active" / inline tips.

All components must:
- Forward refs.
- Support `className` merge via `cn()`.
- Have keyboard focus states.
- Accept ARIA props.

---

## 8. Hero, empty states, loading, errors

- **Empty states are a feature**: every tab without data should have a serif italic line, a small abstract gradient illustration (think Vercel's empty illustrations — geometric, gradient strokes), and one clear CTA. Never a sad "No data yet" line.
- **Loading**: skeletons (cards-shaped), not spinners as the only indicator. Buttons get the dot-wave. Use `aria-live="polite"` on result regions.
- **Errors**: inline cards with a red left bar, a small icon, the error text, and a "Try again" ghost button. Never use raw `alert()`.
- **Toast**: keep current toast API but redesign visuals — translucent surface with backdrop blur, gradient left bar matching kind (success = safe, error = bold, info = purple), drop shadow, tabular monospace timestamp on hover.

---

## 9. Animation & microinteractions

- **Tab switches**: 250ms fade + 8px slide-up. Active tab indicator slides between tabs using `transform: translateX` (FLIP-style).
- **Drawer/sheet open**: backdrop fades + content slides from edge in 320ms. Bottom sheets support drag-to-dismiss with rubberbanding past 0.
- **Save toggle**: heart/bookmark scales 0.7 → 1.1 → 1.0 (`pop-in`) and emits 3 tiny gradient particles for 400ms (subtle, no confetti madness).
- **Copy success**: button icon morphs from copy → checkmark with a 200ms cross-fade and a quick scale pulse.
- **Generate button hover**: gradient slowly shifts angle (background-position animation, 4s).
- **Hero gradient blobs**: ultra-slow drift (30s linear, infinite) using `transform`, NOT background animation.
- Reduce all of the above when `prefers-reduced-motion: reduce`.

---

## 10. Accessibility

- WCAG AA contrast in both themes for text on every surface used. Verify pink-on-white and pink-on-bg explicitly.
- Visible focus rings (already have `:focus-visible` ring; refine to `2px solid pink + 3px offset` and matched `border-radius`).
- All interactive elements ≥ 44×44 tap target on touch.
- Drawers: `role="dialog"`, `aria-modal`, focus trap, restore focus on close, ESC closes.
- Color is **never** the only signal (risk uses dot + word, outcome uses icon + word).
- All icon-only buttons have `aria-label`.
- `prefers-reduced-motion` respected globally.
- RTL: Arabic mode should set `dir="rtl"` on the relevant content. Bubble alignment, paddings, and chat layout must mirror correctly.

---

## 11. Tech constraints

- Next.js 14 App Router, React 18, Tailwind 3, TypeScript 5. No new heavy UI libraries (no MUI, no Chakra). Allowed: `lucide-react`, `clsx`, `tailwind-merge`, `framer-motion` (only if needed — try CSS first), `next/font`.
- Keep all API routes (`/api/suggest`, `/api/roast`, `/api/opener`, `/api/predict`, `/api/wingperson`, `/api/bio`, `/api/summary`, `/api/date-ideas`, `/api/closure`, `/api/models`) and their request/response shapes **untouched** unless absolutely necessary for the redesign. If you must change shapes, keep backwards-compat by accepting the old payload too.
- Keep the storage hooks (`usePersona`, `useSettings`, `useHistory`, `useSaved`, `useStats`) and their localStorage keys (`flirtyai.persona.v1`, etc.) intact so existing user data survives.
- Keep PWA manifest & icon. Improve the icon (serif "F" ligature in a gradient ring) — replace `public/icon.svg` with a more refined version.
- Keep all schema enums (`MOOD_PRESETS`, `LANGUAGES`, `LENGTHS`, `DATE_VIBES`, `CLOSURE_TONES`, etc.).

---

## 12. Existing file map (for orientation)

```
app/
  layout.tsx          # mounts ToasterProvider + theme init
  page.tsx            # tab shell (rebuild — use new app shell pattern)
  globals.css         # design tokens (rebuild with refined palette)
  manifest.ts         # keep, refine icon
  api/                # do not break

components/
  Toaster.tsx         # keep API, redesign visuals
  Drawer.tsx          # rebuild as Drawer + BottomSheet
  Toggle.tsx          # restyle
  Segmented.tsx       # restyle (animated indicator)
  MultiUploader.tsx   # restyle (filmstrip + dashed-gradient empty state)
  MoodControls.tsx    # restyle (chips, divider for spicy moods)
  GenderToggle.tsx    # restyle
  LanguageSelector.tsx# restyle (pill row instead of segmented)
  AnalysisPanel.tsx   # editorialize (eyebrow + clean rows)
  ReplyCard.tsx       # chat-bubble polish + threaded predictions
  RoastResult.tsx     # editorial layout
  RoastTab.tsx        # adapt
  SuggestTab.tsx      # rebuild layout (sticky CTA, sectioned form)
  WingChat.tsx        # real chat UI
  OpenerTab.tsx       # adapt
  BioTab.tsx          # adapt
  DateIdeasTab.tsx    # adapt to grid
  ClosureTab.tsx      # adapt
  ToolsTab.tsx        # adapt
  SettingsDrawer.tsx  # restyle into a sidebar/drawer hybrid
  HistoryDrawer.tsx   # restyle
  SavedDrawer.tsx     # restyle
  StatsDrawer.tsx     # restyle (real bars, big numbers)
  Skeleton.tsx        # extend
  OverflowMenu.tsx    # keep, restyle

lib/
  storage.ts          # do not change keys
  schema.ts           # do not change types
  llm.ts, prompt.ts, models.ts, theme.ts, pwa.ts, utils.ts  # untouched unless needed
```

---

## 13. Acceptance criteria (how I know you nailed it)

- Opens on mobile and immediately feels like a polished app, not a webpage. The first paint is striking.
- Desktop layout uses real estate: sidebar + main + (xl) tip rail. No cramped 600px column on a 27" screen.
- Light theme is **as good** as dark theme. Both have proper depth via shadows, not just borders.
- ⌘K palette works and lists at least 8 actions.
- Sticky mobile generate CTA never overlaps the bottom nav.
- ReplyCards look like real chat bubbles. The gradient bubble is unmistakable.
- All animations respect reduced-motion.
- Existing user data (history, saved, settings) still loads and renders correctly after the redesign.
- Build passes (`next build`) with zero TypeScript errors.
- Lighthouse mobile a11y ≥ 95, performance ≥ 85 on a typical run.
- No emoji-as-icons in chrome (only inside user-visible content like mood labels). All chrome icons are `lucide-react`.
- The app **looks intentional**. If you screenshot any tab, it should look like marketing material.

---

## 14. Out of scope / do not touch

- API contracts and prompt content — leave the LLM prompts alone.
- localStorage schema versions.
- The `/extension` directory.
- Adding new product features beyond what's listed (no new tabs, no AI-generated avatars, no auth, no payments).
- Renaming routes.

---

## 15. Working method

1. Start by rebuilding the **design tokens** (`globals.css` + `tailwind.config.ts`) and the **primitives** (`Button`, `Card`, `Pill`, `Segmented`, `Toggle`, `Slider`, `Tooltip`, `EmptyState`, `Skeleton`, `ProgressDots`, `BottomSheet`).
2. Then rebuild the **app shell** (`page.tsx` + new `Sidebar` + new bottom nav).
3. Then redo screens in priority order: **Suggest → Wing → Tools → Roast → Bio**.
4. Polish drawers and the command palette last.
5. Verify dark/light parity, mobile/desktop parity, RTL, reduced-motion.
6. Run `next build`, fix any types, commit.

Be opinionated. If a section in this brief contradicts itself or you spot something better, **make a call and document it in `DESIGN_NOTES.md`** at the repo root. Do not stop and ask. Move fast, leave the app in a working state at every step (so each commit is shippable).

Make this the FlirtyAI users actually fall in love with. Go.
