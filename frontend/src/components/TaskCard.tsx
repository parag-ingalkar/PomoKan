import { useState } from 'react'
import type { Todo } from '../utils/data-tasks'

const lowPriorityIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9l7 7 7-7" />
</svg>

const highPriorityIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
</svg>

const TaskCard = ({task, updateTask}: {
  task: Todo
  updateTask: (task: Todo) => void
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  
  return <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData("id", task.id)
    }}
    className="border rounded-lg px-2 m-2 bg-gray-50 w-56"
  >
    <div className="text-base font-base py-2">
      {isEditingTitle ? (
        <input
          autoFocus
          className="w-full"
          onBlur={() => setIsEditingTitle(false)}
          value={task.description}
          onChange={(e) => updateTask({...task, description: e.target.value})}
        />
      ): (
        <div onClick={() => setIsEditingTitle(true)}>
          {task.description}
        </div>
      )}
    </div>
    <div className="flex gap-4 flex-col justify-between py-2 text-gray-500 text-sm">
      <div className="flex gap-2">
        Importance
        {task.is_important? highPriorityIcon : lowPriorityIcon}
        Urgency
        {task.is_urgent? highPriorityIcon : lowPriorityIcon}
      </div>
      <div className="flex gap-2">
        Pomodoros : {task.pomodoro_count}
      </div>
    </div>
  </div>
}

export default TaskCard