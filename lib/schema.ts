import { z } from "zod";

export const MOOD_PRESETS = [
  "Flirty",
  "Unhinged",
  "Nonchalant",
  "Funny",
  "Smooth",
  "Playful",
  "Bold",
  // Spicy / +18-only moods (gated in UI by spicy toggle)
  "Dominant",
  "Submissive",
  "Teasing",
  "Possessive",
  "Filthy",
] as const;
export type MoodPreset = (typeof MOOD_PRESETS)[number];

// Moods only shown / valid when adult (+18) mode is enabled.
export const SPICY_ONLY_MOODS: readonly MoodPreset[] = [
  "Dominant",
  "Submissive",
  "Teasing",
  "Possessive",
  "Filthy",
];

export function isSpicyMood(m: MoodPreset): boolean {
  return (SPICY_ONLY_MOODS as readonly string[]).includes(m);
}

export const GENDERS = ["male", "female", "other"] as const;
export type Gender = (typeof GENDERS)[number];

export const LANGUAGES = [
  "auto",
  "darija_latin",
  "darija_arabic",
  "english",
  "french",
  "arabic",
] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  auto: "Auto (match the convo)",
  darija_latin: "Darija (3/7/9)",
  darija_arabic: "Darija (الدارجة)",
  english: "English",
  french: "Français",
  arabic: "العربية",
};

export const LENGTHS = ["short", "medium", "long"] as const;
export type Length = (typeof LENGTHS)[number];
export const LENGTH_LABELS: Record<Length, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
};

export const STAGES = [
  "opener",
  "rapport",
  "plateau",
  "ask_out",
  "recovery",
  "post_ghost",
  "other",
] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABELS: Record<Stage, string> = {
  opener: "First message",
  rapport: "Building rapport",
  plateau: "Plateau",
  ask_out: "Asking out",
  recovery: "Recovery",
  post_ghost: "After being left on read",
  other: "Other",
};

export const MODES = ["suggest", "roast"] as const;
export type Mode = (typeof MODES)[number];

export const RiskSchema = z.enum(["safe", "medium", "bold"]);
export type Risk = z.infer<typeof RiskSchema>;

// --- Request schema ---
export const SuggestRequestSchema = z.object({
  mode: z.enum(MODES).default("suggest"),
  context: z.string().max(500).optional().default(""),
  moods: z.array(z.enum(MOOD_PRESETS)).min(1).max(3),
  customMood: z.string().max(200).optional().default(""),
  intensity: z.coerce.number().int().min(1).max(10),
  userGender: z.enum(GENDERS),
  targetGender: z.enum(GENDERS),
  language: z.enum(LANGUAGES).default("auto"),
  length: z.enum(LENGTHS).default("medium"),
  multiMessage: z.coerce.boolean().default(false),
  persona: z.string().max(500).optional().default(""),
  refineFrom: z.string().max(800).optional().default(""),
  detectFlags: z.coerce.boolean().default(false),
  spicy: z.coerce.boolean().default(false),
});
export type SuggestRequest = z.infer<typeof SuggestRequestSchema>;

// --- Predict their reply ---
export const PredictRequestSchema = z.object({
  replyText: z.string().min(1).max(800),
  language: z.enum(LANGUAGES).default("auto"),
  persona: z.string().max(500).optional().default(""),
});
export type PredictRequest = z.infer<typeof PredictRequestSchema>;

export const PredictedResponseSchema = z.object({
  text: z.string().min(1),
  vibe: z.string().min(1),
  likelihood: z.enum(["high", "medium", "low"]),
});
export type PredictedResponse = z.infer<typeof PredictedResponseSchema>;

export const PredictOutputSchema = z.object({
  predictions: z.array(PredictedResponseSchema).min(0).max(5),
  overall: z.string().default(""),
  error: z.string().optional(),
});
export type PredictOutput = z.infer<typeof PredictOutputSchema>;

// --- LLM output ---
export const ReplySchema = z.object({
  messages: z.array(z.string().min(1)).min(1).max(4),
  reasoning: z.string().min(1),
  risk: RiskSchema,
});
export type Reply = z.infer<typeof ReplySchema>;

export const FLAG_TYPES = ["green", "red"] as const;
export type FlagType = (typeof FLAG_TYPES)[number];
export const FlagSchema = z.object({
  type: z.enum(FLAG_TYPES),
  label: z.string().min(1),
  detail: z.string().min(1),
});
export type Flag = z.infer<typeof FlagSchema>;

export const AnalysisSchema = z.object({
  stage: z.enum(STAGES).default("other"),
  vibe: z.string().default(""),
  recommendedRisk: RiskSchema.default("medium"),
  languageDetected: z.string().default(""),
  flags: z.array(FlagSchema).default([]),
});
export type Analysis = z.infer<typeof AnalysisSchema>;

export const SuggestOutputSchema = z.object({
  analysis: AnalysisSchema.optional(),
  replies: z.array(ReplySchema).max(8).default([]),
  error: z.string().optional(),
});
export type SuggestOutput = z.infer<typeof SuggestOutputSchema>;

// --- Roast output ---
export const RoastOutputSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.string().min(1),
  whatWorked: z.array(z.string()).default([]),
  whatFlopped: z.array(z.string()).default([]),
  betterAlternatives: z.array(z.string()).min(1).max(5),
  error: z.string().optional(),
});
export type RoastOutput = z.infer<typeof RoastOutputSchema>;

// --- Wingperson chat ---
export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const WingRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(40),
  language: z.enum(LANGUAGES).default("auto"),
  persona: z.string().max(500).optional().default(""),
  spicy: z.coerce.boolean().default(false),
});
export type WingRequest = z.infer<typeof WingRequestSchema>;

// --- Opener generator (no screenshot) ---
export const OpenerRequestSchema = z.object({
  bio: z.string().max(800).optional().default(""),
  photosNote: z.string().max(400).optional().default(""),
  context: z.string().max(400).optional().default(""),
  moods: z.array(z.enum(MOOD_PRESETS)).min(1).max(3),
  customMood: z.string().max(200).optional().default(""),
  intensity: z.coerce.number().int().min(1).max(10),
  userGender: z.enum(GENDERS),
  targetGender: z.enum(GENDERS),
  language: z.enum(LANGUAGES).default("auto"),
  length: z.enum(LENGTHS).default("short"),
  persona: z.string().max(500).optional().default(""),
  platform: z.string().max(40).optional().default(""), // "Tinder", "Instagram", etc.
  spicy: z.coerce.boolean().default(false),
});
export type OpenerRequest = z.infer<typeof OpenerRequestSchema>;

export const OpenerSchema = z.object({
  text: z.string().min(1),
  reasoning: z.string().min(1),
  risk: RiskSchema,
});
export type Opener = z.infer<typeof OpenerSchema>;

export const OpenerOutputSchema = z.object({
  openers: z.array(OpenerSchema).min(1).max(8),
  error: z.string().optional(),
});
export type OpenerOutput = z.infer<typeof OpenerOutputSchema>;

// --- Bio rewriter ---
export const BIO_VIBES = [
  "Mysterious",
  "Funny",
  "Sincere",
  "Bold",
  "Smooth",
  "Playful",
  "Minimal",
  "Adventurous",
] as const;
export type BioVibe = (typeof BIO_VIBES)[number];

export const BioRequestSchema = z.object({
  bio: z.string().min(1).max(1000),
  vibes: z.array(z.enum(BIO_VIBES)).min(1).max(4),
  language: z.enum(LANGUAGES).default("auto"),
  userGender: z.enum(GENDERS),
  maxChars: z.coerce.number().int().min(60).max(800).default(300),
});
export type BioRequest = z.infer<typeof BioRequestSchema>;

export const BioVariantSchema = z.object({
  vibe: z.enum(BIO_VIBES),
  bio: z.string().min(1),
  note: z.string().min(1),
});
export type BioVariant = z.infer<typeof BioVariantSchema>;

export const BioOutputSchema = z.object({
  variants: z.array(BioVariantSchema).min(1).max(8),
  error: z.string().optional(),
});
export type BioOutput = z.infer<typeof BioOutputSchema>;

// =====================
// CONVERSATION SUMMARY (#4)
// =====================
export const SummaryRequestSchema = z.object({
  language: z.enum(LANGUAGES).default("auto"),
  persona: z.string().max(500).optional().default(""),
});
export type SummaryRequest = z.infer<typeof SummaryRequestSchema>;

export const SummaryOutputSchema = z.object({
  tldr: z.string().min(1),
  stage: z.enum(STAGES).default("other"),
  vibe: z.string().default(""),
  keyMoments: z.array(z.string()).default([]),
  whatTheyWant: z.string().default(""),
  whatYouWant: z.string().default(""),
  nextMove: z.string().default(""),
  riskLevel: RiskSchema.default("medium"),
  error: z.string().optional(),
});
export type SummaryOutput = z.infer<typeof SummaryOutputSchema>;

// =====================
// DATE IDEAS (#13)
// =====================
export const DATE_BUDGETS = ["free", "cheap", "moderate", "fancy"] as const;
export type DateBudget = (typeof DATE_BUDGETS)[number];
export const DATE_BUDGET_LABELS: Record<DateBudget, string> = {
  free: "Free",
  cheap: "Cheap",
  moderate: "Moderate",
  fancy: "Fancy",
};

export const DATE_VIBES = [
  "Chill",
  "Adventurous",
  "Romantic",
  "Active",
  "Foodie",
  "Cultural",
  "Playful",
  "Spicy",
] as const;
export type DateVibe = (typeof DATE_VIBES)[number];

export const DateIdeasRequestSchema = z.object({
  city: z.string().max(80).optional().default(""),
  vibes: z.array(z.enum(DATE_VIBES)).min(1).max(4),
  budget: z.enum(DATE_BUDGETS).default("moderate"),
  meetingNumber: z.coerce.number().int().min(1).max(20).default(1),
  interests: z.string().max(400).optional().default(""),
  language: z.enum(LANGUAGES).default("auto"),
  spicy: z.coerce.boolean().default(false),
});
export type DateIdeasRequest = z.infer<typeof DateIdeasRequestSchema>;

export const DateIdeaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  why: z.string().min(1),
  duration: z.string().default(""),
  budget: z.enum(DATE_BUDGETS).default("moderate"),
  vibe: z.enum(DATE_VIBES),
  pitch: z.string().min(1),  // suggested message to propose this date
});
export type DateIdea = z.infer<typeof DateIdeaSchema>;

export const DateIdeasOutputSchema = z.object({
  ideas: z.array(DateIdeaSchema).min(1).max(8),
  error: z.string().optional(),
});
export type DateIdeasOutput = z.infer<typeof DateIdeasOutputSchema>;

// =====================
// CLOSURE MESSAGE (#15)
// =====================
export const CLOSURE_TONES = [
  "Mature",
  "Warm",
  "Cold",
  "Honest",
  "Brief",
  "Apologetic",
] as const;
export type ClosureTone = (typeof CLOSURE_TONES)[number];

export const CLOSURE_REASONS = [
  "no_chemistry",
  "different_goals",
  "ghosted_them",
  "got_ghosted",
  "moving_on",
  "boundary_violation",
  "other",
] as const;
export type ClosureReason = (typeof CLOSURE_REASONS)[number];
export const CLOSURE_REASON_LABELS: Record<ClosureReason, string> = {
  no_chemistry: "No chemistry",
  different_goals: "Different goals",
  ghosted_them: "I ghosted them",
  got_ghosted: "They ghosted me",
  moving_on: "I'm moving on",
  boundary_violation: "Boundary issue",
  other: "Other",
};

export const ClosureRequestSchema = z.object({
  reason: z.enum(CLOSURE_REASONS).default("other"),
  context: z.string().max(800).optional().default(""),
  tones: z.array(z.enum(CLOSURE_TONES)).min(1).max(3),
  language: z.enum(LANGUAGES).default("auto"),
  length: z.enum(LENGTHS).default("medium"),
  persona: z.string().max(500).optional().default(""),
  userGender: z.enum(GENDERS),
  targetGender: z.enum(GENDERS),
});
export type ClosureRequest = z.infer<typeof ClosureRequestSchema>;

export const ClosureMessageSchema = z.object({
  tone: z.enum(CLOSURE_TONES),
  text: z.string().min(1),
  reasoning: z.string().min(1),
});
export type ClosureMessage = z.infer<typeof ClosureMessageSchema>;

export const ClosureOutputSchema = z.object({
  messages: z.array(ClosureMessageSchema).min(1).max(6),
  error: z.string().optional(),
});
export type ClosureOutput = z.infer<typeof ClosureOutputSchema>;
