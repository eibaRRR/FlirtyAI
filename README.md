# FlirtyAI

Your AI wingperson. Upload a chat screenshot, pick a vibe, get reply options that actually land.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- OpenRouter (any vision-capable model) via OpenAI SDK
- Zod validation

## Setup

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste your OpenRouter key
npm run dev
```

Open http://localhost:3000.

## Environment variables

| var | what |
|---|---|
| `OPENROUTER_API_KEY` | Get one at https://openrouter.ai/keys |
| `MODEL` | OpenRouter model id, default `openai/gpt-4o-mini` |
| `SITE_URL` | Sent as `HTTP-Referer` header (optional) |
| `SITE_NAME` | Sent as `X-Title` header (optional) |

## Swapping models

Just change `MODEL` in `.env.local`. Vision-capable picks that work well:

- `openai/gpt-4o-mini` — fast & cheap, great default
- `openai/gpt-4o` — best quality, pricier
- `anthropic/claude-3.5-sonnet` — excellent at tone matching
- `google/gemini-flash-1.5` — very cheap, fast
- `google/gemini-pro-1.5` — strong vision

You can also point at GitHub Models or any other OpenAI-compatible endpoint by changing the `baseURL` in `lib/llm.ts`.

## How it works

1. User uploads a chat screenshot (auto-resized to ≤1024px to save tokens), pastes optional intent, picks mood + intensity + genders.
2. `POST /api/suggest` validates input with Zod, base64-encodes the image, sends it + a structured system prompt to OpenRouter.
3. The model returns JSON with 3–5 reply options, each tagged with risk: `safe` / `medium` / `bold`, plus a one-line reasoning.
4. UI renders cards with copy buttons.

## Deploy

```bash
vercel
```

Add the env vars in the Vercel dashboard. Done.

## Project structure

```
app/
  page.tsx              # main UI
  layout.tsx
  globals.css
  api/suggest/route.ts  # backend endpoint
components/             # UI pieces
lib/
  llm.ts                # OpenRouter client
  prompt.ts             # system prompt + builder
  schema.ts             # Zod schemas + presets
  utils.ts
```
