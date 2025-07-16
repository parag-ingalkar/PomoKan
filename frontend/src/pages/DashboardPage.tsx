import { useState, useRef, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskList from "@/components/tasklist/TaskList";
import { Kanban } from "@/components/kanban/Kanban";
import EisenhoverMatrix from "@/components/eisenhowermatrix/EisenhoverMatrix";
import { Pomodoro } from "@/components/Pomo"; // will receive `expanded` and `onToggle`

const tabs = [
	{ name: "Kanban Board", value: "kanban-board", content: <Kanban /> },
	{ name: "Task List", value: "task-list", content: <TaskList /> },
	{
		name: "Eisenhover Matrix",
		value: "eisenhover-matrix",
		content: <EisenhoverMatrix />,
	},
];

const DashboardPage = () => {
	const [activeTab, setActiveTab] = useState("task-list");
	const [expanded, setExpanded] = useState(false);
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

	useLayoutEffect(() => {
		const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
		const activeTabElement = tabRefs.current[activeIndex];
		if (activeTabElement) {
			const { offsetLeft, offsetWidth } = activeTabElement;
			setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
		}
	}, [activeTab]);

	return (
		<div className=" relative flex flex-col items-center w-full">
			{/* Tabs area */}
			<div className="w-full h-5/6 flex flex-col items-center">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="h-full flex flex-col items-center w-6xl"
				>
					<TabsList className="relative flex justify-center border-b max-w-md bg-transparent">
						{tabs.map((tab, index) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								ref={(el) => {
									tabRefs.current[index] = el;
								}}
								className="z-10 border-0 data-[state=active]:shadow-none dark:data-[state=active]:bg-background px-4 py-2"
							>
								{tab.name}
							</TabsTrigger>
						))}

						<motion.div
							className="bg-primary absolute bottom-0 z-20 h-0.5"
							layoutId="underline"
							style={{ left: underlineStyle.left, width: underlineStyle.width }}
							transition={{ type: "spring", stiffness: 400, damping: 40 }}
						/>
					</TabsList>

					{tabs.map((tab) => (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="mt-2 text-sm w-full h-5/6"
						>
							{tab.content}
						</TabsContent>
					))}
				</Tabs>
			</div>

			{/* Pomodoro dock - height toggled by `expanded` */}

			<motion.div
				key="pomodoro"
				initial={{ height: "15vh" }}
				animate={{
					height: expanded ? "95vh" : "15vh",
				}}
				exit={{ height: "15vh" }}
				transition={{ duration: 0.5, ease: "easeInOut" }}
				className="w-full absolute bottom-0 z-50 bg-gray-600" // Absolute positioning makes it anchor to bottom
			>
				<Pomodoro
					expanded={expanded}
					onToggle={() => setExpanded((prev) => !prev)}
				/>
			</motion.div>
		</div>
	);
};

export default DashboardPage;
