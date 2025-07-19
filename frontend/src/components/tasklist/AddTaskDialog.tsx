import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DueDatePicker } from "./DueDatePicker";
import { Checkbox } from "@/components/ui/checkbox";
// Remove direct API calls
import { useTodosStore } from "@/store/todosStore";

import type { Todo } from "@/utils/type-todo";

type Props = {
	visible: boolean;
	onClose: () => void;
	todo?: Todo;
};

export const AddTaskDialog = ({ visible, onClose, todo }: Props) => {
	const [description, setDescription] = useState(() => todo?.description ?? "");
	const [dueDate, setDueDate] = useState<Date | undefined>(() =>
		todo?.due_date ? new Date(todo.due_date) : undefined
	);
	const [isImportant, setIsImportant] = useState(todo?.is_important ?? false);
	const [isUrgent, setIsUrgent] = useState(todo?.is_urgent ?? false);
	const [loading, setLoading] = useState(false);

	const addTodo = useTodosStore((s) => s.addTodo);
	const updateTodo = useTodosStore((s) => s.updateTodo);

	useEffect(() => {
		setDescription(todo?.description ?? "");
		setDueDate(todo?.due_date ? new Date(todo.due_date) : undefined);
		setIsImportant(todo?.is_important ?? false);
		setIsUrgent(todo?.is_urgent ?? false);
	}, [todo]);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleEsc);
		return () => document.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	useEffect(() => {
		if (todo) {
			setDescription(todo.description);
			setDueDate(todo.due_date ? new Date(todo.due_date) : undefined);
			setIsImportant(todo.is_important);
			setIsUrgent(todo.is_urgent);
		} else {
			// reset form if creating new
			setDescription("");
			setDueDate(undefined);
			setIsImportant(false);
			setIsUrgent(false);
		}
	}, [todo, visible]);

	if (!visible) return null;

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!description.trim()) return;

		const payload = {
			description: description.trim(),
			due_date: dueDate ? dueDate.toISOString() : null,
			is_important: isImportant,
			is_urgent: isUrgent,
			status: todo?.status ?? "to_do",
			is_completed: todo?.is_completed ?? false,
			completed_at: todo?.completed_at ?? null,
			pomodoro_count: todo?.pomodoro_count ?? 0,
		};

		try {
			setLoading(true);
			if (todo) {
				// UPDATE
				await updateTodo({ ...todo, ...payload });
			} else {
				// CREATE
				await addTodo(payload);
			}
			onClose();
			setDescription(""); // reset form
			setDueDate(undefined);
			setIsImportant(false);
			setIsUrgent(false);
		} catch (err) {
			console.error("Failed to add task:", err);
			alert("Failed to create task.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
					onClick={onClose} 
				/>
			</AnimatePresence>

			<AnimatePresence>
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed z-40 inset-0 flex justify-center"
					onClick={e => e.stopPropagation()}
				>
					<Card className="relative max-w-fit max-h-fit mt-[150px]">
						<CardHeader>
							<CardTitle className="text-lg">
								{todo ? "Edit Task" : "Add New Task"}
							</CardTitle>
							<CardDescription>
								{todo ? "Update task details" : "Enter task details"}
							</CardDescription>
							<CardAction>
								<button onClick={onClose} className="absolute top-3 right-3">
									<X />
								</button>
							</CardAction>
						</CardHeader>
						<form onSubmit={handleSubmit}>
							<CardContent>
								<div className="flex flex-col gap-6">
									<div className="grid gap-2">
										<Label htmlFor="description">Description</Label>
										<Input
											id="description"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											type="text"
											placeholder="Task description..."
											required
										/>
									</div>
									<div className="flex justify-between gap-2">
										<DueDatePicker value={dueDate} onChange={setDueDate} />
										<div className="flex flex-col justify-around mr-4">
											<div className="flex gap-2">
												<Checkbox
													id="is_important"
													checked={isImportant}
													onCheckedChange={(v) => setIsImportant(!!v)}
												/>
												<Label htmlFor="is_important">Important</Label>
											</div>
											<div className="flex gap-2">
												<Checkbox
													id="is_urgent"
													checked={isUrgent}
													onCheckedChange={(v) => setIsUrgent(!!v)}
												/>
												<Label htmlFor="is_urgent">Urgent</Label>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex-col mt-6">
								<Button type="submit" className="w-full" disabled={loading}>
									{loading
										? todo
											? "Updating..."
											: "Adding..."
										: todo
										? "Update Task"
										: "Add Task"}
								</Button>
							</CardFooter>
						</form>
					</Card>
				</motion.div>
			</AnimatePresence>
		</>
	);
};
