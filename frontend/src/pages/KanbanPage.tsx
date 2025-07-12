import { useEffect, useState } from 'react'
import TaskCard from '../components/TaskCard'
import { type Status, statuses, type Todo } from '../utils/data-tasks'
import api from '../api/axios'



const KanbanPage: React.FC = () => {
  // const [tasks, setTasks] = useState<Task[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
  

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


  // const fetchTodos = async () => {
  //   //   const res = await api.get('/todos/');
  //     setTasks(tasksdata);
  // };

  useEffect(() => { fetchTodos(); }, []);

  const columns = statuses.map((status) => {
    const todosInColumn = todos.filter((todo) => todo.status === status)
    return {
      status,
      todos: todosInColumn
    }
  })

  const updateTask = (task: Todo) => {
    api.put(`/todos/${task.id}`, {
      ...task
    })
    const updatedTasks = todos.map((t) => {
      return t.id === task.id ? task : t
    })
    setTodos(updatedTasks)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault()
    setCurrentlyHoveringOver(null)
    const id = e.dataTransfer.getData("id")
    const task = todos.find((task) => task.id === id)
    if(task) {
      updateTask({...task, status})
    }
  }

  const [currentlyHoveringOver, setCurrentlyHoveringOver] = useState<Status | null>(null)
  const handleDragEnter = (status: Status) => {
    setCurrentlyHoveringOver(status)
  }

  return (
    <div className="flex divide-x">
      {columns.map((column) => (
        <div
          onDrop={(e) => handleDrop(e, column.status)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => handleDragEnter(column.status)}
        >
          <div className="flex justify-between text-3xl p-2 font-bold text-gray-500">
            <h2 className="capitalize">{column.status}</h2>
          </div>
          <div className={`h-full ${currentlyHoveringOver === column.status ? 'bg-gray-200' : ''}`}>
          {column.todos.map((todo) => (
            <TaskCard
              task={todo}
              updateTask={updateTask}
            />
          ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default KanbanPage