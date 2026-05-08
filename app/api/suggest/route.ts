import { NextResponse } from "next/server";
import { MOOD_PRESETS, SuggestRequestSchema, type MoodPreset } from "@/lib/schema";
import { generateSuggestions, generateCompare, generateRoast } from "@/lib/llm";
import type { ModelPresetId } from "@/lib/models";

function pickModel(form: FormData): ModelPresetId | undefined {
  const v = form.get("model");
  if (v === "kimi" || v === "maverick") return v;
  return undefined;
}

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 3;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

async function fileToDataUrl(f: File): Promise<string> {
  const buf = Buffer.from(await f.arrayBuffer());
  return `data:${f.type};base64,${buf.toString("base64")}`;
}

function parseMoods(form: FormData): MoodPreset[] {
  // Accept either repeated "moods" entries or a single comma-separated string
  const all = form.getAll("moods").map(String).filter(Boolean);
  let list: string[] = all;
  if (list.length === 1 && list[0].includes(",")) list = list[0].split(",").map((s) => s.trim());
  return list.filter((m): m is MoodPreset => (MOOD_PRESETS as readonly string[]).includes(m));
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Collect images (1..MAX_IMAGES). Accept "image" (single) or "image0/1/2".
    const images: File[] = [];
    const single = form.get("image");
    if (single instanceof File) images.push(single);
    for (let i = 0; i < MAX_IMAGES; i++) {
      const f = form.get(`image${i}`);
      if (f instanceof File) images.push(f);
    }
    for (const f of form.getAll("images")) {
      if (f instanceof File) images.push(f);
    }
    // Dedupe by reference
    const uniqueImages = Array.from(new Set(images));

    if (uniqueImages.length === 0) {
      return NextResponse.json({ error: "Upload at least one screenshot" }, { status: 400 });
    }
    if (uniqueImages.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Max ${MAX_IMAGES} screenshots` }, { status: 400 });
    }
    for (const img of uniqueImages) {
      if (!ALLOWED_TYPES.has(img.type)) {
        return NextResponse.json(
          { error: "Unsupported image type. PNG, JPEG, or WEBP only." },
          { status: 400 }
        );
      }
      if (img.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Each image must be ≤ 5 MB" }, { status: 413 });
      }
    }

    const moods = parseMoods(form);
    const compareModeRaw = form.get("compareMode");
    const compareMode =
      compareModeRaw === "true" || compareModeRaw === "1" || compareModeRaw === "on";

    const parsed = SuggestRequestSchema.safeParse({
      mode: form.get("mode") ?? "suggest",
      context: form.get("context") ?? "",
      moods,
      customMood: form.get("customMood") ?? "",
      intensity: form.get("intensity"),
      userGender: form.get("userGender"),
      targetGender: form.get("targetGender"),
      language: form.get("language") ?? "auto",
      length: form.get("length") ?? "medium",
      multiMessage: form.get("multiMessage") ?? false,
      persona: form.get("persona") ?? "",
      refineFrom: form.get("refineFrom") ?? "",
      detectFlags: form.get("detectFlags") ?? false,
      spicy: form.get("spicy") ?? false,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dataUrls = await Promise.all(uniqueImages.map(fileToDataUrl));
    const modelId = pickModel(form);

    // ---- Roast mode ----
    if (parsed.data.mode === "roast") {
      const result = await generateRoast(parsed.data, dataUrls, modelId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 422 });
      }
      return NextResponse.json({ roast: result });
    }

    // ---- Compare mode (toggle): split moods into two groups ----
    if (compareMode && parsed.data.moods.length >= 2) {
      const half = Math.ceil(parsed.data.moods.length / 2);
      const groupA = parsed.data.moods.slice(0, half);
      const groupB = parsed.data.moods.slice(half);
      const { a, b } = await generateCompare(parsed.data, groupA, groupB, dataUrls, modelId);
      return NextResponse.json({
        compare: {
          a: { moods: groupA, ...a },
          b: { moods: groupB, ...b },
        },
      });
    }

    // ---- Default: single suggest ----
    const result = await generateSuggestions(parsed.data, dataUrls, modelId);
    if (result.error || result.replies.length === 0) {
      return NextResponse.json(
        { error: result.error || "Couldn't read this conversation. Try a clearer screenshot." },
        { status: 422 }
      );
    }
    return NextResponse.json({
      analysis: result.analysis,
      replies: result.replies,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/suggest]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
