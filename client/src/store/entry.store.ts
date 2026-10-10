import { create } from "zustand";
import axios from "axios";
import entryInstance from "../api/entryInstance";
import type { EntryState } from "../types/entry";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const useEntryStore = create<EntryState>((set) => ({
  entries: [],
  pagination: null,
  entry: null,
  calendarEntries: [],
  memories: [],
  moodStats: null,
  loading: false,
  error: null,

  fetchEntries: async (filters = {}, append = false) => {
    set({ loading: true, error: null });
    try {
      const res = await entryInstance.get("/all-entries", { params: filters });
      set((s) => ({
        entries: append
          ? [...s.entries, ...res.data.entries]
          : res.data.entries,
        pagination: res.data.pagination,
        loading: false,
      }));
    } catch (err) {
      set({ error: getError(err, "Failed to fetch entries"), loading: false });
    }
  },

  fetchEntry: async (id) => {
    set({ loading: true, error: null, entry: null });
    try {
      const res = await entryInstance.get(`/create/${id}`);
      set({ entry: res.data.entry, loading: false });
    } catch (err) {
      set({ error: getError(err, "Failed to fetch entry"), loading: false });
    }
  },

  createEntry: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await entryInstance.post("/create", data);
      set((s) => ({
        entries: [res.data.entry, ...s.entries],
        pagination: s.pagination && {
          ...s.pagination,
          total: s.pagination.total + 1,
        },
        loading: false,
      }));
      return res.data.entry;
    } catch (err) {
      set({ error: getError(err, "Failed to create entry"), loading: false });
      return null;
    }
  },

  updateEntry: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await entryInstance.patch(`/update/${id}`, data);
      set((s) => ({
        entries: s.entries.map((e) => (e._id === id ? res.data.entry : e)),
        entry: s.entry?._id === id ? res.data.entry : s.entry,
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: getError(err, "Failed to update entry"), loading: false });
      return false;
    }
  },

  deleteEntry: async (id) => {
    set({ loading: true, error: null });
    try {
      await entryInstance.delete(`/delete/${id}`);
      set((s) => ({
        entries: s.entries.filter((e) => e._id !== id),
        entry: s.entry?._id === id ? null : s.entry,
        pagination: s.pagination && {
          ...s.pagination,
          total: s.pagination.total - 1,
        },
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: getError(err, "Failed to delete entry"), loading: false });
      return false;
    }
  },

  fetchCalendar: async (month) => {
    set({ error: null });
    try {
      const res = await entryInstance.get("/calendar", { params: { month } });
      set({ calendarEntries: res.data.entries });
    } catch (err) {
      set({ error: getError(err, "Failed to fetch calendar entries") });
    }
  },

  fetchMemories: async () => {
    set({ error: null });
    try {
      const res = await entryInstance.get("/memories");
      set({ memories: res.data.entries });
    } catch (err) {
      set({ error: getError(err, "Failed to fetch memories") });
    }
  },

  fetchMoodStats: async (from, to) => {
    set({ error: null });
    try {
      const res = await entryInstance.get("/mood-stats", {
        params: { from, to },
      });
      set({ moodStats: res.data });
    } catch (err) {
      set({ error: getError(err, "Failed to fetch mood stats") });
    }
  },

  clearError: () => set({ error: null }),
}));
