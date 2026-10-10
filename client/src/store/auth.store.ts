import {create} from "zustand";
import axios from "axios";
import authInstance from "../api/authInstance";
import type { AuthState} from "../types/auth";


const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  error: null,

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authInstance.post("/register", { username, email, password });
      set({ user: res.data.user, loading: false });
      return true;
    } catch (err) {
      set({ error: getError(err, "Registration failed"), loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authInstance.post("/login", { email, password });
      set({ user: res.data.user, loading: false });
      return true;
    } catch (err) {
      set({ error: getError(err, "Login failed"), loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await authInstance.post("/logout");
    } catch (err) {
      set({ error: getError(err, "Logout failed") });
    } finally {
      set({ user: null });
    }
  },

  checkAuth: async () => {
    try {
      const res = await authInstance.get("/me");
      set({ user: res.data.user, checkingAuth: false });
    } catch {
      set({ user: null, checkingAuth: false });
    }
  },

  clearError: () => set({ error: null }),
}));

