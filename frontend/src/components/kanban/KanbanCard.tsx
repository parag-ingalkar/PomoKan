import { type Todo } from "@/utils/type-todo";
import type { AddCardProps, CardProps } from "@/utils/type-kanban";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { DropIndicator } from "./KanbanColumn";
import { Badge } from "../ui/badge";
import { useTodosStore } from "@/store/todosStore";
import { usePomodoroStore } from "@/store/pomodoroStore";
import type { PomodoroState } from "@/store/pomodoroStore";

export const Card = ({
	description,
	id,
	status,
	is_important,
	is_urgent,
	pomodoro_count,
	handleDragStart,
}: CardProps) => {
	const selectedTask = usePomodoroStore((s: PomodoroState) => s.selectedTask);
	const setSelectedTask = usePomodoroStore(
		(s: PomodoroState) => s.setSelectedTask
	);
	const clearSelectedTask = usePomodoroStore(
		(s: PomodoroState) => s.clearSelectedTask
	);
	const isSelected = selectedTask && selectedTask.id === id;
	return (
		<>
			<DropIndicator beforeId={id} area={status} />
			<motion.div
				layout
				layoutId={id}
				draggable="true"
				onDragStart={(e) => handleDragStart(e, { description, id, status })}
				onClick={() => {
					isSelected
						? clearSelectedTask()
						: setSelectedTask({
								description,
								id,
								status,
								is_important,
								is_urgent,
								pomodoro_count,
								due_date: null,
								is_completed: false,
								completed_at: null,
						  });
				}}
				className={`flex flex-col justify-between cursor-pointer rounded-sm border border-accent-foreground/20 bg-accent/50 p-2 active:cursor-grabbing transition-colors ${
					isSelected ? "  bg-primary/20" : ""
				}`}
			>
				<p className="text-sm text-accent-foreground text-left pb-4">
					{description}
				</p>
				<div className="flex justify-start">
					{is_important && (
						<Badge
							variant={"outline"}
							className="border-red-500/50 text-[10px]"
						>
							Important
						</Badge>
					)}
					{is_urgent && (
						<Badge
							variant={"outline"}
							className="border-blue-500/50 text-[10px]"
						>
							Urgent
						</Badge>
					)}
					<div className="flex items-center gap-1 ml-auto">
						<img src="/pomodoro.png" className="size-4" />
						<span className="font-bold">{pomodoro_count}</span>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export const AddCard = ({ column }: Omit<AddCardProps, "setCards">) => {
	const [text, setText] = useState("");
	const [adding, setAdding] = useState(false);
	const [pendingSubmit, setPendingSubmit] = useState(false);
	const addTodo = useTodosStore((s) => s.addTodo);

	// Synchronous submit handler
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!text.trim().length) return;

		const payload: Omit<Todo, "id"> = {
			description: text.trim(),
			due_date: null,
			status: column,
			is_important: true,
			is_urgent: false,
			is_completed: false,
			completed_at: null,
			pomodoro_count: 0,
		};

		try {
			console.log("payload", payload);
			await addTodo(payload);
			setText(""); // Clear input after successful creation
			setAdding(false);
		} catch (err) {
			console.error("Failed to create task:", err);
			alert("Error creating task. Please try again.");
		}
	};

	return (
		<>
			{adding ? (
				<motion.form layout onSubmit={handleSubmit}>
					<input
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						autoFocus
						placeholder="Add new task..."
						className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
					/>
					<div className="mt-1.5 flex items-center justify-end gap-1.5">
						<button
							type="button"
							onClick={() => setAdding(false)}
							className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
						>
							Close
						</button>
						<button
							type="submit"
							className="flex items-center gap-1.5 rounded bg-neutral-50 px-2 py-1 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
						>
							<span>Add</span>
							<Plus />
						</button>
					</div>
				</motion.form>
			) : (
				<motion.button
					layout
					onClick={() => setAdding(true)}
					className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
				>
					<span>Add card</span>
					<Plus />
				</motion.button>
			)}
		</>
	);
};
