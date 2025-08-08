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
import { TrashIcon, PlusIcon, CircleAlertIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { type Todo } from "@/utils/type-todo";
import { AddTaskDialog } from "./AddTaskDialog";
import { useState } from "react";
import { useTodosStore } from "@/store/todosStore";
import { toast } from "sonner";

type Props = {
	table: Table<Todo>;
};

export function TaskActions({ table }: Props) {
	const [showAddTask, setShowAddTask] = useState(false);
	const deleteMultipleTodos = useTodosStore((state) => state.deleteMultipleTodos);

	const selectedRows = table.getSelectedRowModel().rows;

	const handleDelete = async () => {
		try {
			const todoIds = selectedRows.map((row) => row.original.id);
			await deleteMultipleTodos(todoIds);
			table.resetRowSelection();
			toast.success(`Successfully deleted ${todoIds.length} task${todoIds.length === 1 ? '' : 's'}`);
		} catch (error) {
			console.error('Failed to delete todos:', error);
			toast.error('Failed to delete some tasks. Please try again.');
		}
	};

	return (
		<div className="flex justify-between items-center gap-2">
			{selectedRows.length > 0 && (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline" className="ml-auto">
							<TrashIcon className="-ms-1 opacity-60" size={16} />
							Delete
							<span className="-me-1 border text-muted-foreground/70 rounded px-1 text-xs">
								{selectedRows.length}
							</span>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
							<div
								className="flex size-9 shrink-0 items-center justify-center rounded-full border"
								aria-hidden="true"
							>
								<CircleAlertIcon className="opacity-80" size={16} />
							</div>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete{" "}
									{table.getSelectedRowModel().rows.length} selected{" "}
									{table.getSelectedRowModel().rows.length === 1
										? "row"
										: "rows"}
									.
								</AlertDialogDescription>
							</AlertDialogHeader>
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleDelete}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}

			<Button
				variant="outline"
				className="ml-auto"
				onClick={() => setShowAddTask(true)}
			>
				<PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
				Add Task
			</Button>

			<AddTaskDialog
				visible={showAddTask}
				onClose={() => setShowAddTask(false)}
			/>
		</div>
	);
}
