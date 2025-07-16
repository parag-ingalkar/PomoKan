import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Play, Pause, RotateCcw } from "lucide-react";

export const DashboardPage = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
	const [activeTab, setActiveTab] = useState("tab1");
	const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// Sample tabs data
	const tabs = [
		{
			value: "tab1",
			name: "Dashboard",
			content: <div className="p-4">Dashboard Content</div>,
		},
		{
			value: "tab2",
			name: "Analytics",
			content: <div className="p-4">Analytics Content</div>,
		},
		{
			value: "tab3",
			name: "Settings",
			content: <div className="p-4">Settings Content</div>,
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

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const toggleTimer = () => {
		setIsRunning(!isRunning);
	};

	const resetTimer = () => {
		setIsRunning(false);
		setTimeLeft(25 * 60);
	};

	return (
		<div className="h-full bg-gray-50 w-full text-black flex flex-col">
			{/* Navbar placeholder */}

			{/* Main dashboard content */}
			<div className="relative h-full overflow-hidden bg-amber-400/50">
				{/* Main content area - fixed height, no animation */}
				<div className="h-5/6  p-6 overflow-auto">
					<div className="w-full h-full flex flex-col items-center">
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
									className="mt-2 text-sm w-full flex-1 overflow-auto"
								>
									{tab.content}
								</TabsContent>
							))}
						</Tabs>
					</div>
				</div>

				{/* Pomodoro dock */}
				<motion.div
					className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 to-red-400 text-white"
					animate={{
						height: isExpanded ? "100%" : "16.666667%", // 1/6 of height when collapsed
					}}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					{/* Collapsed view */}
					<AnimatePresence>
						{!isExpanded && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="h-full flex items-center justify-between px-6"
							>
								<div className="flex items-center space-x-4">
									<div className="text-2xl font-mono font-bold">
										{formatTime(timeLeft)}
									</div>
									<div className="flex space-x-2">
										<button
											onClick={toggleTimer}
											className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
										>
											{isRunning ? <Pause size={20} /> : <Play size={20} />}
										</button>
										<button
											onClick={resetTimer}
											className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
										>
											<RotateCcw size={20} />
										</button>
									</div>
								</div>
								<button
									onClick={() => setIsExpanded(true)}
									className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
								>
									<ChevronUp size={24} />
								</button>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Expanded view */}
					<AnimatePresence>
						{isExpanded && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2, delay: 0.1 }}
								className="h-full flex flex-col items-center justify-center p-8"
							>
								<button
									onClick={() => setIsExpanded(false)}
									className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
								>
									<ChevronDown size={24} />
								</button>

								<div className="text-center">
									<div className="text-8xl font-mono font-bold mb-8">
										{formatTime(timeLeft)}
									</div>

									<div className="flex space-x-4 mb-8">
										<button
											onClick={toggleTimer}
											className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center space-x-2"
										>
											{isRunning ? <Pause size={24} /> : <Play size={24} />}
											<span className="text-lg">
												{isRunning ? "Pause" : "Start"}
											</span>
										</button>
										<button
											onClick={resetTimer}
											className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center space-x-2"
										>
											<RotateCcw size={24} />
											<span className="text-lg">Reset</span>
										</button>
									</div>

									<div className="text-xl opacity-80">
										{isRunning ? "Focus Time" : "Ready to Focus"}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</div>
	);
};
