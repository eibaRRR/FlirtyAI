import { NextResponse } from "next/server";
import { ClosureRequestSchema } from "@/lib/schema";
import { generateClosure } from "@/lib/llm";
import type { ModelPresetId } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ClosureRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const m = body?.model;
    const modelId: ModelPresetId | undefined =
      m === "kimi" || m === "maverick" ? m : undefined;
    const result = await generateClosure(parsed.data, modelId);
    if (result.error || result.messages.length === 0) {
      return NextResponse.json(
        { error: result.error || "No closure messages generated" },
        { status: 422 }
      );
    }
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/closure]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
