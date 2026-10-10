import type { EntryType, MoodKey, MoodMeta } from "../types/entry";

export const MOODS: Record<MoodKey, MoodMeta> = {
  happy: { label: "Happy", color: "#e0b040" },
  calm: { label: "Calm", color: "#7fae9c" },
  excited: { label: "Excited", color: "#e58b5a" },
  grateful: { label: "Grateful", color: "#a3b86c" },
  neutral: { label: "Neutral", color: "#a9a196" },
  sad: { label: "Sad", color: "#6f8fb5" },
  anxious: { label: "Anxious", color: "#b58fb0" },
  stressed: { label: "Stressed", color: "#c46f55" },
  tired: { label: "Tired", color: "#9a8f7a" },
  angry: { label: "Angry", color: "#c0504a" },
  other: { label: "Other", color: "#8a8f99" },
};
export const MOOD_KEYS = Object.keys(MOODS) as MoodKey[];

export const ENTRY_TYPES: EntryType[] = ["diary", "thought", "coding", "memory", "other"];

export const PROMPTS = [
  "What felt meaningful today?",
  "What did you learn about yourself?",
  "What are you working through right now?",
  "What would you like to remember about this week?",
];