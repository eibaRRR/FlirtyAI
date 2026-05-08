// Server-side model registry. The frontend asks for a preset by id, the
// backend looks up the matching key/baseURL/modelId/params here.
//
// Each preset reads its API key from an env var so we can keep both Maverick
// and Kimi keys live at the same time without changing code.

export type ModelPresetId = "maverick" | "kimi";

export type ModelPreset = {
  id: ModelPresetId;
  name: string;
  modelId: string;
  baseURL: string;
  apiKey: string;
  vision: boolean;
  description: string;
  speedTier: "fast" | "balanced" | "slow";
  spicyTier: "moderate" | "permissive";
};

const NIM = "https://integrate.api.nvidia.com/v1";

// Fallback to the generic LLM_API_KEY so existing setups keep working.
const FALLBACK_KEY = process.env.LLM_API_KEY ?? "";

export function getPreset(id: ModelPresetId | undefined): ModelPreset {
  const presetId = id && PRESETS[id] ? id : "maverick";
  return PRESETS[presetId];
}

const PRESETS: Record<ModelPresetId, ModelPreset> = {
  maverick: {
    id: "maverick",
    name: "Llama 4 Maverick",
    modelId: "meta/llama-4-maverick-17b-128e-instruct",
    baseURL: process.env.MAVERICK_BASE_URL ?? NIM,
    apiKey: process.env.MAVERICK_API_KEY || FALLBACK_KEY,
    vision: true,
    description: "Fast (1-3s) · balanced quality · moderate alignment",
    speedTier: "fast",
    spicyTier: "moderate",
  },
  kimi: {
    id: "kimi",
    name: "Kimi K2.6",
    modelId: "moonshotai/kimi-k2.6",
    baseURL: process.env.KIMI_BASE_URL ?? NIM,
    apiKey: process.env.KIMI_API_KEY || FALLBACK_KEY,
    vision: true,
    description: "Slower (3-8s) · richer creative · best for spicy / Darija",
    speedTier: "slow",
    spicyTier: "permissive",
  },
};

// Public metadata that's safe to send to the browser (no API keys!)
export type PublicPreset = Pick<
  ModelPreset,
  "id" | "name" | "modelId" | "vision" | "description" | "speedTier" | "spicyTier"
>;

export function publicPresets(): PublicPreset[] {
  return (Object.keys(PRESETS) as ModelPresetId[]).map((id) => {
    const p = PRESETS[id];
    return {
      id: p.id,
      name: p.name,
      modelId: p.modelId,
      vision: p.vision,
      description: p.description,
      speedTier: p.speedTier,
      spicyTier: p.spicyTier,
    };
  });
}
