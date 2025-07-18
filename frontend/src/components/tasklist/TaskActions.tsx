// File: src/components/tasks/TaskActions.tsx

import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon, PlusIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { type Todo } from "@/utils/type-todo";
import { AddTaskDialog } from "./AddTaskDialog";
import { useState } from "react";
import { deleteMultipleTodos } from "@/api/todoApi";
import { useTodosStore } from "@/store/todosStore";

type Props = {
	table: Table<Todo>;
};

export function TaskActions({ table }: Props) {
	const [showAddTask, setShowAddTask] = useState(false);

	const selectedRows = table.getSelectedRowModel().rows;

	const handleDelete = async () => {
		const todoIds = selectedRows.map((row) => row.original.id);
		await deleteMultipleTodos(todoIds);
		// Remove from global store
		todoIds.forEach((id) => useTodosStore.getState().deleteTodo(id));
		table.resetRowSelection();
	};


	return (
		<div className="flex justify-between items-center gap-2">
			{selectedRows.length > 0 && (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline">
							<TrashIcon className="mr-2" size={16} />
							Delete
							<span className="ml-2 border rounded px-1 text-xs">
								{selectedRows.length}
							</span>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This will permanently delete {selectedRows.length}{" "}
								{selectedRows.length === 1 ? "task" : "tasks"}.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleDelete}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}

			<Button variant="outline" onClick={() => setShowAddTask(true)}>
				<PlusIcon size={16} />
				Add Task
			</Button>

			<AddTaskDialog
				visible={showAddTask}
				onClose={() => setShowAddTask(false)}
			/>
		</div>
	);
}
