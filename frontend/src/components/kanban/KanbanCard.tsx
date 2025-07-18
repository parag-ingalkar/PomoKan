import { type Todo } from "@/utils/type-todo";
import type { AddCardProps, CardProps } from "@/utils/type-kanban";
import { motion } from "framer-motion";
import { useState, type FormEvent, useEffect } from "react";
import { Plus } from "lucide-react";
import { DropIndicator } from "./KanbanColumn";
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
	return (
		<>
			<DropIndicator beforeId={id} area={status} />
			<motion.div
				layout
				layoutId={id}
				draggable="true"
				onDragStart={(e) => handleDragStart(e, { description, id, status })}
				className="flex flex-col justify-between cursor-grab rounded-sm border border-accent-foreground/20 bg-accent/50 p-2 active:cursor-grabbing"
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

export const AddCard = ({ column, setCards }: AddCardProps) => {
	const [text, setText] = useState("");
	const [adding, setAdding] = useState(false);
	const [pendingSubmit, setPendingSubmit] = useState(false);

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
		  const newTodo = await createTodo(payload);
		  setCards((pv) => [...pv, newTodo]);
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
