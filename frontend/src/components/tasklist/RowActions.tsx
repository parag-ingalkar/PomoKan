// File: src/components/tasks/RowActions.tsx

import { type Row } from "@tanstack/react-table";
import { type Todo } from "@/utils/type-todo";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import { AddTaskDialog } from "./AddTaskDialog";
import { useTodosStore } from "@/store/todosStore";

export function RowActions({ row }: { row: Row<Todo> }) {
	const [showDialog, setShowDialog] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const deleteTodoStore = useTodosStore((s) => s.deleteTodo);
	const updateTodoStore = useTodosStore((s) => s.updateTodo);

	const handleEdit = () => {
		setEditOpen(true);
	};

	const handleSave = (updated: Todo) => {
		updateTodoStore(updated);
		setEditOpen(false);
	};

	const handleDelete = () => {
		console.log("row.original.id", row.original.id);
		deleteTodoStore(row.original.id);
		setShowDialog(false);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost" className="shadow-none">
						<EllipsisIcon size={16} aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
					<DropdownMenuItem
						className="text-destructive"
						onClick={() => setShowDialog(true)}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AddTaskDialog
				visible={editOpen}
				onClose={() => setEditOpen(false)}
				todo={row.original}
				onSubmit={handleSave}
			/>

			<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the task.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
