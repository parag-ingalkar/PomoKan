import { Columns3Icon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

import { type Table } from "@tanstack/react-table";
import { type Todo } from "@/utils/type-todo";
import { columnHeaderLabels } from "./TaskTableColumns";

type Props = {
	table: Table<Todo>;
};

export const ColumnVisibility = ({ table }: Props) => {
	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						<Columns3Icon
							className="-ms-1 opacity-60"
							size={16}
							aria-hidden="true"
						/>
						View
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
					{table
						.getAllColumns()
						.filter((column) => column.getCanHide())
						.map((column) => {
							return (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
									onSelect={(event) => event.preventDefault()}
								>
									{columnHeaderLabels[column.id] || column.id}
								</DropdownMenuCheckboxItem>
							);
						})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
