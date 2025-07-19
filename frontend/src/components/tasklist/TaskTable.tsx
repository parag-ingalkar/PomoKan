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
import { useState } from "react";
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
import {
	ChevronUpIcon,
	ChevronDownIcon,
} from "lucide-react";

import { ColumnVisibility } from "./ColumnVisibility";
import { PaginationControls } from "./PaginationControls";

type Props = {
	todos: Todo[];
};

export function TaskTable({ todos }: Props) {

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "status",
			desc: true,
		},
	]);

	const selectedTask = usePomodoroStore((s: PomodoroState) => s.selectedTask);
	const setSelectedTask = usePomodoroStore(
		(s: PomodoroState) => s.setSelectedTask
	);
	const clearSelectedTask = usePomodoroStore(
		(s: PomodoroState) => s.clearSelectedTask
	);

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
		<div className="container h-full flex flex-col justify-between gap-4 p-4">
			<div className="task-list-actionbar flex gap-4 justify-start items-center">
				<TaskFilters table={table} />
				<ColumnVisibility table={table} />
				<div className="flex-1" />
				<TaskActions table={table} />
			</div>

			<div className="relative table-container flex-1 min-h-0 border rounded-md">
				<div className="overflow-y-auto no-scrollbar h-full">
					<Table className=" table-fixed ">
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id} className="hover:bg-transparent">
									{headerGroup.headers.map((header) => (
										<TableHead
											key={header.id}
											style={{ width: `${header.getSize()}px` }}
											className={cn(
												"h-11 bg-accent/50",
												header.column.columnDef.meta?.align === "left"
													? "text-left"
													: header.column.columnDef.meta?.align === "right"
													? "text-right"
													: "text-center"
											)}
										>
											{header.isPlaceholder ? null : header.column.getCanSort() ? (
												<div
													className={cn(
														header.column.getCanSort() &&
															"flex h-full cursor-pointer items-center gap-2 select-none",
														header.column.columnDef.meta?.align === "left"
															? "justify-start"
															: header.column.columnDef.meta?.align === "right"
															? "justify-end"
															: "justify-center"
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
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => {
									const isSelected =
										selectedTask && row.original.id === selectedTask.id;
									return (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
											className={cn(
												"text-center font-light cursor-pointer transition-colors",
												isSelected && "bg-accent"
											)}
											onClick={() => {
												isSelected
													? clearSelectedTask()
													: setSelectedTask(row.original);
											}}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id} className="last:py-0">
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black to-transparent" />
			</div>

			{/* Pagination Controls */}
			<PaginationControls table={table} />
		</div>
	);
}
