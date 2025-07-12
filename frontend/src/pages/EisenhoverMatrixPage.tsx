import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import api from "../api/axios";
import { type Todo } from "../utils/data-tasks";

const EisenhowerMatrixPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos/");
      setTodos(res.data);
    } catch {
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const updateTask = (task: Todo) => {
    api.put(`/todos/${task.id}`, task);
    const updated = todos.map((t) => (t.id === task.id ? task : t));
    setTodos(updated);
  };

  const quadrants = {
    doFirst: todos.filter((t) => t.is_important && t.is_urgent),
    schedule: todos.filter((t) => t.is_important && !t.is_urgent),
    delegate: todos.filter((t) => !t.is_important && t.is_urgent),
    eliminate: todos.filter((t) => !t.is_important && !t.is_urgent),
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 h-[calc(100vh-4rem)]">
      {/* DO FIRST */}
      <div className="border p-4 bg-red-100 rounded overflow-auto">
        <h2 className="text-xl font-bold text-red-700 mb-2">Do First</h2>
        {quadrants.doFirst.map((todo) => (
          <TaskCard key={todo.id} task={todo} updateTask={updateTask} />
        ))}
      </div>

      {/* SCHEDULE */}
      <div className="border p-4 bg-yellow-100 rounded overflow-auto">
        <h2 className="text-xl font-bold text-yellow-700 mb-2">Schedule</h2>
        {quadrants.schedule.map((todo) => (
          <TaskCard key={todo.id} task={todo} updateTask={updateTask} />
        ))}
      </div>

      {/* DELEGATE */}
      <div className="border p-4 bg-blue-100 rounded overflow-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Delegate</h2>
        {quadrants.delegate.map((todo) => (
          <TaskCard key={todo.id} task={todo} updateTask={updateTask} />
        ))}
      </div>

      {/* ELIMINATE */}
      <div className="border p-4 bg-gray-100 rounded overflow-auto">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Eliminate</h2>
        {quadrants.eliminate.map((todo) => (
          <TaskCard key={todo.id} task={todo} updateTask={updateTask} />
        ))}
      </div>
    </div>
  );
};

export default EisenhowerMatrixPage;
