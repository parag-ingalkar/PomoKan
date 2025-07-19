export type Status = 'to_do' | 'in_progress' | 'completed'

export type Todo = {
  id: string;
  description: string;
  due_date: string | null;
  is_completed: boolean;
  is_important: boolean;
  is_urgent: boolean;
  completed_at: string | null;
  status: Status;
  pomodoro_count: number;
}

