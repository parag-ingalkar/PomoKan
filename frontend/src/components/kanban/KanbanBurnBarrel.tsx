import {
	type Dispatch,
	type SetStateAction,
	useState,
	type DragEvent,
} from "react";
import { Trash, Flame } from "lucide-react";
import type { Todo } from "@/utils/type-todo";
import { deleteTodo } from "@/api/todoApi";

export const BurnBarrel = ({
	setCards,
}: {
	setCards: Dispatch<SetStateAction<Todo[]>>;
}) => {
	const [active, setActive] = useState(false);

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		setActive(true);
	};

	const handleDragLeave = () => {
		setActive(false);
	};

	const handleDragEnd = async (e: DragEvent) => {
		const cardId = e.dataTransfer.getData("cardId");

		try {
			await deleteTodo(cardId);

			setCards((pv) => pv.filter((c) => c.id !== cardId));

			setActive(false);
		} catch (err) {
			console.error("Failed to create task:", err);
			alert("Error creating task. Please try again.");
		}
	};

	return (
		<div
			onDrop={handleDragEnd}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			className={`mt-10 grid h-40 w-40 shrink-0 place-content-center rounded border text-3xl ${
				active
					? "border-red-800 bg-red-800/20 text-red-500"
					: "border-neutral-500 bg-neutral-500/20 text-neutral-500"
			}`}
		>
			{active ? <Flame className="animate-bounce" /> : <Trash />}
		</div>
	);
};
