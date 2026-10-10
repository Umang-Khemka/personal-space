export type EntryType = "diary" | "thought" | "coding" | "memory" | "other";
export type EntryStatus = "draft" | "complete";
export type Mood =
  | "happy" | "calm" | "excited" | "grateful" | "neutral" | "sad"
  | "anxious" | "stressed" | "tired" | "angry" | "other";

export interface Entry {
  _id: string;
  user: string;
  title: string;
  content: string;
  type: EntryType;
  tags: string[];
  mood?: Mood;
  entryDate: string;
  isFavorite: boolean;
  status: EntryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EntryInput {
  title?: string;
  content: string;
  type?: EntryType;
  tags?: string[];
  mood?: Mood;
  entryDate?: string; // "YYYY-MM-DD"
  isFavorite?: boolean;
  status?: EntryStatus;
}

export type EntryUpdate = Partial<EntryInput>;

export interface EntryFilters {
  search?: string;
  type?: EntryType;
  mood?: Mood;
  favorite?: boolean;
  from?: string; // "YYYY-MM-DD"
  to?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export type CalendarEntry = Pick<
  Entry,
  "_id" | "title" | "type" | "mood" | "entryDate" | "isFavorite" | "status"
>;

export type Memory = Pick<
  Entry,
  "_id" | "title" | "content" | "type" | "mood" | "entryDate" | "isFavorite"
>;

export interface MoodStats {
  totalEntries: number;
  moods: { mood: Mood | "unset"; count: number }[];
}

export interface EntryState {
  entries: Entry[];
  pagination: Pagination | null;
  entry: Entry | null;
  calendarEntries: CalendarEntry[];
  memories: Memory[];
  moodStats: MoodStats | null;
  loading: boolean;
  error: string | null;
  fetchEntries: (filters?: EntryFilters, append?: boolean) => Promise<void>;
  fetchEntry: (id: string) => Promise<void>;
  createEntry: (data: EntryInput) => Promise<Entry | null>;
  updateEntry: (id: string, data: EntryUpdate) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
  fetchCalendar: (month: string) => Promise<void>; // "YYYY-MM"
  fetchMemories: () => Promise<void>;
  fetchMoodStats: (from?: string, to?: string) => Promise<void>;
  clearError: () => void;
}