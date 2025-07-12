import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { type Todo } from '../utils/data-tasks';


const TodosPage: React.FC = () => {
  const { user } = useAuth();

  const [todos, setTodos] = useState<Todo[]>([]);

  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');
  const [is_important, setIsImportant] = useState<boolean>(true); // Default to True
  const [is_urgent, setIsUrgent] = useState<boolean>(false); // Default to False

  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editDue, setEditDue] = useState('');
  const [editIsImportant, setEditIsImportant] = useState<boolean>(true);
  const [editIsUrgent, setEditIsUrgent] = useState<boolean>(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/todos/');
      setTodos(res.data);
    } catch {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/todos/', {
        description: desc,
        due_date: due ? new Date(due).toISOString() : null,
        is_important,
        is_urgent,
      });
      setDesc(''); setDue(''); setIsImportant(true); setIsUrgent(false);
      fetchTodos();
    } catch {
      setError('Failed to add todo');
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditDesc(todo.description);
    setEditDue(todo.due_date ? todo.due_date.slice(0, 10) : '');
    setEditIsImportant(todo.is_important);
    setEditIsUrgent(todo.is_urgent);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await api.put(`/todos/${editingId}`, {
        description: editDesc,
        due_date: editDue ? new Date(editDue).toISOString() : null,
        is_important: editIsImportant,
        is_urgent: editIsUrgent,
      });
      setEditingId(null);
      fetchTodos();
    } catch {
      setError('Failed to update todo');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleComplete = async (id: string) => {
    await api.put(`/todos/${id}/complete`);
    fetchTodos();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/todos/${id}`);
    fetchTodos();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Todos Dashboard</h1>
      <form onSubmit={handleAdd} className="flex gap-4 mb-6 items-center flex-wrap">
  <input
    className="flex-1 border rounded px-3 py-2"
    placeholder="Description"
    value={desc}
    onChange={(e) => setDesc(e.target.value)}
    required
  />

  <input
    type="date"
    className="border rounded px-3 py-2"
    value={due}
    onChange={(e) => setDue(e.target.value)}
  />

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={is_important}
      onChange={(e) => setIsImportant(e.target.checked)}
    />
    Important
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={is_urgent}
      onChange={(e) => setIsUrgent(e.target.checked)}
    />
    Urgent
  </label>

  <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
  >
    Add
  </button>
</form>

      {error && <div className="mb-4 text-red-500">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <ul className="space-y-4">
          {todos.map(todo => (
            <li key={todo.id} className={`p-4 rounded shadow flex items-center justify-between ${todo.status == 'completed' ? 'bg-green-100' : 'bg-white'}`}>
              {editingId === todo.id ? (
                <form onSubmit={handleEditSubmit} className="flex-1 flex gap-2 items-center">
                  <input className="flex-1 border rounded px-3 py-2" value={editDesc} onChange={e => setEditDesc(e.target.value)} required />
                  <input type="date" className="border rounded px-3 py-2" value={editDue} onChange={e => setEditDue(e.target.value)} />
                  <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editIsImportant}
                    onChange={(e) => setEditIsImportant(e.target.checked)}
                  />
                  Important
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editIsUrgent}
                    onChange={(e) => setEditIsUrgent(e.target.checked)}
                  />
                  Urgent
                </label>
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Save</button>
                  <button type="button" onClick={handleEditCancel} className="bg-gray-400 text-white px-3 py-1 rounded text-xs">Cancel</button>
                </form>
              ) : (
                <>
                  <div>
                    <div className="font-semibold">{todo.description}</div>
                    <div className="text-sm text-gray-500">Due: {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : 'No due date'}</div>
                    <div className="text-xs text-gray-400">Importance: {todo.is_important ? 'High': 'Low'}</div>
                    <div className="text-xs text-gray-400">Urgency: {todo.is_urgent ? 'High': 'Low'}</div>
                    {todo.is_completed && <div className="text-green-600 text-xs">Completed</div>}
                  </div>
                  <div className="flex gap-2">
                    {todo.status != 'completed' && <button onClick={() => handleComplete(todo.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Complete</button>}
                    {todo.status != 'completed' && <button onClick={() => handleEdit(todo)} className="bg-yellow-500 text-white px-3 py-1 rounded text-xs">Edit</button>}
                    <button onClick={() => handleDelete(todo.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodosPage; 