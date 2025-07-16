import { useEffect, useState } from "react";
import type { Todo } from "@/utils/type-todo";
import { BurnBarrel } from "./KanbanBurnBarrel";
import { Column } from "./KanbanColumn";
import { getTodos } from "@/api/todoApi";

export const Kanban = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [error, setError] = useState("");

	const fetchTodos = async () => {
		try {
			const data = await getTodos();
			setTodos(data);
		} catch {
			setError("Failed to fetch todos");
		} finally {
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	return (
		<div className="h-full w-full flex justify-around">
			<div className="flex gap-3 overflow-scroll p-8 no-scrollbar">
				<Column
					title="TODO"
					column="to_do"
					headingColor="text-yellow-200"
					cards={todos}
					setCards={setTodos}
				/>
				<Column
					title="In progress"
					column="in_progress"
					headingColor="text-blue-200"
					cards={todos}
					setCards={setTodos}
				/>
				<Column
					title="Complete"
					column="completed"
					headingColor="text-emerald-200"
					cards={todos}
					setCards={setTodos}
				/>
				<BurnBarrel setCards={setTodos} />
			</div>
		</div>
	);
};
