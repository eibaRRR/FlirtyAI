/**
 * Canned demo scenarios used to show off FlirtyAI without spending API calls.
 * Each scenario includes the fake conversation (so we can render an input preview),
 * the form settings used, and the canned LLM-style output.
 */
import type { Analysis, Language, MoodPreset, Reply } from "./schema";

export type DemoMessage = {
  /** "them" = left-side gray bubble, "me" = right-side blue bubble */
  from: "them" | "me";
  text: string;
  /** Optional timestamp shown above the message group */
  ts?: string;
};

export type DemoScenario = {
  id: string;
  title: string;
  blurb: string;
  /** Optional dating platform tag shown on landing-page demo cards (e.g. "Tinder") */
  platform?: string;
  /** Display name for the fake match — used in the chat header */
  match: { name: string; status: string };
  /** The fake conversation that the canned replies are responding to */
  conversation: DemoMessage[];
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
    blurb: "She was into it, then went quiet. Re-open without sounding desperate.",
    platform: "WhatsApp",
    match: { name: "Sara", status: "active 2d ago" },
    conversation: [
      { from: "me", text: "okay if you had to pick a death-row meal what's the order", ts: "Mon · 11:42 PM" },
      { from: "them", text: "easy. tagine + pizza + a bowl of sour patch kids" },
      { from: "me", text: "the tagine + sour patch combo is unhinged actually" },
      { from: "them", text: "hahaha you're like a food therapist" },
      { from: "me", text: "i charge by the hour and i don't take insurance" },
      { from: "them", text: "🤣 i'll think about it" },
      // Then 2-day gap
      { from: "me", text: "wait you can't just leave that as the last message" },
    ],
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
    blurb: "Just matched. Bio mentions hiking and a dog named Mochi. Open with something that lands.",
    platform: "Tinder",
    match: { name: "Layla", status: "matched today" },
    conversation: [
      { from: "them", text: "hey 👋", ts: "Today · 6:18 PM" },
    ],
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
    blurb: "Week of good banter. Propose meeting up — without making it a Tinder cliché.",
    platform: "Hinge",
    match: { name: "Yasmine", status: "online now" },
    conversation: [
      { from: "me", text: "okay confession — i was 100% wrong about that pizza place", ts: "Today · 9:24 PM" },
      { from: "them", text: "AHA i told you. i told you and you ignored me" },
      { from: "me", text: "i ignored you and the universe punished me with cold pasta" },
      { from: "them", text: "as it should" },
      { from: "them", text: "next time you're trusting my list 🫡" },
      { from: "me", text: "you have a LIST?" },
      { from: "them", text: "of course i have a list. who do you think i am" },
    ],
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
        messages: ["look — i'm enjoying this but my thumbs are tired. coffee this week?"],
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
