/**
 * Translate a thrown fetch / network error into a useful, actionable
 * message for the user. The default `e.message` for a network failure
 * in the browser is just "Failed to fetch", which tells nobody anything.
 */
export function explainFetchError(e: unknown): string {
  if (e instanceof Error) {
    const m = e.message;
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) {
      return "Couldn't reach the server. Try again — if it keeps failing, the AI provider is likely slow or your screenshot is too large. Try a smaller / fewer screenshots.";
    }
    if (/aborted|AbortError/i.test(m)) {
      return "Request timed out. Try again with a smaller screenshot, or switch model in Settings.";
    }
    if (m) return m;
  }
  return "Something went wrong. Try again.";
}

/**
 * Try to read a useful error message out of a non-OK fetch response.
 * Falls back to the status code if the body isn't parseable.
 */
export async function explainResponseError(res: Response): Promise<string> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* ignore */
  }
  if (body && typeof body === "object" && "error" in body) {
    const err = (body as { error?: unknown }).error;
    if (typeof err === "string" && err.length > 0) return err;
  }
  if (res.status === 413) {
    return "Your screenshot(s) are too large. Try one image at a time, or compress them first.";
  }
  if (res.status === 429) {
    return "Too many requests. Wait a moment and try again.";
  }
  if (res.status === 504 || res.status === 408) {
    return "The AI took too long to respond. Try a smaller screenshot, or switch model in Settings.";
  }
  if (res.status >= 500) {
    return `Server error (${res.status}). The AI provider might be down — try again in a minute.`;
  }
  if (res.status >= 400) {
    return `Request failed (${res.status}). Check your settings or try again.`;
  }
  return `Unexpected response (${res.status}).`;
}
