import { create, type SetState } from "zustand";
import type { Todo } from "@/utils/type-todo";

export interface PomodoroState {
  selectedTask: Todo | null;
  setSelectedTask: (task: Todo) => void;
  clearSelectedTask: () => void;
  lastUpdatedTask: Todo | null;
  setLastUpdatedTask: (task: Todo | null) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  mode: "pomodoro" | "short-break" | "long-break";
  setMode: (mode: "pomodoro" | "short-break" | "long-break") => void;
}

export const usePomodoroStore = create<PomodoroState>((set: SetState<PomodoroState>) => ({
  selectedTask: null,
  setSelectedTask: (task: Todo) => set({ selectedTask: task }),
  clearSelectedTask: () => set({ selectedTask: null }),
  lastUpdatedTask: null,
  setLastUpdatedTask: (task: Todo | null) => set({ lastUpdatedTask: task }),
  isRunning: false,
  setIsRunning: (running: boolean) => set({ isRunning: running }),
  mode: "pomodoro",
  setMode: (mode: "pomodoro" | "short-break" | "long-break") => set({ mode }),
})); 