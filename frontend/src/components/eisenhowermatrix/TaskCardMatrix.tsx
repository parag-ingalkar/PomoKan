import { format } from "date-fns";
import type { Todo } from "@/utils/type-todo";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const TaskCard = ({ task }: { task: Todo }) => {
	const statusColorMap: Record<string, string> = {
		"to do": "bg-yellow-400",
		"in progress": "bg-blue-400",
		completed: "bg-green-400",
	};

	return (
		<div
			draggable
			onDragStart={(e) => {
				e.dataTransfer.setData("id", task.id);
			}}
			className=" cursor-grab rounded-xl overflow-hidden w-60 m-2"
		>
			<Card className="py-2 px-3 gap-1">
				<CardHeader className="p-0">
					<CardTitle className="text-left text-md font-medium">
						{task.description}
					</CardTitle>
					<CardDescription className="text-left text-xs">
						{task.due_date
							? format(new Date(task.due_date), "MMM dd, yyyy")
							: ""}
					</CardDescription>
					<CardAction
						className={`size-3 rounded-full ${
							statusColorMap[task.status] || "bg-gray-300"
						}`}
					/>
				</CardHeader>
				<CardFooter className="flex items-center justify-start px-0 gap-1">
					<div className="ml-auto flex items-center gap-1">
						<img src="/pomodoro.png" className="size-6" />
						<span className="font-bold">{task.pomodoro_count}</span>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default TaskCard;
