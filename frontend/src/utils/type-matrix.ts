import { type Dispatch, type SetStateAction } from "react";
import type { Todo } from "./type-todo";

export type QuadrantType = "do" | "schedule" | "delegate" | "delete";

export type QuadrantProps = {
    title: string;
    color: string;
    cards: Todo[];
    quadrant: QuadrantType;
    setCards: Dispatch<SetStateAction<Todo[]>>;
};

export type CardProps = Todo & {
	handleDragStart: Function;
};

export type AddCardProps = {
	area: QuadrantType;
	setCards: Dispatch<SetStateAction<Todo[]>>;
};

export type DropIndicatorProps = {
	beforeId: string | null;
	area: string;
};