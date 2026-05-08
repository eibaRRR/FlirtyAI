/**
 * Render a reply suggestion to a 1080x1350 PNG (IG story / TikTok aspect)
 * suitable for sharing. Pure canvas, no extra deps.
 */
import type { Reply } from "./schema";

const W = 1080;
const H = 1350;
const PINK = "#ff4691";
const PURPLE = "#aa5aff";
const BG = "#0c0c12";
const TEXT = "#f5f5fa";
const TEXT2 = "#afafbe";
const MUTED = "#787888";
const BORDER = "#2a2a38";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  /** Per-corner radii: [topLeft, topRight, bottomRight, bottomLeft] */
  perCorner?: [number, number, number, number]
) {
  const [tl, tr, br, bl] = perCorner ?? [r, r, r, r];
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

/** Wrap text into lines that fit `maxWidth`. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderReplyShareImage(
  reply: Reply,
  opts?: { eyebrow?: string }
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // ===== Background =====
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Glow blobs (radial gradients) — pink top-left, purple bottom-right
  const blob1 = ctx.createRadialGradient(120, 100, 0, 120, 100, 720);
  blob1.addColorStop(0, "rgba(255, 70, 145, 0.45)");
  blob1.addColorStop(1, "rgba(255, 70, 145, 0)");
  ctx.fillStyle = blob1;
  ctx.fillRect(0, 0, W, H);

  const blob2 = ctx.createRadialGradient(W - 80, H + 60, 0, W - 80, H + 60, 720);
  blob2.addColorStop(0, "rgba(170, 90, 255, 0.45)");
  blob2.addColorStop(1, "rgba(170, 90, 255, 0)");
  ctx.fillStyle = blob2;
  ctx.fillRect(0, 0, W, H);

  // Subtle vignette
  const vign = ctx.createRadialGradient(W / 2, H / 2, H / 3, W / 2, H / 2, H);
  vign.addColorStop(0, "rgba(0, 0, 0, 0)");
  vign.addColorStop(1, "rgba(0, 0, 0, 0.45)");
  ctx.fillStyle = vign;
  ctx.fillRect(0, 0, W, H);

  // ===== Top brand bar =====
  // Gradient brand mark
  const markX = 80;
  const markY = 80;
  const markSize = 64;
  const markGrad = ctx.createLinearGradient(markX, markY, markX + markSize, markY + markSize);
  markGrad.addColorStop(0, PINK);
  markGrad.addColorStop(1, PURPLE);
  ctx.fillStyle = markGrad;
  roundRect(ctx, markX, markY, markSize, markSize, 16);
  ctx.fill();

  // Sparkle on the mark (simple 4-point star)
  ctx.fillStyle = "#ffffff";
  const cx = markX + markSize / 2;
  const cy = markY + markSize / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 16);
  ctx.lineTo(cx + 5, cy - 5);
  ctx.lineTo(cx + 16, cy);
  ctx.lineTo(cx + 5, cy + 5);
  ctx.lineTo(cx, cy + 16);
  ctx.lineTo(cx - 5, cy + 5);
  ctx.lineTo(cx - 16, cy);
  ctx.lineTo(cx - 5, cy - 5);
  ctx.closePath();
  ctx.fill();

  // Wordmark with gradient
  ctx.font = "700 36px Inter, system-ui, sans-serif";
  const wmGrad = ctx.createLinearGradient(170, 90, 360, 130);
  wmGrad.addColorStop(0, PINK);
  wmGrad.addColorStop(1, PURPLE);
  ctx.fillStyle = wmGrad;
  ctx.textBaseline = "top";
  ctx.fillText("FlirtyAI", 170, 86);
  ctx.font = "500 18px Inter, system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  ctx.fillText("your AI wingperson", 170, 128);

  // ===== Eyebrow =====
  const eyebrow = (opts?.eyebrow ?? "Reply suggestion").toUpperCase();
  ctx.font = "600 18px Inter, system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  ctx.fillText(eyebrow, 80, 240);

  // Risk badge
  const RISK_COLORS = {
    safe: "#34d399",
    medium: "#fab005",
    bold: "#f44f5f",
  } as const;
  const riskColor = RISK_COLORS[reply.risk];
  const riskLabel = reply.risk[0].toUpperCase() + reply.risk.slice(1);
  ctx.font = "600 16px Inter, system-ui, sans-serif";
  const riskTextW = ctx.measureText(riskLabel).width;
  const riskBoxW = riskTextW + 50;
  const riskBoxX = W - 80 - riskBoxW;
  ctx.fillStyle = riskColor + "26"; // ~15% alpha
  roundRect(ctx, riskBoxX, 230, riskBoxW, 32, 16);
  ctx.fill();
  ctx.fillStyle = riskColor;
  ctx.beginPath();
  ctx.arc(riskBoxX + 16, 246, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = riskColor;
  ctx.fillText(riskLabel, riskBoxX + 28, 240);

  // ===== Editorial headline (serif) =====
  ctx.font = "italic 76px 'Instrument Serif', 'Times New Roman', serif";
  ctx.fillStyle = TEXT;
  ctx.fillText("Send the message", 80, 295);
  // Gradient "you'd be proud of."
  const hlGrad = ctx.createLinearGradient(80, 380, 700, 460);
  hlGrad.addColorStop(0, PINK);
  hlGrad.addColorStop(1, PURPLE);
  ctx.fillStyle = hlGrad;
  ctx.fillText("you'd be proud of.", 80, 380);

  // ===== Reply chat bubble =====
  // Compute bubble size based on text
  const bubbleMaxW = W - 160; // 80 padding each side
  const bubblePadX = 36;
  const bubblePadY = 28;

  ctx.font = "500 36px Inter, system-ui, sans-serif";

  // Combine messages
  const messages = reply.messages;
  const lineH = 50;
  const allLines: { text: string; isLastInBubble: boolean }[][] = messages.map((m) => {
    const lines = wrapText(ctx, m, bubbleMaxW - bubblePadX * 2);
    return lines.map((text, i) => ({ text, isLastInBubble: i === lines.length - 1 }));
  });

  // Total height needed
  let yCursor = 510;
  const bubbles: { x: number; y: number; w: number; h: number; lines: string[] }[] = [];
  for (const lines of allLines) {
    const linesText = lines.map((l) => l.text);
    // Max line width
    const maxLineW = Math.max(...linesText.map((t) => ctx.measureText(t).width));
    const bubbleW = Math.min(bubbleMaxW, Math.max(maxLineW + bubblePadX * 2, 280));
    const bubbleH = linesText.length * lineH + bubblePadY * 2 - 8;
    const bubbleX = W - 80 - bubbleW; // right-aligned
    bubbles.push({ x: bubbleX, y: yCursor, w: bubbleW, h: bubbleH, lines: linesText });
    yCursor += bubbleH + 16;
  }

  // Draw each bubble with gradient fill
  for (const b of bubbles) {
    const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
    grad.addColorStop(0, PINK);
    grad.addColorStop(1, PURPLE);
    ctx.fillStyle = grad;
    // iMessage-style — small bottom-right radius (tail), big elsewhere
    roundRect(ctx, b.x, b.y, b.w, b.h, 28, [28, 28, 12, 28]);
    ctx.fill();
    // Soft shadow on bubble
    ctx.shadowColor = "rgba(255, 70, 145, 0.4)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "500 36px Inter, system-ui, sans-serif";
    b.lines.forEach((line, i) => {
      ctx.fillText(line, b.x + bubblePadX, b.y + bubblePadY + i * lineH);
    });
  }

  // ===== Reasoning (italic, muted) =====
  if (reply.reasoning) {
    ctx.font = "italic 22px 'Instrument Serif', serif";
    ctx.fillStyle = TEXT2;
    const reasoningLines = wrapText(ctx, reply.reasoning, W - 160);
    let ry = yCursor + 40;
    for (const line of reasoningLines.slice(0, 4)) {
      ctx.fillText(line, 80, ry);
      ry += 32;
    }
  }

  // ===== Footer brand line =====
  const footerY = H - 100;
  ctx.fillStyle = BORDER;
  ctx.fillRect(80, footerY, W - 160, 1);
  ctx.font = "italic 22px 'Instrument Serif', serif";
  ctx.fillStyle = MUTED;
  ctx.fillText("made with care by", 80, footerY + 24);
  // Gradient "Rabie" + dot
  const fooW = ctx.measureText("made with care by").width;
  const rabieGrad = ctx.createLinearGradient(80 + fooW + 14, footerY + 24, 80 + fooW + 130, footerY + 56);
  rabieGrad.addColorStop(0, PINK);
  rabieGrad.addColorStop(1, PURPLE);
  ctx.fillStyle = rabieGrad;
  ctx.font = "700 24px Inter, system-ui, sans-serif";
  ctx.fillText("Rabie", 80 + fooW + 14, footerY + 26);

  // Right-aligned URL
  ctx.font = "500 20px Inter, system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  const url = "flirtyai.app";
  const urlW = ctx.measureText(url).width;
  ctx.fillText(url, W - 80 - urlW, footerY + 28);

  return await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png", 0.95)
  );
}

/** Try Web Share, fall back to download. Returns "shared" / "downloaded" / "failed". */
export async function shareOrDownload(
  blob: Blob,
  filename = "flirtyai-reply.png"
): Promise<"shared" | "downloaded" | "failed"> {
  // Web Share Level 2: share with files
  type ShareNav = Navigator & {
    canShare?: (data?: { files?: File[] }) => boolean;
    share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
  };
  const nav = navigator as ShareNav;
  try {
    if (nav.canShare && nav.share) {
      const file = new File([blob], filename, { type: "image/png" });
      if (nav.canShare({ files: [file] })) {
        await nav.share({
          files: [file],
          title: "FlirtyAI",
          text: "Look what FlirtyAI cooked up 🔥",
        });
        return "shared";
      }
    }
  } catch (e) {
    // user cancelled or share threw — fall through to download
    if (e instanceof Error && e.name === "AbortError") return "shared";
  }

  // Fallback: download
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return "downloaded";
  } catch {
    return "failed";
  }
}
