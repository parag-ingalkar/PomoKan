import { type Dispatch, type SetStateAction } from "react";
import type { Status, Todo } from "./type-todo";

export type ColumnType = "todo" | "doing" | "done";

export type CardType = {
	title: string;
	id: string;
	column: ColumnType;
};

export type ColumnProps = {
	title: string;
	headingColor: string;
	cards: Todo[];
	column: Status;
	setCards?: Dispatch<SetStateAction<Todo[]>>;
};

export type CardProps = Todo & {
	handleDragStart: Function;
};

export type DropIndicatorProps = {
	beforeId: string | null;
	area: string;
};

export type AddCardProps = {
	column: Status;
	setCards?: Dispatch<SetStateAction<Todo[]>>;
};

