// File: src/components/tasks/TaskTableColumns.tsx

import { type ColumnDef } from "@tanstack/react-table";
import { type Todo } from "@/utils/type-todo";
import { RowActions } from "./RowActions";
import { Checkbox } from "../ui/checkbox";

export const TaskTableColumns = (
	onDelete: (id: string) => void,
	onUpdate: (updatedTodo: Todo) => void
): ColumnDef<Todo>[] => [
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
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		size: 28,
		enableSorting: false,
	},
	{
		header: "Description",
		accessorKey: "description",
		cell: ({ row }) => (
			<span className="">{row.getValue("description")}</span>
		),
		size: 350,
	},
	{
		header: "Urgency",
		accessorKey: "is_urgent",
		cell: ({ row }) => {
			const isUrgent = row.getValue("is_urgent");
			return <span>{isUrgent ? "High" : "Low"}</span>;
		},
		size: 80,
	},
	{
		header: "Importance",
		accessorKey: "is_important",
		cell: ({ row }) => {
			const isUrgent = row.getValue("is_important");
			return <span>{isUrgent ? "High" : "Low"}</span>;
		},
		size: 90,
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
	},

	{
		header: "Pomodoros",
		accessorKey: "pomodoro_count",
		size: 80,
	},
	{
		id: "actions",
		header: () => <span className="sr-only">Actions</span>,
		cell: ({ row }) => (
			<RowActions row={row} onDelete={onDelete} onUpdate={onUpdate} />
		),
		size: 60,
		enableHiding: false,
	},
];
