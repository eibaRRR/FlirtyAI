import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Quick diagnostic endpoint. Hit GET /api/health to verify:
 *  - The deployment is alive
 *  - Which LLM env vars are configured (without leaking the keys)
 *  - Which models will work
 *
 * Use this as a first stop when debugging "Failed to fetch" type errors:
 * if /api/health responds, your deployment is reachable and the failure
 * is happening inside one of the AI routes (probably an upstream NIM
 * timeout or a model-specific issue). If /api/health itself fails,
 * the deployment isn't reachable at all (DNS, build, env vars, etc.).
 */
export async function GET() {
  const hasMaverick = Boolean(process.env.MAVERICK_API_KEY || process.env.LLM_API_KEY);
  const hasKimi = Boolean(process.env.KIMI_API_KEY || process.env.LLM_API_KEY);

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    runtime: "nodejs",
    env: {
      maverickKey: hasMaverick ? "configured" : "MISSING",
      kimiKey: hasKimi ? "configured" : "MISSING",
      maverickBaseUrl: process.env.MAVERICK_BASE_URL ?? "default (NVIDIA NIM)",
      kimiBaseUrl: process.env.KIMI_BASE_URL ?? "default (NVIDIA NIM)",
      llmTemperature: process.env.LLM_TEMPERATURE ?? "1.05 (default)",
      llmMaxTokens: process.env.LLM_MAX_TOKENS ?? "1500 (default)",
      llmTimeoutMs: process.env.LLM_TIMEOUT_MS ?? "75000 (default)",
      siteUrl: process.env.SITE_URL ?? "(unset)",
    },
    models: {
      maverick: {
        available: hasMaverick,
        modelId: "meta/llama-4-maverick-17b-128e-instruct",
        vision: true,
      },
      kimi: {
        available: hasKimi,
        modelId: "moonshotai/kimi-k2.6",
        vision: true,
      },
    },
    // Fastest diagnostic if AI routes fail: try this URL with curl.
    // If this returns ok:true but /api/suggest fails, problem is upstream
    // (NIM, model, image content). If this fails too, problem is the
    // deployment / network / env.
  });
}
