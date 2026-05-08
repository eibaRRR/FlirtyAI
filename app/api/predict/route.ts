import { NextResponse } from "next/server";
import { PredictRequestSchema } from "@/lib/schema";
import { generatePrediction } from "@/lib/llm";
import type { ModelPresetId } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 3;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

async function fileToDataUrl(f: File): Promise<string> {
  const buf = Buffer.from(await f.arrayBuffer());
  return `data:${f.type};base64,${buf.toString("base64")}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const images: File[] = [];
    for (let i = 0; i < MAX_IMAGES; i++) {
      const f = form.get(`image${i}`);
      if (f instanceof File) images.push(f);
    }
    if (images.length === 0) {
      return NextResponse.json({ error: "Upload at least one screenshot" }, { status: 400 });
    }
    for (const img of images) {
      if (!ALLOWED_TYPES.has(img.type)) {
        return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
      }
      if (img.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Each image must be ≤ 5 MB" }, { status: 413 });
      }
    }

    const parsed = PredictRequestSchema.safeParse({
      replyText: form.get("replyText") ?? "",
      language: form.get("language") ?? "auto",
      persona: form.get("persona") ?? "",
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const spicy = form.get("spicy") === "true";
    const m = form.get("model");
    const modelId: ModelPresetId | undefined =
      m === "kimi" || m === "maverick" ? m : undefined;

    const dataUrls = await Promise.all(images.map(fileToDataUrl));
    const result = await generatePrediction(parsed.data, dataUrls, spicy, modelId);
    if (result.error || result.predictions.length === 0) {
      return NextResponse.json(
        { error: result.error || "Couldn't generate predictions" },
        { status: 422 }
      );
    }
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/predict]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
