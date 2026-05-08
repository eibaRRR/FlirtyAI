import { NextResponse } from "next/server";
import { OpenerRequestSchema } from "@/lib/schema";
import { generateOpeners } from "@/lib/llm";
import type { ModelPresetId } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = OpenerRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const m = body?.model;
    const modelId: ModelPresetId | undefined =
      m === "kimi" || m === "maverick" ? m : undefined;
    const result = await generateOpeners(parsed.data, modelId);
    if (result.error || result.openers.length === 0) {
      return NextResponse.json({ error: result.error || "No openers generated" }, { status: 422 });
    }
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/opener]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
