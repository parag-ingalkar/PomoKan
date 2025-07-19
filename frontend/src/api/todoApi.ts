
import type { Todo } from '@/utils/type-todo';
import api from './axios'; 

// GET all todos
export const getTodos = async (): Promise<Todo[]> => {
  const res = await api.get<Todo[]>('/todos/');
  return res.data;
};

// POST a new todo
export const createTodo = async (todo: Partial<Todo>): Promise<Todo> => {
  const res = await api.post<Todo>('/todos/', todo);
  return res.data;
};

// GET a specific todo
export const getTodoById = async (id: string): Promise<Todo> => {
  const res = await api.get<Todo>(`/todos/${id}`);
  return res.data;
};

// PATCH a todo
export const patchTodo = async (id: string, updates: Partial<Todo>): Promise<Todo> => {
  const res = await api.patch<Todo>(`/todos/${id}`, updates);
  return res.data;
};

// DELETE a todo
export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

// DELETE multiple todos
export const deleteMultipleTodos = async (todoIds: string[]): Promise<void> => {
  await api.delete('/todos/delete-batch', {
    data: { todo_ids: todoIds }
  });
};

// Increment pomodoro count for a todo
export const incrementPomodoro = async (id: string): Promise<Todo> => {
  const res = await api.put<Todo>(`/todos/${id}/increment-pomodoro`);
  return res.data;
};
