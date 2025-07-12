export type Status = 'to do' | 'in progress' | 'completed'

export type Todo = {
  id: string;
  description: string;
  due_date: string | null;
  is_completed: boolean;
  is_important: boolean;
  is_urgent: boolean;
  created_at: string | null;
  completed_at: string | null;
  status: Status;
  pomodoro_count: number;
}

export const statuses: Status[] = ['to do', 'in progress', 'completed']

