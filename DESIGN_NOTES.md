# Design execution notes

Companion to `DESIGN_BRIEF.md`. Records calls made during execution, deviations from the brief, and what's intentionally left for a follow-up pass.

## What landed

### Foundation
- `app/globals.css` rewritten with a real token system: 3 surface levels per theme, mode-aware shadows (`--shadow-card`, `--shadow-pop`, `--shadow-cta`), warm accent (`--c-warm`), grain overlay via inline-SVG noise, hero glow blob keyframes, `:focus-visible` pink ring, scrollbar styling, safe-area helpers, `text-display`/`text-eyebrow`/`gradient-text`/`brand-gradient` utilities.
- `tailwind.config.ts` exposes the new tokens as Tailwind colors (`surface`, `surface2`, `surface3`, `text2`, `borderStrong`, `warm`) plus backwards-compat aliases (`panel`, `panel2`) so older components that haven't been refactored yet still render correctly.
- Fonts wired through `next/font`: **Inter** for UI, **Instrument Serif** for editorial headlines via `--font-sans` / `--font-serif`.

### Primitives (`components/ui/`)
- `Button` (variants: `primary`, `solid`, `ghost`, `outline`, `danger`; sizes: `sm`/`md`/`lg`; `loading` swaps content for `ProgressDots`; `bg-[length:200%_200%]` enables hover-shift gradient).
- `IconButton` for icon-only actions with required `aria-label`.
- `Card` + `CardHeader` with optional `gradient`/`accent`/`flat`/`animate`.
- `Pill` selectable chip with optional left/right icons and tonal selected states.
- `Slider` custom-built: animated gradient fill, glowing pink thumb, optional ticks/labels, mono value badge.
- `Tooltip` lightweight with 200ms delay.
- `EmptyState` editorial: serif italic headline + soft `hero-glow` blob + optional action.
- `ProgressDots` 3-dot wave for loading buttons.
- `Section` form-group wrapper with eyebrow + optional title and trailing slot — used heavily across `SuggestTab`.

Index file at `components/ui/index.ts` re-exports them all.

### App shell
- New `Sidebar` (desktop ≥ md): 260px wide collapsible to 68px, with brand mark, ⌘K trigger, primary tab list (active state has a 2px gradient indicator on the left edge), workspace list (Saved/History/Stats with badges), theme cycle button, settings link.
- Sidebar collapse state persists to localStorage.
- Mobile keeps the bottom 5-tab nav with a moving gradient indicator + safe-area padding, plus a sticky blurred top bar with brand mark, ⌘K, overflow menu and settings.
- `CommandPalette` (⌘K / Ctrl-K): backdrop-blur modal with grouped actions (Navigate / Workspace / Theme / Settings), arrow-key + Enter selection, Esc to dismiss, instant filter, hint row.
- `app/page.tsx` rebuilt around a flex shell: `<Sidebar/><main>`.

### Suggest (the hero screen)
- Editorial hero block with serif italic line "Send the message you'd be **proud of.**" and gradient-blob glow when no screenshot is present; collapses to a compact section header when a screenshot is uploaded.
- `MultiUploader` rebuilt: dashed-border drop zone with editorial copy + ⌘V hint when empty; horizontal **filmstrip** with snap-x and a "+ Add" tile when populated.
- Form is now a stack of `Section` cards with eyebrow labels: **The intent**, **The vibe**, **Output**, **Who's who**.
- Mood chips use the new `Pill`; spicy moods sit under a hairline divider with a "+18 only" tag and pink `Pill` tone.
- Toggles became 24-px icon cards (`Layers3`/`GitCompareArrows`/`MessageSquareDashed`/`Flag`).
- Custom `Slider` for intensity with live mono value badge.
- Length picker moved into the section header trailing slot as a Segmented control.
- **Sticky mobile generate CTA** floats above the bottom nav with a blurred container; desktop has the inline button row.
- Loading state: animated 3-dot wave inside the primary button + 3 shimmery `ReplyCardSkeleton` cards in the results area.
- Results section gets eyebrow + serif title pattern.
- `ReplyCard` polished: dot-style risk badge ("• Bold"), iMessage-style gradient bubbles right-aligned with `rounded-br-md`, ghosted icon-button action row, stagger animation per `index`, keeps existing Save / Predict / More-like-this / Worked-or-Flopped behavior intact.
- `AnalysisPanel` redesigned with a soft brand-gradient overlay, eyebrow header, inline pill stats, and a refined flags list.

### Wing chat
- Real chat UI: alternating-side bubbles, AI badge avatar (gradient sparkle) only on the first message of an assistant run.
- Empty state shows `Talk it out.` serif headline + 4 prompt-suggestion chip cards (Open · Ghosted · Ask out · Rewrite); tapping prefills the input.
- Auto-growing textarea (max 6 lines), circular gradient send button.
- Language picker collapsed to a single icon button that toggles a wrap of pill choices in a slide-down strip.
- Loading uses the assistant-side bubble with `ProgressDots` instead of "thinking..." text.

### Roast
- `RoastResult` rebuilt as an editorial spread: massive serif italic score in `text-display`, pill-styled verdict, two columns ("What worked" / "What flopped") with an "_but_" italic chip floating in the divider, alternatives list with hover-revealed copy buttons.

### Shared component polish
- `LanguageSelector` now uses `Pill`.
- `GenderToggle` now uses the FLIP-style `Segmented`.
- `Segmented` rebuilt with a sliding gradient indicator that translates between selected segments using a measured `ResizeObserver`.
- `Toggle` got an icon-card variant (used in Suggest's options) plus a `compact` prop for inline use.

## Deviations from the brief (intentional)

1. **Sidebar replaces drawers on desktop, but drawers stayed available everywhere.** The brief said "Replaces the current right-side drawers on desktop"; in practice I kept the drawers as the rendering surface for Saved/History/Stats so the sidebar buttons just open them. This preserves all existing behavior, including the bottom-sheet treatment on mobile, with no duplicate UIs to maintain. If we want fully inlined sidebar panels later, that's a clean follow-up.
2. **No `xl`-only floating tip rail.** Skipped the third right-rail "What's new / Tips" panel for now to keep the visual hierarchy focused on the main column. Easy to add later as `<aside className="hidden xl:block">` next to the main column.
3. **Bottom-sheet refinement.** The existing `Drawer` was already redesigned in a previous pass with bottom-sheet on mobile, animated entrance, grab handle, dialog ARIA, and esc/overlay close. I left it as-is rather than rebuilding because it already meets the brief.
4. **Date ideas / Closure / Bio / Tools tabs** were not redesigned in this pass — they still use the previous-generation visuals via the new color tokens. They render correctly because Tailwind aliases keep `panel`/`panel2`/`muted` working, but a future pass should bring them into the new `Section` + serif eyebrow language used on Suggest and Roast.
5. **Drag-to-dismiss on the bottom sheet** isn't implemented (only tap-on-backdrop and the close button). Added in a follow-up if we adopt a touch gesture lib or implement pointer math by hand.
6. **Save-toggle particle burst** isn't there yet; the bookmark uses a `pop-in` scale instead. Kept this conservative until we have art direction for the particles.
7. **PWA icon** wasn't redesigned (still the original `icon.svg`); Instrument Serif "F" mark is a candidate next.
8. **Light theme** was not pixel-audited; primitives were authored with both modes in mind, but the brief's "pixel-audit pass" is best done with a real screen + comparison.

## Files changed in this pass

```
app/globals.css                          (rewritten)
app/layout.tsx                           (next/font, fonts)
app/page.tsx                             (new shell)
tailwind.config.ts                       (tokens, animations)

components/Sidebar.tsx                   (new)
components/CommandPalette.tsx            (new)
components/SuggestTab.tsx                (rebuilt)
components/WingChat.tsx                  (rebuilt)
components/RoastResult.tsx               (rebuilt)
components/AnalysisPanel.tsx             (refreshed)
components/MoodControls.tsx              (chip + slider via primitives)
components/MultiUploader.tsx             (filmstrip + editorial empty)
components/Segmented.tsx                 (FLIP indicator)
components/Toggle.tsx                    (icon card + compact)
components/GenderToggle.tsx              (uses Segmented)
components/LanguageSelector.tsx          (uses Pill)
components/ReplyCard.tsx                 (dot risk badge, ghost actions)

components/ui/Button.tsx                 (new)
components/ui/IconButton.tsx             (new)
components/ui/Card.tsx                   (new)
components/ui/Pill.tsx                   (new)
components/ui/Slider.tsx                 (new)
components/ui/Tooltip.tsx                (new)
components/ui/EmptyState.tsx             (new)
components/ui/Section.tsx                (new)
components/ui/ProgressDots.tsx           (new)
components/ui/index.ts                   (new)
```

## Acceptance check

- [x] `npx next build` passes (no TypeScript errors).
- [x] All API routes untouched (`/api/suggest`, `/api/roast`, `/api/opener`, `/api/predict`, `/api/wingperson`, `/api/bio`, `/api/summary`, `/api/date-ideas`, `/api/closure`, `/api/models`).
- [x] localStorage keys preserved (`flirtyai.persona.v1`, `flirtyai.history.v1`, `flirtyai.settings.v1`, `flirtyai.saved.v1`, `flirtyai.stats.v1`, `flirtyai.theme.v1`).
- [x] Schema enums (`MOOD_PRESETS`, `LANGUAGES`, `LENGTHS`, `DATE_VIBES`, `CLOSURE_TONES`) unchanged.
- [x] PWA manifest + icon retained.
- [x] `prefers-reduced-motion` respected globally.
- [x] ⌘K command palette implemented with at least 13 actions.
- [x] Mobile sticky CTA does not overlap the bottom nav (positioned at `bottom-[64px]`).
- [x] Reply cards render as iMessage-style chat bubbles.
- [x] Sidebar collapsible state persists.
