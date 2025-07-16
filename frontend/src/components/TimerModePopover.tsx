import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";

type Mode = "pomodoro" | "short_break" | "long_break";

export function TimerModePopover({
	onSelectMode,
}: {
	onSelectMode: (mode: Mode) => void;
}) {
	const [open, setOpen] = useState(false);

	const handleSelect = (mode: Mode) => {
		onSelectMode(mode);
		setOpen(false); // Close popover
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					className="p-2 rounded-full hover:bg-muted transition-colors"
					onClick={() => setOpen(!open)}
				>
					<Settings2 size={30} />
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-48 p-2 space-y-2">
				{(["pomodoro", "short_break", "long_break"] as Mode[]).map((label) => (
					<Button
						key={label}
						variant="ghost"
						className="w-full justify-start capitalize"
						onClick={() => handleSelect(label)}
					>
						{label.replace("_", " ")}
					</Button>
				))}
			</PopoverContent>
		</Popover>
	);
}
