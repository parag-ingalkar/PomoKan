import type { AddCardProps, CardProps } from "@/utils/type-matrix";
import type { Todo } from "@/utils/type-todo";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { DropIndicator } from "./Quadrant";
import { Badge } from "../ui/badge";
import { createTodo } from "@/api/todoApi";

export const Card = ({
	description,
	id,
	status,
	is_important,
	is_urgent,
	pomodoro_count,
	handleDragStart,
}: CardProps) => {
	const statusColor = {
		to_do: "bg-yellow-400/90",
		in_progress: "bg-blue-400/90",
		completed: "bg-green-400/90",
	};

	const accentColor = statusColor[status];
	return (
		<>
			<DropIndicator beforeId={id} area={status} />
			<motion.div
				layout
				layoutId={id}
				draggable="true"
				onDragStart={(e) => handleDragStart(e, { description, id, status })}
				className="relative overflow-hidden flex cursor-grab rounded-sm border border-accent-foreground/20 bg-accent/50 active:cursor-grabbing"
			>
				<div className={`w-1  ${accentColor}`}></div>
				<div className="px-3 py-2 flex-1">
					<p className="text-sm text-accent-foreground text-left">
						{description}
					</p>
				</div>
			</motion.div>
		</>
	);
};

const priorityValues = {
	do: { is_important: true, is_urgent: true },
	schedule: { is_important: true, is_urgent: false },
	delegate: { is_important: false, is_urgent: true },
	delete: { is_important: false, is_urgent: false },
};

export const AddCard = ({ area, setCards }: AddCardProps) => {
	const [text, setText] = useState("");
	const [adding, setAdding] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!text.trim().length) return;

		const payload: Omit<Todo, "id"> = {
			description: text.trim(),
			due_date: null,
			status: "to_do",
			is_important: priorityValues[area].is_important,
			is_urgent: priorityValues[area].is_urgent,
			is_completed: false,
			completed_at: null,
			pomodoro_count: 0,
		};

		try {
			const newTodo = await createTodo(payload);

			setCards((pv) => [...pv, newTodo]);

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
					<textarea
						onChange={(e) => setText(e.target.value)}
						autoFocus
						placeholder="Add new task..."
						className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
					/>
					<div className="mt-1.5 flex items-center justify-end gap-1.5">
						<button
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
