// src/components/tasks/TaskTable.tsx
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	flexRender,
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
	type VisibilityState,
	getFacetedUniqueValues,
} from "@tanstack/react-table";
import { useMemo, useState, useId } from "react";
import { TaskTableColumns } from "./TaskTableColumns";

// Extend ColumnMeta to include 'align'
declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends unknown, TValue> {
		align?: "left" | "center" | "right";
	}
}
import { TaskFilters } from "./TaskFilters";
import { TaskActions } from "./TaskActions";
import { type Todo } from "@/utils/type-todo";
import { cn } from "@/lib/utils";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

type Props = {
	todos: Todo[];
	setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export function TaskTable({ todos, setTodos }: Props) {
	const id = useId();
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "status",
			desc: true,
		},
	]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const handleDeleteTodo = (id: string) => {
		setTodos((prev) => prev.filter((todo) => todo.id !== id));
	};

	const handleUpdateTodo = (updatedTodo: Todo) => {
		setTodos((prev) =>
			prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
		);
	};

	const columns = useMemo(
		() => TaskTableColumns(handleDeleteTodo, handleUpdateTodo),
		[]
	);

	const table = useReactTable({
		data: todos,
		columns,
		state: {
			sorting,
			pagination,
			columnFilters,
			columnVisibility,
		},
		
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		enableSortingRemoval: false,
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div className="h-full w-full flex flex-col justify-between gap-4 p-4">
			<div className="task-list-actionbar flex justify-between">
				<TaskFilters table={table} />
				<TaskActions table={table} setTodos={setTodos} />
			</div>
			<div className="border rounded-md overflow-hidden">
				<Table className="table-fixed">
					<TableHeader className="">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}
										style={
											header.getSize()
												? { width: header.getSize(), minWidth: header.getSize(), maxWidth: header.getSize() }
												: undefined
										}
									>
										{header.isPlaceholder ? null : header.column.getCanSort() ? (
											<div
												className={cn(
													header.column.columnDef.meta?.align === "left"
													? "justify-start"
													: "justify-center",
												header.column.getCanSort() &&
													"flex h-full cursor-pointer items-center gap-2 select-none"
												)}
												onClick={header.column.getToggleSortingHandler()}
												onKeyDown={(e) => {
													// Enhanced keyboard handling for sorting
													if (
														header.column.getCanSort() &&
														(e.key === "Enter" || e.key === " ")
													) {
														e.preventDefault();
														header.column.getToggleSortingHandler()?.(e);
													}
												}}
												tabIndex={header.column.getCanSort() ? 0 : undefined}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{{
													asc: (
														<ChevronUpIcon
															className="shrink-0 opacity-60"
															size={16}
															aria-hidden="true"
														/>
													),
													desc: (
														<ChevronDownIcon
															className="shrink-0 opacity-60"
															size={16}
															aria-hidden="true"
														/>
													),
												}[header.column.getIsSorted() as string] ?? null}
											</div>
										) : (
											flexRender(
												header.column.columnDef.header,
												header.getContext()
											)
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} className="text-center font-light">
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}
										style={
											cell.column.getSize()
												? { width: cell.column.getSize(), minWidth: cell.column.getSize(), maxWidth: cell.column.getSize() }
												: undefined
										}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="flex items-center justify-between mt-auto px-2">
				<button
					className="px-3 py-1 rounded border disabled:opacity-50"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</button>
				<span className="text-sm">
					Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
				</span>
				<button
					className="px-3 py-1 rounded border disabled:opacity-50"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</button>
			</div>
		</div>
	);
}
