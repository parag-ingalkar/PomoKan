import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Mode } from "./Pomo";

export const TimerModeCollapsed = ({
	currentMode,
	onSelectMode,
}: {
	currentMode: Mode;
	onSelectMode: (mode: Mode) => void;
}) => {
	return (
		<Select
			defaultValue={currentMode}
			onValueChange={(val) => onSelectMode(val as Mode)}
		>
			<SelectTrigger className="w-fit">
				<SelectValue placeholder="Select Mode" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Modes</SelectLabel>
					<SelectItem value="pomodoro">Pomodoro</SelectItem>
					<SelectItem value="short-break">Short Break</SelectItem>
					<SelectItem value="long-break">Long Break</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
