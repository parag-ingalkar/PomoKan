// src/components/tasks/TaskList.tsx
import { useEffect, useState } from "react";
import { getTodos } from "@/api/todoApi";
import { TaskTable } from "./TaskTable";
import { type Todo } from "@/utils/type-todo";

export default function TaskList() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchTodos = async () => {
			setLoading(true);
			try {
				const data = await getTodos();
				setTodos(data);
			} catch {
				setError("Failed to fetch todos");
			} finally {
				setLoading(false);
			}
		};

		fetchTodos();
	}, []);

	return (
		// TODO : Change the w-5xl value correctly to inherit full widht from parent
		<div className="space-y-4 w-6xl m-4">
			{error && <p className="text-red-500">{error}</p>}
			<TaskTable todos={todos} setTodos={setTodos} />
		</div>
	);
}
