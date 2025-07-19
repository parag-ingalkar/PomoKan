// File: src/components/tasks/TaskTableColumns.tsx

import { type ColumnDef, type FilterFn } from "@tanstack/react-table";
import { type Todo } from "@/utils/type-todo";
import { RowActions } from "./RowActions";
import { Checkbox } from "../ui/checkbox";

export const statusFilterFn: FilterFn<Todo> = (
	row,
	columnId,
	filterValue: string[]
) => {
	if (!filterValue?.length) return true;
	const status = row.getValue(columnId) as string;
	return filterValue.includes(status);
};

export const TaskTableColumns = (): ColumnDef<Todo>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all rows"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onClick={(e) => e.stopPropagation()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		size: 28,
		enableSorting: false,
		enableHiding: false,
		meta: { align: "center" },
	},
	{
		header: "Description",
		accessorKey: "description",
		cell: ({ row }) => (
			<div className="text-start whitespace-normal break-words">
				{row.getValue("description")}
			</div>
		),
		size: 350,
		enableHiding: false,
		meta: { align: "left" },
	},

	{
		header: "Importance",
		accessorKey: "is_important",
		cell: ({ row }) => {
			const isUrgent = row.getValue("is_important");
			return <span>{isUrgent ? "High" : "Low"}</span>;
		},
		size: 90,
		meta: { align: "center" },
	},
	{
		header: "Urgency",
		accessorKey: "is_urgent",
		cell: ({ row }) => {
			const isUrgent = row.getValue("is_urgent");
			return <span>{isUrgent ? "High" : "Low"}</span>;
		},
		size: 80,
		meta: { align: "center" },
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => {
			const status: string = row.getValue("status");

			const statusMap: Record<string, { color: string; label: string }> = {
				to_do: {
					color: "bg-yellow-400",
					label: "To Do",
				},
				in_progress: {
					color: "bg-blue-500",
					label: "In Progress",
				},
				completed: {
					color: "bg-green-500",
					label: "Completed",
				},
			};

			const { color, label } = statusMap[status] || {
				color: "bg-gray-400",
				label: status,
			};

			return (
				<div className="flex gap-2 items-center justify-center p-1">
					<span className={`w-2 h-2 rounded-full ${color}`} />
					{label}
				</div>
			);
		},
		size: 110,
		filterFn: statusFilterFn,
		meta: { align: "center" },
	},

	{
		header: "Pomodoros",
		accessorKey: "pomodoro_count",
		size: 60,
		meta: { align: "center" },
	},
	{
		id: "actions",
		header: () => <span className="sr-only">Actions</span>,
		cell: ({ row }) => <RowActions row={row} />,
		size: 60,
		enableHiding: false,
		meta: { align: "center" },
	},
];

// Export a mapping from column id/accessorKey to header label for use in ColumnVisibility
export const columnHeaderLabels: Record<string, string> = {
	select: "Select",
	description: "Description",
	is_important: "Importance",
	is_urgent: "Urgency",
	status: "Status",
	pomodoro_count: "Pomodoros",
	actions: "Actions",
};
