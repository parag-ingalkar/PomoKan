import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

type DueDatePickerProps = {
	value?: Date;
	onChange: (date: Date | undefined) => void;
};

export const DueDatePicker = ({ value, onChange }: DueDatePickerProps) => {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="flex flex-col gap-3">
			<Label htmlFor="date" className="px-1">
				Due Date
			</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						id="date"
						className="w-48 justify-between font-normal"
					>
						{value ? value.toLocaleDateString() : "Select date"}
						<ChevronDownIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto overflow-hidden p-0" align="start">
					<Calendar
						mode="single"
						selected={value}
						captionLayout="dropdown"
						onSelect={(date) => {
							onChange(date);
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};
