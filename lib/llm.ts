import OpenAI from "openai";
import { getPreset, type ModelPresetId, type ModelPreset } from "./models";
import {
  SuggestOutputSchema,
  RoastOutputSchema,
  PredictOutputSchema,
  OpenerOutputSchema,
  BioOutputSchema,
  SummaryOutputSchema,
  DateIdeasOutputSchema,
  ClosureOutputSchema,
  type SuggestOutput,
  type RoastOutput,
  type PredictOutput,
  type PredictRequest,
  type OpenerOutput,
  type OpenerRequest,
  type BioOutput,
  type BioRequest,
  type SuggestRequest,
  type ChatMessage,
  type Language,
  type SummaryOutput,
  type DateIdeasOutput,
  type DateIdeasRequest,
  type ClosureOutput,
  type ClosureRequest,
} from "./schema";
import {
  SUGGEST_SYSTEM_PROMPT,
  ROAST_SYSTEM_PROMPT,
  PREDICT_SYSTEM_PROMPT,
  OPENER_SYSTEM_PROMPT,
  BIO_SYSTEM_PROMPT,
  SUMMARY_SYSTEM_PROMPT,
  DATE_IDEAS_SYSTEM_PROMPT,
  CLOSURE_SYSTEM_PROMPT,
  buildSuggestUserPrompt,
  buildRoastUserPrompt,
  buildPredictUserPrompt,
  buildOpenerUserPrompt,
  buildBioUserPrompt,
  buildSummaryUserPrompt,
  buildDateIdeasUserPrompt,
  buildClosureUserPrompt,
  buildWingSystemPrompt,
  applyMode,
} from "./prompt";

function getClient(preset: ModelPreset) {
  if (!preset.apiKey) throw new Error(`API key for "${preset.name}" is not set`);
  return new OpenAI({
    apiKey: preset.apiKey,
    baseURL: preset.baseURL,
    defaultHeaders: {
      "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
      "X-Title": process.env.SITE_NAME || "FlirtyAI",
    },
  });
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch {}
    }
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first !== -1 && last > first) {
      try {
        return JSON.parse(trimmed.slice(first, last + 1));
      } catch {}
    }
    throw new Error("Model did not return valid JSON");
  }
}

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

function buildUserContent(text: string, images: string[]): ContentPart[] {
  const parts: ContentPart[] = [{ type: "text", text }];
  for (const url of images) parts.push({ type: "image_url", image_url: { url } });
  return parts;
}

function modelExtraParams(model: string): Record<string, unknown> {
  const extras: Record<string, unknown> = {};
  // Mistral models on NIM default reasoning_effort=high which is *very* slow.
  if (/mistral/i.test(model)) {
    extras.reasoning_effort = process.env.LLM_REASONING_EFFORT ?? "none";
  }
  // Qwen 3.x and Kimi K2.x use chat_template_kwargs.enable_thinking / thinking
  // which adds long internal reasoning before the answer — kill it for speed.
  if (/^qwen/i.test(model)) {
    extras.chat_template_kwargs = { enable_thinking: false };
  }
  if (/^moonshotai\/kimi/i.test(model) || /deepseek/i.test(model)) {
    extras.chat_template_kwargs = { thinking: false };
  }
  // Allow explicit override for any model via env (JSON-encoded extra body)
  if (process.env.LLM_EXTRA_PARAMS) {
    try {
      Object.assign(extras, JSON.parse(process.env.LLM_EXTRA_PARAMS));
    } catch {
      // ignore malformed JSON
    }
  }
  return extras;
}

async function callJsonModel(
  preset: ModelPreset,
  systemPrompt: string,
  userText: string,
  images: string[],
  strict: boolean
): Promise<string> {
  const client = getClient(preset);
  const userTextFinal = strict
    ? `${userText}\n\nIMPORTANT: Return ONLY a JSON object matching the schema. No prose, no markdown fences.`
    : userText;

  const maxTokens = Number(process.env.LLM_MAX_TOKENS ?? 1500);
  // Higher temperature = more humanized variance (less "polished AI" mean output).
  // Bumped from 0.9 to 1.05 to push the model off its safest, most-AI-like response.
  const temperature = Number(process.env.LLM_TEMPERATURE ?? 1.05);
  const extras = modelExtraParams(preset.modelId);

  const response = await client.chat.completions.create({
    model: preset.modelId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildUserContent(userTextFinal, images) as unknown as string },
    ],
    temperature,
    max_tokens: maxTokens,
    ...extras,
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from model");
  return content;
}

// ---------- Suggest ----------
export async function generateSuggestions(
  req: SuggestRequest,
  images: string[],
  modelId?: ModelPresetId
): Promise<SuggestOutput> {
  const preset = getPreset(modelId);
  const sys = applyMode(SUGGEST_SYSTEM_PROMPT, req.spicy);
  const userText = buildSuggestUserPrompt(req);
  let raw: string;
  try {
    raw = await callJsonModel(preset, sys, userText, images, false);
    return SuggestOutputSchema.parse(extractJson(raw));
  } catch {
    raw = await callJsonModel(preset, sys, userText, images, true);
    return SuggestOutputSchema.parse(extractJson(raw));
  }
}

// Compare mode: run two parallel calls with different mood arrays.
export async function generateCompare(
  baseReq: SuggestRequest,
  moodGroupA: SuggestRequest["moods"],
  moodGroupB: SuggestRequest["moods"],
  images: string[],
  modelId?: ModelPresetId
): Promise<{ a: SuggestOutput; b: SuggestOutput }> {
  const [a, b] = await Promise.all([
    generateSuggestions({ ...baseReq, moods: moodGroupA }, images, modelId),
    generateSuggestions({ ...baseReq, moods: moodGroupB }, images, modelId),
  ]);
  return { a, b };
}

// ---------- Roast ----------
export async function generateRoast(
  req: SuggestRequest,
  images: string[],
  modelId?: ModelPresetId
): Promise<RoastOutput> {
  const preset = getPreset(modelId);
  const sys = applyMode(ROAST_SYSTEM_PROMPT, req.spicy);
  const userText = buildRoastUserPrompt(req);
  let raw: string;
  try {
    raw = await callJsonModel(preset, sys, userText, images, false);
    return RoastOutputSchema.parse(extractJson(raw));
  } catch {
    raw = await callJsonModel(preset, sys, userText, images, true);
    return RoastOutputSchema.parse(extractJson(raw));
  }
}

// ---------- Predict their reply ----------
export async function generatePrediction(
  req: PredictRequest,
  images: string[],
  spicy = false,
  modelId?: ModelPresetId
): Promise<PredictOutput> {
  const preset = getPreset(modelId);
  const sys = applyMode(PREDICT_SYSTEM_PROMPT, spicy);
  const userText = buildPredictUserPrompt(req);
  let raw: string;
  try {
    raw = await callJsonModel(preset, sys, userText, images, false);
    return PredictOutputSchema.parse(extractJson(raw));
  } catch {
    raw = await callJsonModel(preset, sys, userText, images, true);
    return PredictOutputSchema.parse(extractJson(raw));
  }
}

// ---------- Opener generator (no images) ----------
export async function generateOpeners(
  req: OpenerRequest,
  modelId?: ModelPresetId
): Promise<OpenerOutput> {
  const preset = getPreset(modelId);
  const sys = applyMode(OPENER_SYSTEM_PROMPT, req.spicy);
  const userText = buildOpenerUserPrompt(req);
  let raw: string;
  try {
    raw = await callJsonModel(preset, sys, userText, [], false);
    return OpenerOutputSchema.parse(extractJson(raw));
  } catch {
    raw = await callJsonModel(preset, sys, userText, [], true);
    return OpenerOutputSchema.parse(extractJson(raw));
  }
}

// ---------- Bio rewriter (no images) ----------
export async function generateBio(
  req: BioRequest,
  modelId?: ModelPresetId
): Promise<BioOutput> {
  const preset = getPreset(modelId);
  const userText = buildBioUserPrompt(req);
  let raw: string;
  try {
    raw = await callJsonModel(preset, BIO_SYSTEM_PROMPT, userText, [], false);
    return BioOutputSchema.parse(extractJson(raw));
  } catch {
    raw = await callJsonModel(preset, BIO_SYSTEM_PROMPT, userText, [], true);
    return BioOutputSchema.parse(extractJson(raw));
  }
}

// ---------- Wingperson Chat ----------
export async function chatWingperson(
  history: ChatMessage[],
  language: Language,
  persona: string,
  spicy = false,
  modelId?: ModelPresetId
): Promise<string> {
  const preset = getPreset(modelId);
  const client = getClient(preset);
  const sys = applyMode(buildWingSystemPrompt(language, persona), spicy);
  const response = await client.chat.completions.create({
    model: preset.modelId,
    messages: [
      { role: "system", content: sys },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 1.0,
    max_tokens: 800,
    ...modelExtraParams(preset.modelId),
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from model");
  return content;
}

// ---------- Summary (#4) ----------
export async function generateSummary(
  language: Language,
  persona: string,
  images: string[],
  modelId?: ModelPresetId
): Promise<SummaryOutput> {
  const preset = getPreset(modelId);
  const userText = buildSummaryUserPrompt(language, persona);
  let raw: string;
  try {
    raw = await callJsonModel(preset, SUMMARY_SYSTEM_PROMPT, userText, images, false);
    return SummaryOutputSchema.parse(extractJson(raw));
  } catch {
    raw = await callJsonModel(preset, SUMMARY_SYSTEM_PROMPT, userText, images, true);
    return SummaryOutputSchema.parse(extractJson(raw));
  }
}

// ---------- Date ideas (#13, no images) ----------
export async function generateDateIdeas(
  req: DateIdeasRequest,
  modelId?: ModelPresetId
): Promise<DateIdeasOutput> {
  const preset = getPreset(modelId);
  const sys = applyMode(DATE_IDEAS_SYSTEM_PROMPT, req.spicy);
  const userText = buildDateIdeasUserPrompt(req);
  let raw: string;
  try {
    raw = await callJsonModel(preset, sys, userText, [], false);
    return DateIdeasOutputSchema.parse(extractJson(raw));
  } catch {
    raw = await callJsonModel(preset, sys, userText, [], true);
    return DateIdeasOutputSchema.parse(extractJson(raw));
  }
}

// ---------- Closure (#15, no images) ----------
export async function generateClosure(
  req: ClosureRequest,
  modelId?: ModelPresetId
): Promise<ClosureOutput> {
  const preset = getPreset(modelId);
  const userText = buildClosureUserPrompt(req);
  let raw: string;
  try {
    raw = await callJsonModel(preset, CLOSURE_SYSTEM_PROMPT, userText, [], false);
    return ClosureOutputSchema.parse(extractJson(raw));
  } catch {
    raw = await callJsonModel(preset, CLOSURE_SYSTEM_PROMPT, userText, [], true);
    return ClosureOutputSchema.parse(extractJson(raw));
  }
}
