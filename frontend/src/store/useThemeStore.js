import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("MeetZo-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("MeetZo-theme", theme);
    set({ theme });
  },
}));