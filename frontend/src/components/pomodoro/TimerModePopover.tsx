import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePomodoroStore } from "@/store/pomodoroStore";

type Mode = "pomodoro" | "short-break" | "long-break";

export const TimerModeCollapsed = () => {
	const mode = usePomodoroStore((s: { mode: Mode }) => s.mode);
	const setMode = usePomodoroStore((s: { setMode: (mode: Mode) => void }) => s.setMode);
	return (
		<Select
			value={mode}
			onValueChange={(val) => setMode(val as Mode)}
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
