import { type Todo } from "@/utils/type-todo";
import type { ColumnProps, DropIndicatorProps } from "@/utils/type-kanban";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { AddCard, Card } from "./KanbanCard";
import api from "@/api/axios";
import { useTodosStore } from "@/store/todosStore";

export const Column = ({
	title,
	headingColor,
	cards,
	column,
}: Omit<ColumnProps, 'setCards'>) => {
	const [active, setActive] = useState(false);
	const updateTodo = useTodosStore((s) => s.updateTodo);

	const handleDragStart = (e: DragEvent, card: Todo) => {
		e.dataTransfer.setData("cardId", card.id);
	};

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
			cardToTransfer = { ...cardToTransfer, status: column };

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
					status: column,
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
				`[data-column="${column}"]`
			) as unknown as HTMLElement[]
		);
	};

	const handleDragLeave = () => {
		clearHighlights();
		setActive(false);
	};

	const filteredCards = cards.filter((c) => c.status === column);

	return (
		<div className="relative">
			<div className="w-56 shrink-0 h-full  flex flex-col ">
				<div className="mb-3 flex items-center gap-3">
					<h3 className={`font-medium ${headingColor}`}>{title}</h3>
					<span className="rounded text-sm text-neutral-400">
						{filteredCards.length}
					</span>
				</div>
				<div
					onDrop={handleDragEnd}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={`overflow-y-auto no-scrollbar w-full transition-colors snap-y pb-40 ${
						active ? "bg-neutral-800/50" : "bg-neutral-800/0"
					}`}
				>
					{filteredCards.map((c) => {
						return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
					})}
					<DropIndicator beforeId={null} area={column} />

					<AddCard column={column} />
				</div>
			</div>
			<div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
		</div>
	);
};

export const DropIndicator = ({ beforeId, area }: DropIndicatorProps) => {
	return (
		<div
			data-before={beforeId || "-1"}
			data-column={area}
			className="my-0.5 h-0.5 w-full bg-emerald-400/50 opacity-0"
		/>
	);
};
