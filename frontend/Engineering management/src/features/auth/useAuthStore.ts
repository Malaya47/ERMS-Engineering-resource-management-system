import { create } from "zustand";
import api from "../../lib/axios";

interface AuthState {
  token: string | null;
  user: any;
  setAuth: (token: string, user: any) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: null,
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    set({ token, user });
  },
  fetchUser: async () => {
    try {
      const res = await api.get("/auth/profile");
      set({ user: res.data });
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      set({ user: null });
    }
  },
  logout: () => {
    localStorage.clear();
    set({ token: null, user: null });
  },
}));
