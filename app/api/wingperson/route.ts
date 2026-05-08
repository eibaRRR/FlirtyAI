import { NextResponse } from "next/server";
import { WingRequestSchema } from "@/lib/schema";
import { chatWingperson } from "@/lib/llm";
import type { ModelPresetId } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = WingRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { messages, language, persona, spicy } = parsed.data;
    const m = body?.model;
    const modelId: ModelPresetId | undefined =
      m === "kimi" || m === "maverick" ? m : undefined;
    const reply = await chatWingperson(messages, language, persona ?? "", spicy, modelId);
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/wingperson]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
