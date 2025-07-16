import { useEffect, useState } from "react";
import type { Todo } from "@/utils/type-todo";
import { getTodos } from "@/api/todoApi";
import { Quadrant } from "./Quadrant";

const EisenhowerMatrix = () => {
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
		<div className="grid grid-cols-2 grid-rows-2 gap-8 w-full h-full p-6 pt-0">
			{/* Q1: Important + Urgent */}
			<Quadrant
				title="Do First"
				quadrant="do"
				color="emerald"
				cards={todos}
				setCards={setTodos}
			/>
			<Quadrant
				title="Schedule"
				quadrant="schedule"
				color="yellow"
				cards={todos}
				setCards={setTodos}
			/>
			<Quadrant
				title="Delegate"
				quadrant="delegate"
				color="cyan"
				cards={todos}
				setCards={setTodos}
			/>
			<Quadrant
				title="Delete"
				quadrant="delete"
				color="orange"
				cards={todos}
				setCards={setTodos}
			/>
		</div>
	);
};

export default EisenhowerMatrix;
