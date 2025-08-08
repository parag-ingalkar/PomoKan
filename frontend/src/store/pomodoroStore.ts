import { create } from "zustand";
import type { Todo } from "@/utils/type-todo";
import { incrementPomodoro as incrementPomodoroApi } from "@/api/todoApi";

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
  incrementPomodoro: (id: string) => Promise<Todo | null>;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  selectedTask: null,
  setSelectedTask: (task: Todo) => set({ selectedTask: task }),
  clearSelectedTask: () => set({ selectedTask: null }),
  lastUpdatedTask: null,
  setLastUpdatedTask: (task: Todo | null) => set({ lastUpdatedTask: task }),
  isRunning: false,
  setIsRunning: (running: boolean) => set({ isRunning: running }),
  mode: "pomodoro",
  setMode: (mode: "pomodoro" | "short-break" | "long-break") => set({ mode }),
  incrementPomodoro: async (id: string) => {
    try {
      const updatedTodo = await incrementPomodoroApi(id);
      set({ lastUpdatedTask: updatedTodo });
      return updatedTodo;
    } catch (err) {
      return null;
    }
  },
})); 