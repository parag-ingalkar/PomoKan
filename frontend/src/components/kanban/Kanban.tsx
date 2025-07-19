import { useEffect, useState } from "react";
import type { Todo } from "@/utils/type-todo";
import { BurnBarrel } from "./KanbanBurnBarrel";
import { Column } from "./KanbanColumn";
import { useTodosStore } from "@/store/todosStore";

export const Kanban = () => {
	const todos = useTodosStore((s) => s.todos);

	return (
		<div className="h-full w-full flex justify-around">
			<div className="flex gap-3 overflow-scroll p-8 no-scrollbar">
				<Column
					title="TODO"
					column="to_do"
					headingColor="text-yellow-200"
					cards={todos}
				/>
				<Column
					title="In progress"
					column="in_progress"
					headingColor="text-blue-200"
					cards={todos}
				/>
				<Column
					title="Complete"
					column="completed"
					headingColor="text-emerald-200"
					cards={todos}
				/>
				<BurnBarrel />
			</div>
		</div>
	);
};
