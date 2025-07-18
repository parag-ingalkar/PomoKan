// File: src/components/tasks/TaskFilters.tsx

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type Table } from "@tanstack/react-table";
import { type Todo } from "@/utils/type-todo";

import { useId, useMemo } from "react";

type Props = {
	table: Table<Todo>;
};

export function TaskFilters({ table }: Props) {
	const id = useId();

	const statusLabelMap: Record<string, string> = {
		to_do: "To Do",
		in_progress: "In Progress",
		completed: "Completed",
	};

	const uniqueStatusValues = useMemo(() => {
		const statusColumn = table.getColumn("status");

		if (!statusColumn) return [];

		const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
		return values;
	}, [table.getColumn("status")?.getFacetedUniqueValues()]);

	const statusCounts = useMemo(() => {
		const statusColumn = table.getColumn("status");
		if (!statusColumn) return new Map();
		return statusColumn.getFacetedUniqueValues();
	}, [table.getColumn("status")?.getFacetedUniqueValues()]);

	const selectedStatuses = useMemo(() => {
		const filterValue = table.getColumn("status")?.getFilterValue() as string[];
		return filterValue ?? [];
	}, [table.getColumn("status")?.getFilterValue()]);

	const handleStatusChange = (checked: boolean, value: string) => {
		const filterValue = table.getColumn("status")?.getFilterValue() as string[];
		const newFilterValue = filterValue ? [...filterValue] : [];

		if (checked) {
			newFilterValue.push(value);
		} else {
			const index = newFilterValue.indexOf(value);
			if (index > -1) {
				newFilterValue.splice(index, 1);
			}
		}
		table
			.getColumn("status")
			?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
	};

	return (
		<div className="flex items-center gap-3">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline">
						<FilterIcon
							className="-ms-1 opacity-60"
							size={16}
							aria-hidden="true"
						/>
						Status
						{selectedStatuses.length > 0 && (
							<span className="ml-2 rounded border px-1 text-xs">
								{selectedStatuses.length}
							</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto min-w-36 p-3" align="start">
					<div className="space-y-2">
						{uniqueStatusValues.map((value, i) => (
							<div key={value} className="flex items-center gap-2">
								<Checkbox
									id={`${id}-${i}`}
									checked={selectedStatuses.includes(value)}
									onCheckedChange={(checked: boolean) =>
										handleStatusChange(checked, value)
									}
								/>
								<Label
									htmlFor={`${id}-${i}`}
									className="flex grow justify-between text-sm"
								>
									{statusLabelMap[value] ?? value}{" "}
									<span className="text-muted-foreground ml-2 text-xs">
										{statusCounts.get(value)}
									</span>
								</Label>
							</div>
						))}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
