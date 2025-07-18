// src/components/tasks/TaskList.tsx
import { useEffect, useState } from "react";
import { TaskTable } from "./TaskTable";
import { useTodosStore } from "@/store/todosStore";

export default function TaskList() {
	const todos = useTodosStore((s) => s.todos);
	const fetchTodos = useTodosStore((s) => s.fetchTodos);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		setLoading(true);
		fetchTodos().catch(() => setError("Failed to fetch todos"))
			.finally(() => setLoading(false));
	}, [fetchTodos]);

	return (
		// TODO : Change the w-5xl value correctly to inherit full widht from parent
		<div className="h-full w-full flex justify-around">
			{error && <p className="text-red-500">{error}</p>}
			<TaskTable todos={todos} />
		</div>
	);
}
