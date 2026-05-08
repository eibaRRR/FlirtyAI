import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Permissive CORS for /api/* so the browser extension and any deployed clients
// can call the FlirtyAI backend. Safe because every request is rate-limited at
// the LLM provider, the route handlers validate input, and the API is designed
// to be invoked from arbitrary origins.
export function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  const res = NextResponse.next();
  for (const [k, v] of Object.entries(corsHeaders())) {
    res.headers.set(k, v);
  }
  return res;
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export const config = {
  matcher: ["/api/:path*"],
};
