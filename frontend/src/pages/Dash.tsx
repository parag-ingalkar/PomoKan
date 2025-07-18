import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Kanban } from "@/components/kanban/Kanban";
import TaskList from "@/components/tasklist/TaskList";
import EisenhoverMatrix from "@/components/eisenhowermatrix/EisenhoverMatrix";
import { Pomodoro } from "@/components/pomodoro/Pomo";

export const DashboardPage = () => {
	const [activeTab, setActiveTab] = useState("task-list");
	const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// Sample tabs data
	const tabs = [
		{ name: "Kanban Board", value: "kanban-board", content: <Kanban /> },
		{ name: "Task List", value: "task-list", content: <TaskList /> },
		{
			name: "Eisenhover Matrix",
			value: "eisenhover-matrix",
			content: <EisenhoverMatrix />,
		},
	];

	// Update underline position when active tab changes
	useEffect(() => {
		const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
		const activeElement = tabRefs.current[activeIndex];
		if (activeElement) {
			setUnderlineStyle({
				left: activeElement.offsetLeft,
				width: activeElement.offsetWidth,
			});
		}
	}, [activeTab]);

	// Simple Tabs components (you can replace with shadcn/ui)
	type TabsProps = {
		children: React.ReactNode;
		value: string;
		onValueChange?: (value: string) => void;
		className?: string;
	};

	const Tabs = ({ children, value, onValueChange, className }: TabsProps) => (
		<div className={className}>{children}</div>
	);

	const TabsList = ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => <div className={className}>{children}</div>;

	const TabsTrigger = React.forwardRef<
		HTMLButtonElement,
		{
			children: React.ReactNode;
			value: string;
			className?: string;
			[key: string]: any;
		}
	>(function TabsTrigger({ children, value, className, ...props }, ref) {
		return (
			<button
				ref={ref}
				onClick={() => setActiveTab(value)}
				className={`${className} ${
					activeTab === value ? "text-primary" : "text-muted-foreground"
				}`}
				{...props}
			>
				{children}
			</button>
		);
	});

	const TabsContent = ({
		children,
		value,
		className,
	}: {
		children: React.ReactNode;
		value: string;
		className?: string;
	}) =>
		activeTab === value ? <div className={className}>{children}</div> : null;

	return (
		<div className="relative h-full w-full overflow-hidden">
			{/* Main content area - fixed height, no animation */}
			<div className="h-5/6 w-full flex flex-col items-center p-6 pt-0">
				<div className="w-full h-full flex flex-col items-center">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="h-full flex flex-col items-center w-7xl "
					>
						<TabsList className="relative h-1/12 flex justify-center border-b max-w-md bg-transparent">
							{tabs.map((tab, index) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									ref={(el) => {
										tabRefs.current[index] = el;
									}}
									className="z-10 border-0 data-[state=active]:shadow-none dark:data-[state=active]:bg-background px-4 py-1"
								>
									{tab.name}
								</TabsTrigger>
							))}

							<motion.div
								className="bg-primary absolute bottom-0 z-10 h-0.5"
								layoutId="underline"
								style={{
									left: underlineStyle.left,
									width: underlineStyle.width,
								}}
								transition={{ type: "spring", stiffness: 400, damping: 40 }}
							/>
						</TabsList>

						{tabs.map((tab) => (
							<TabsContent
								key={tab.value}
								value={tab.value}
								className="mt-2 text-sm w-full h-11/12 "
							>
								{tab.content}
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>

			{/* Pomodoro dock with smooth sliding animation */}
			<div className="relative h-1/6">
				<Pomodoro />
			</div>
		</div>
	);
};
