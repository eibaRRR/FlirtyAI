import { NextResponse } from "next/server";
import { publicPresets } from "@/lib/models";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ models: publicPresets() });
}
