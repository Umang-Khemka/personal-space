import type { Entry, EntryType, Memory, Mood } from "../types/entry";

export { MOODS, MOOD_KEYS, ENTRY_TYPES, PROMPTS } from "./constants";

const e = (
  id: number, title: string, content: string, type: EntryType, mood: Mood | undefined,
  tags: string[], entryDate: string, isFavorite: boolean, status: Entry["status"] = "complete",
): Entry => ({
  _id: String(id), user: "mock", title, content, type, mood, tags, entryDate, isFavorite, status,
  createdAt: `${entryDate}T20:00`, updatedAt: `${entryDate}T20:00`,
});

export const mockEntries: Entry[] = [
  e(1, "A slow, useful Tuesday", "Finished the outline for the garden project before lunch, then walked to the river. Nothing dramatic happened, and that felt like the point. I want more days shaped like this.", "diary", "calm", ["routine", "gratitude"], "2026-10-10", true),
  e(2, "App idea: a pocket plant doctor", "What if you photographed a drooping leaf and got three plain-language guesses? Keep it offline-first. Maybe start with ten common houseplants only.", "thought", "excited", ["ideas", "projects"], "2026-10-09", false),
  e(3, "Fixed the off-by-one in pagination", "The bug was in the skip calculation: page * limit, not (page - 1) * limit.\n\nconst skip = (page - 1) * limit;\n\nLesson: write the failing test first, even for tiny fixes.", "coding", "happy", ["debugging", "node"], "2026-10-07", true),
  e(4, "Sunrise at the lake house", "We woke at five to watch fog lift off the water. Dad made terrible coffee and nobody minded. I want to remember the quiet and the sound of the oars.", "memory", "grateful", ["family", "travel"], "2026-10-01", true),
  e(5, "Too many tabs, not enough focus", "Today felt scattered. Started four things, finished none. Tomorrow: one task, one hour, phone in another room.", "diary", "stressed", ["focus"], "2026-10-05", false),
  e(6, "Notes on React effects", "Effects are for syncing with the outside world, not for deriving state. If I can compute it during render, I should.", "coding", "neutral", ["react", "learning"], "2026-09-28", false),
  e(7, "Slow brew Saturday", "Woke before the alarm, ground fresh beans and watched steam curl from the mug. Reminded myself to savor these minutes instead of scrolling.", "diary", "calm", ["mornings"], "2026-09-23", false),
  e(8, "Early tired evening", "Bed by nine. Sometimes rest is the most productive thing on the list.", "thought", "tired", ["rest"], "2026-09-20", false),
  e(9, "Last year, almost to the day", "Moved the desk next to the window and it changed everything. Sunlight on the keyboard at 4pm. Small things count.", "diary", "happy", ["home"], "2025-10-10", false),
  e(10, "Two years ago: the long train ride", "Eleven hours, one notebook, and no signal. I wrote more that day than all month. Remember that.", "memory", "grateful", ["travel"], "2024-10-10", true),
  e(11, "Three years ago: starting over", "New city, boxes everywhere, a borrowed lamp. Scary and exciting in equal parts.", "memory", "anxious", ["change"], "2023-10-10", false),
  e(12, "Draft: letter to future me", "Dear me, by the time you read this...", "other", undefined, ["letters"], "2026-10-08", false, "draft"),
];

/** Entries from earlier years on the same month/day as MOCK_TODAY. */
export const mockMemories: Memory[] = mockEntries
  .filter((x) => x.entryDate.slice(5) === "10-10" && x.entryDate < "2026")
  .sort((a, b) => b.entryDate.localeCompare(a.entryDate));

export const sortEntries = (a: Entry[]) =>
  [...a].sort((x, y) => y.entryDate.localeCompare(x.entryDate) || y._id.localeCompare(x._id));