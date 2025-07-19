import { Quadrant } from "./Quadrant";
import { useTodosStore } from "@/store/todosStore";

const EisenhowerMatrix = () => {
	const todos = useTodosStore((s) => s.todos);

	return (
		<div className="grid grid-cols-2 grid-rows-2 gap-8 w-full h-full p-6 pt-0">
			{/* Q1: Important + Urgent */}
			<Quadrant
				title="Do First"
				quadrant="do"
				color="emerald"
				cards={todos}
			/>
			<Quadrant
				title="Schedule"
				quadrant="schedule"
				color="yellow"
				cards={todos}
			/>
			<Quadrant
				title="Delegate"
				quadrant="delegate"
				color="cyan"
				cards={todos}
			/>
			<Quadrant
				title="Delete"
				quadrant="delete"
				color="orange"
				cards={todos}
			/>
		</div>
	);
};

export default EisenhowerMatrix;
