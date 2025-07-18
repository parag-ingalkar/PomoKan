import { type Todo } from "@/utils/type-todo";
import type { QuadrantProps, DropIndicatorProps } from "@/utils/type-matrix";
import { useState, type DragEvent } from "react";
import api from "@/api/axios";
import { Card, AddCard } from "./MatrixCard";
import { Separator } from "../ui/separator";
import { useTodosStore } from "@/store/todosStore";

export const Quadrant = ({
	title,
	cards,
	quadrant,
}: Omit<QuadrantProps, 'setCards'>) => {
	const [active, setActive] = useState(false);
	const updateTodo = useTodosStore((s) => s.updateTodo);

	const handleDragStart = (e: DragEvent, card: Todo) => {
		e.dataTransfer.setData("cardId", card.id);
	};

	const quadrantValues = {
		do: {
			bg: "bg-emerald-900/20",
			text: "text-emerald-500",
			is_important: true,
			is_urgent: true,
		},
		schedule: {
			bg: "bg-violet-900/20",
			text: "text-violet-500",
			is_important: true,
			is_urgent: false,
		},
		delegate: {
			bg: "bg-cyan-900/20",
			text: "text-cyan-500",
			is_important: false,
			is_urgent: true,
		},
		delete: {
			bg: "bg-orange-900/20",
			text: "text-orange-500",
			is_important: false,
			is_urgent: false,
		},
	};

	const { bg, text, is_important, is_urgent } = quadrantValues[quadrant];

	const handleDragEnd = (e: DragEvent) => {
		const cardId = e.dataTransfer.getData("cardId");

		setActive(false);
		clearHighlights();

		const indicators = getIndicators();
		const { element } = getNearestIndicator(e, indicators);

		const before = element.dataset.before || "-1";

		if (before !== cardId) {
			let copy = [...cards];

			let cardToTransfer = copy.find((c) => c.id === cardId);
			if (!cardToTransfer) return;
			cardToTransfer = { ...cardToTransfer, is_important, is_urgent };

			copy = copy.filter((c) => c.id !== cardId);

			const moveToBack = before === "-1";

			if (cardToTransfer) {
				if (moveToBack) {
					copy.push(cardToTransfer);
				} else {
					const insertAtIndex = copy.findIndex((el) => el.id === before);
					if (insertAtIndex === undefined) return;

					copy.splice(insertAtIndex, 0, cardToTransfer);
				}
			}

			// Update the todo in the global store
			updateTodo(cardToTransfer);
			api
				.patch(`/todos/${cardId}`, {
					is_important,
					is_urgent,
				})
				.catch((err) => {
					console.error("Failed to update card status:", err);
					// Optionally: revert UI change or show error
				});
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		highlightIndicator(e);

		setActive(true);
	};

	const clearHighlights = (els?: HTMLElement[]) => {
		const indicators = els || getIndicators();

		indicators.forEach((i) => {
			i.style.opacity = "0";
		});
	};

	const highlightIndicator = (e: DragEvent) => {
		const indicators = getIndicators();

		clearHighlights(indicators);

		const el = getNearestIndicator(e, indicators);

		el.element.style.opacity = "1";
	};

	const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
		const DISTANCE_OFFSET = 50;

		const el = indicators.reduce(
			(closest, child) => {
				const box = child.getBoundingClientRect();

				const offset = e.clientY - (box.top + DISTANCE_OFFSET);

				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			},
			{
				offset: Number.NEGATIVE_INFINITY,
				element: indicators[indicators.length - 1],
			}
		);

		return el;
	};

	const getIndicators = () => {
		return Array.from(
			document.querySelectorAll(
				`[data-quadrant="${quadrant}"]`
			) as unknown as HTMLElement[]
		);
	};

	const handleDragLeave = () => {
		clearHighlights();
		setActive(false);
	};

	const filteredCards = cards.filter(
		(c) => c.is_important === is_important && c.is_urgent === is_urgent
	);

	return (
		<div className={`${bg} w-full flex flex-col h-full px-4`}>
			<div className="my-2 p-3 flex-none h-6 flex items-center gap-3">
				<h3 className={`font-medium ${text}`}>{title}</h3>
				<span className="rounded text-sm text-neutral-400">
					{filteredCards.length}
				</span>
			</div>
			<Separator />
			<div
				onDrop={handleDragEnd}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={`h-full p-2 transition-colors overflow-y-auto no-scrollbar ${
					active ? "bg-neutral-800/50" : "bg-neutral-800/0"
				}`}
			>
				{filteredCards.map((c) => {
					return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
				})}
				<DropIndicator beforeId={null} area={quadrant} />
				<AddCard area={quadrant} />
			</div>
		</div>
	);
};

export const DropIndicator = ({ beforeId, area }: DropIndicatorProps) => {
	return (
		<div
			data-before={beforeId || "-1"}
			data-quadrant={area}
			className="my-0.5 h-0.5 w-full bg-emerald-400/50 opacity-0"
		/>
	);
};
