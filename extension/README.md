# FlirtyAI Browser Extension

A small Chrome/Edge MV3 extension that captures the visible browser tab (DM, WhatsApp Web, Tinder Web, IG, etc.), sends it to your FlirtyAI backend, and shows reply suggestions inline — no need to switch to the web app.

## How it works

1. Click the FlirtyAI icon in the toolbar.
2. Click **Capture this tab** — the extension takes a screenshot of the visible page area.
3. Set the mood, intensity, length, and language.
4. Click **Generate replies** → the extension POSTs the screenshot to `/api/suggest` on your backend and renders the results.

## Install (developer mode)

1. Make sure your FlirtyAI backend is running:
   ```bash
   cd ..
   npm run dev          # http://localhost:3000
   ```
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** → select the `extension/` folder.
5. The FlirtyAI icon appears in your toolbar.

## Configure

Right-click the extension icon → **Options** (or click the ⚙ inside the popup). You can set:

- **Backend URL** — defaults to `http://localhost:3000`. When you deploy FlirtyAI to Vercel, paste the public URL here so the extension uses your hosted backend instead of localhost.
- **Persona** — your texting voice. Reused by the extension on every request.

Settings are stored via `chrome.storage.sync`, so they roam across your signed-in browsers.

## Permissions explained

- `activeTab` — only access the page when you click the extension button.
- `storage` — save your backend URL and persona.
- `<all_urls>` — needed because `captureVisibleTab` works on any page; we never inject scripts.
- `scripting` — reserved for future "capture only the chat element" inline capture (not yet used).

## Notes

- The extension **does not store screenshots** — they live only in memory until you generate replies.
- The popup auto-resizes captures to ≤1024px before upload to keep the LLM token cost down.
- If you see a CORS error, restart `npm run dev` after pulling the latest code (the project ships a `middleware.ts` that whitelists `*` on `/api/*`).
- Icons are intentionally omitted to keep the project lean. Drop your own PNG icons (`icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`) into an `icons/` folder and uncomment the `icons` block in `manifest.json` if you want a custom toolbar icon.

## Limits

- Only **single-screenshot** suggest mode is supported in the popup. For multi-image, compare-mode, roast, opener, bio and wingperson chat, use the full web app — those flows need more screen real estate than a popup.
