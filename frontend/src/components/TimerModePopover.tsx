import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const TimerModeCollapsed = () => {
	return (
		<Select defaultValue="pomodoro">
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select Mode" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Modes</SelectLabel>
					<SelectItem value="pomodoro">Pomodoro</SelectItem>
					<SelectItem value="short">Short Break</SelectItem>
					<SelectItem value="long">Long Break</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export const TimerModeExpanded = () => {
	return (
		<Tabs defaultValue="pomodoro">
			<TabsList className="bg-transparent flex gap-2 ">
				<TabsTrigger value="pomodoro" className="p-4 text-base rounded-md ">
					Pomodoro
				</TabsTrigger>
				<TabsTrigger value="short" className="p-4 text-base rounded-md ">
					Short Break
				</TabsTrigger>
				<TabsTrigger value="long" className="p-4 text-base rounded-md ">
					Long Break
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
};
