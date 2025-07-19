import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AudioOption = "soft-bells" | "good-morning" | "sky-high-pitch";

export interface SettingsState {
  selectedAudio: AudioOption;
  setSelectedAudio: (audio: AudioOption) => void;
  pomodoroDuration: number;
  setPomodoroDuration: (duration: number) => void;
  shortBreakDuration: number;
  setShortBreakDuration: (duration: number) => void;
  longBreakDuration: number;
  setLongBreakDuration: (duration: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedAudio: "soft-bells",
      setSelectedAudio: (audio: AudioOption) => set({ selectedAudio: audio }),
      pomodoroDuration: 25,
      setPomodoroDuration: (duration: number) => set({ pomodoroDuration: duration }),
      shortBreakDuration: 5,
      setShortBreakDuration: (duration: number) => set({ shortBreakDuration: duration }),
      longBreakDuration: 15,
      setLongBreakDuration: (duration: number) => set({ longBreakDuration: duration }),
    }),
    {
      name: "pomokan-settings",
    }
  )
); 