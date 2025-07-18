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
import { useTodosStore } from "@/store/todosStore";
import { usePomodoroStore } from "@/store/pomodoroStore";
import type { PomodoroState } from "@/store/pomodoroStore";
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
};

export function TaskTable({ todos }: Props) {
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

	const selectedTask = usePomodoroStore((s: PomodoroState) => s.selectedTask);
	const setSelectedTask = usePomodoroStore((s: PomodoroState) => s.setSelectedTask);
	const clearSelectedTask = usePomodoroStore((s: PomodoroState) => s.clearSelectedTask);

	const columns = TaskTableColumns();

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
		<div className="container h-full flex flex-col justify-between gap-4 p-4 bg-white/10">
			<div className="task-list-actionbar bg-green-500/10 flex justify-between items-center">
				<TaskFilters table={table} />
				<div className="flex items-center gap-4">
					{/* Page size selector */}
					<label className="text-sm font-medium flex items-center gap-2">
						Show
						<select
							className="border rounded px-2 py-1 bg-background"
							value={pagination.pageSize}
							onChange={e => setPagination(p => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))}
						>
							{[5, 10, 20, 50].map(size => (
								<option key={size} value={size}>{size}</option>
							))}
						</select>
						tasks per page
					</label>
					<TaskActions table={table} />
				</div>
			</div>
			<div className=" table-container flex-1 min-h-0 overflow-y-auto border rounded-md bg-blue-500/10">
				<Table className="bg-red-100/10 table-fixed ">
					<TableHeader className="bg-red-500/15 sticky top-0 z-10">
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
					{/* Scrollable Table Body */}
						<TableBody>
							{table.getRowModel().rows.map((row) => {
								const isSelected = selectedTask && row.original.id === selectedTask.id;
								return (
									<TableRow
										key={row.id}
										className={cn("text-center font-light cursor-pointer transition-colors", isSelected && "bg-accent")}
										onClick={() => {isSelected ?clearSelectedTask() : setSelectedTask(row.original)}}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
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
								);
							})}
						</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="pagination-container flex items-center bg-yellow-500/10 justify-between mt-auto px-2">
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
