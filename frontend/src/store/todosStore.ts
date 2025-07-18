import { create } from "zustand";
import type { Todo } from "@/utils/type-todo";
import { getTodos, patchTodo, deleteTodo, createTodo } from "@/api/todoApi";

interface TodosState {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, "id">) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodosStore = create<TodosState>((set, get) => ({
  todos: [],
  fetchTodos: async () => {
    const data = await getTodos();
    set({ todos: data });
  },
  addTodo: async (todo) => {
    try {
      const newTodo = await createTodo(todo);
      set((state) => ({ todos: [...state.todos, newTodo] }));
    } catch (err) {
      console.error("Failed to add todo", err);
    }
  },
  updateTodo: async (todo) => {
    // Optimistic update
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
    }));
    try {
      const updated = await patchTodo(todo.id, todo);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === updated.id ? updated : t)),
      }));
    } catch (err) {
      // Rollback: refetch
      await get().fetchTodos();
      console.error("Failed to update todo", err);
    }
  },
  deleteTodo: async (id) => {
    // Optimistic delete
    const prevTodos = get().todos;
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    }));
    try {
      await deleteTodo(id);
    } catch (err) {
      // Rollback: restore previous todos
      set({ todos: prevTodos });
      console.error("Failed to delete todo", err);
    }
  },
})); 