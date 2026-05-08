/**
 * Canned demo scenarios used to show off FlirtyAI without spending API calls.
 * The Suggest tab uses these on its empty hero so first-time visitors can see
 * the output shape immediately.
 */
import type { Analysis, Language, MoodPreset, Reply } from "./schema";

export type DemoScenario = {
  id: string;
  title: string;
  blurb: string;
  /** Pre-filled form context */
  context: string;
  moods: MoodPreset[];
  intensity: number;
  language: Language;
  /** Canned LLM-style output */
  analysis: Analysis;
  replies: Reply[];
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "left-on-read",
    title: "Left on read for 2 days",
    blurb: "She was into the convo, then radio silence. How do you re-open without sounding desperate?",
    context: "She was super engaged then went quiet for 2 days. Want to re-open without sounding needy.",
    moods: ["Nonchalant", "Playful"],
    intensity: 4,
    language: "english",
    analysis: {
      stage: "post_ghost",
      vibe: "Cooled off mid-banter — likely got busy, not ghosted hard.",
      recommendedRisk: "medium",
      languageDetected: "English",
      flags: [],
    },
    replies: [
      {
        risk: "safe",
        messages: ["did you fall off the planet or just into a netflix hole"],
        reasoning: "Light, accusation-free re-open that gives her an easy out without making it weird.",
      },
      {
        risk: "medium",
        messages: ["okay i'll bite — what was more interesting than me this week"],
        reasoning: "Self-aware tease that flips the script. Confident without being needy.",
      },
      {
        risk: "bold",
        messages: [
          "alright, two-day disappearance.",
          "either you're plotting something or you owe me a coffee. which is it",
        ],
        reasoning: "Multi-message double-text that names the silence and proposes a date in one move.",
      },
    ],
  },
  {
    id: "first-message",
    title: "Fresh match, first message",
    blurb: "Just matched. Their bio mentions hiking and a dog named Mochi. Open with something that lands.",
    context: "Just matched. Their bio: med student, loves hiking, dog named Mochi. Want to open without being generic.",
    moods: ["Funny", "Smooth"],
    intensity: 5,
    language: "english",
    analysis: {
      stage: "opener",
      vibe: "Blank slate — bio gives strong hooks (Mochi, hiking) so use them.",
      recommendedRisk: "medium",
      languageDetected: "English",
      flags: [],
    },
    replies: [
      {
        risk: "safe",
        messages: ["okay genuine question — does mochi pick the hiking trails or do you"],
        reasoning: "Specific bio reference + a real question = easy reply, not generic.",
      },
      {
        risk: "medium",
        messages: ["med student with a dog named mochi is honestly a brand. who's running the marketing"],
        reasoning: "Compliments the vibe without complimenting looks. Invites a personality reply.",
      },
      {
        risk: "bold",
        messages: [
          "i'm gonna assume mochi vetoed half your tinder pictures",
          "what made the cut and what didn't",
        ],
        reasoning: "Playful, teasing, and lets her perform a fun answer. High engagement potential.",
      },
    ],
  },
  {
    id: "ask-out",
    title: "Time to ask her out",
    blurb: "Week of good banter. Ready to propose meeting up — without making it a Tinder cliché.",
    context: "Texting for a week, vibe is good, lots of laughs. Want to ask her out for coffee or drinks without being awkward.",
    moods: ["Bold", "Smooth"],
    intensity: 7,
    language: "english",
    analysis: {
      stage: "ask_out",
      vibe: "Rapport is solid — she's reciprocating and the convo has rhythm. Greenlight to propose meeting up.",
      recommendedRisk: "bold",
      languageDetected: "English",
      flags: [
        {
          type: "green",
          label: "Asks back",
          detail: "She returns questions and adds context, not just one-word replies.",
        },
        {
          type: "green",
          label: "Initiates jokes",
          detail: "Multiple times she's started bits and called back to earlier ones.",
        },
      ],
    },
    replies: [
      {
        risk: "safe",
        messages: [
          "look — i'm enjoying this but my thumbs are tired. coffee this week?",
        ],
        reasoning: "Direct, low-pressure, lets her say yes without feeling cornered.",
      },
      {
        risk: "medium",
        messages: ["okay we're like 80 messages in and i still don't know if you're funny in person. let's fix that — drinks friday?"],
        reasoning: "Names the rapport, proposes a specific time. Confident without over-explaining.",
      },
      {
        risk: "bold",
        messages: [
          "real talk — texting is fun but i'd rather buy you a drink and watch you try to be this funny in person",
          "friday or saturday?",
        ],
        reasoning: "Bold tease + concrete options = easy yes/no. Skips the back-and-forth.",
      },
    ],
  },
];
