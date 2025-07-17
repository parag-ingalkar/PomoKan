import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronUp,
	ChevronDown,
	Play,
	Pause,
	RotateCcw,
	Settings,
} from "lucide-react";

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover"; // or wherever your shadcn components live

type Mode = "pomodoro" | "short-break" | "long-break";

const MODE_TIMES: Record<Mode, number> = {
	pomodoro: 25 * 60,
	"short-break": 5 * 60,
	"long-break": 15 * 60,
};

const MODE_LABELS: Record<Mode, string> = {
	pomodoro: "Pomodoro",
	"short-break": "Short Break",
	"long-break": "Long Break",
};

const MODE_SHORT_LABELS: Record<Mode, string> = {
	pomodoro: "Pom",
	"short-break": "Short",
	"long-break": "Long",
};

export const Pomodoro = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [mode, setMode] = useState<Mode>("pomodoro");
	const [timeLeft, setTimeLeft] = useState(MODE_TIMES[mode]);
	const [showModePopover, setShowModePopover] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);

	// State for controlling Popover open/close
	const [open, setOpen] = useState(false);

	// Heights for animation (pixels)
	const [expandedHeight, setExpandedHeight] = useState(0);
	const [collapsedHeight, setCollapsedHeight] = useState(0);

	// Set heights based on viewport minus navbar (4rem = 64px)
	useEffect(() => {
		const updateHeights = () => {
			const vh = window.innerHeight;
			const navbarHeight = 64;
			setExpandedHeight(vh - navbarHeight);
			setCollapsedHeight((vh - navbarHeight) / 6);
		};

		updateHeights();
		window.addEventListener("resize", updateHeights);
		return () => window.removeEventListener("resize", updateHeights);
	}, []);

	// Update timeLeft when mode changes
	useEffect(() => {
		setTimeLeft(MODE_TIMES[mode]);
		setIsRunning(false);
	}, [mode]);

	// Timer countdown effect
	useEffect(() => {
		if (!isRunning) return;

		if (timeLeft === 0) {
			setIsRunning(false);
			return;
		}

		const interval = setInterval(() => {
			setTimeLeft((time) => time - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning, timeLeft]);

	// Close popover on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node)
			) {
				setShowModePopover(false);
			}
		}

		if (showModePopover) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showModePopover]);

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
		setTimeLeft(MODE_TIMES[mode]);
	};

	const onSelectMode = (newMode: Mode) => {
		setMode(newMode);
		setShowModePopover(false);
	};

	return (
		<AnimatePresence>
			<motion.div
				layout
				className="absolute border-t-4 border-accent rounded-t-4xl z-20 bottom-0 left-0 right-0 bg-gradient-to-t from-background/100 to-background/40 backdrop-blur-2xl overflow-visible"
				animate={{
					height: isExpanded ? expandedHeight : collapsedHeight,
				}}
				transition={{ duration: 0.5, ease: "easeInOut" }}
			>
				<div className="h-full flex flex-col items-center justify-center p-6 relative">
					{/* Expand/Collapse button */}
					<motion.button
						onClick={() => setIsExpanded(!isExpanded)}
						className="absolute p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-20"
						animate={{
							top: isExpanded ? "1rem" : "50%",
							right: isExpanded ? "1rem" : "1.5rem",
							y: isExpanded ? 0 : "-50%",
						}}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						aria-label={isExpanded ? "Collapse Pomodoro" : "Expand Pomodoro"}
					>
						{isExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
					</motion.button>

					{/* Mode selectors in expanded state */}
					{isExpanded && (
						// <AnimatePresence>
						<motion.div
							className="mb-6 flex gap-4 z-10"
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0, opacity: 0 }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						>
							{(Object.keys(MODE_TIMES) as Mode[]).map((m) => (
								<button
									key={m}
									onClick={() => onSelectMode(m)}
									className={`px-4 py-2 rounded-full border ${
										mode === m
											? "bg-white text-red-600 font-bold"
											: "bg-transparent text-white border-white/50"
									} transition-colors`}
									disabled={isRunning}
									title={`Switch to ${MODE_LABELS[m]}`}
								>
									{MODE_LABELS[m]}
								</button>
							))}
						</motion.div>
						// </AnimatePresence>
					)}

					{/* Timer display */}
					<motion.div
						className="font-mono font-bold text-center bg-white/10"
						animate={{
							fontSize: isExpanded ? "10rem" : "3rem",
							marginBottom: isExpanded ? "2rem" : "0",
						}}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						{formatTime(timeLeft)}
					</motion.div>

					{/* Control buttons with Mode Popover button */}
					<motion.div
						layout
						className="flex items-center justify-center relative bg-green-300/15"
						animate={{
							gap: isExpanded ? "1rem" : "0.5rem",
							position: isExpanded ? "static" : "absolute",
							left: isExpanded ? "auto" : "1.5rem",
							top: isExpanded ? "auto" : "50%",
							y: isExpanded ? 0 : "-50%",
						}}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						{/* Play/Pause */}
						<motion.button
							onClick={toggleTimer}
							className="bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center justify-center"
							animate={{
								padding: isExpanded ? "0.75rem 2rem" : "0.75rem",
								gap: isExpanded ? "0.5rem" : "0",
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							aria-label={isRunning ? "Pause timer" : "Start timer"}
						>
							{isRunning ? (
								<Pause size={isExpanded ? 24 : 20} />
							) : (
								<Play size={isExpanded ? 24 : 20} />
							)}
							{isExpanded && (
								<motion.span
									className="text-lg"
									animate={{
										opacity: isExpanded ? 1 : 0,
										width: isExpanded ? "auto" : 0,
									}}
									transition={{ duration: 0.3, ease: "easeInOut" }}
								>
									{isRunning ? "Pause" : "Start"}
								</motion.span>
							)}
						</motion.button>

						{/* Reset */}
						<motion.button
							onClick={resetTimer}
							className="bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center justify-center"
							animate={{
								padding: isExpanded ? "0.75rem 2rem" : "0.75rem",
								gap: isExpanded ? "0.5rem" : "0",
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							aria-label="Reset timer"
						>
							<RotateCcw size={isExpanded ? 24 : 20} />
							{isExpanded && (
								<motion.span
									className="text-lg"
									animate={{
										opacity: isExpanded ? 1 : 0,
										width: isExpanded ? "auto" : 0,
									}}
									transition={{ duration: 0.3, ease: "easeInOut" }}
								>
									Reset
								</motion.span>
							)}
						</motion.button>

						{/* Mode selector popover button (visible always) */}
						{!isExpanded && (
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<motion.button
										className="bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center justify-center px-3 py-2 text-sm font-semibold select-none"
										disabled={isRunning}
										aria-label="Select timer mode"
										title="Select timer mode"
									>
										{MODE_LABELS[mode]}
									</motion.button>
								</PopoverTrigger>

								<PopoverContent
									className="z-50 w-40 bg-background border border-border rounded-md shadow-lg p-1 max-h-[200px] overflow-auto"
									align="end"
								>
									{(["pomodoro", "short-break", "long-break"] as Mode[]).map(
										(m) => (
											<button
												key={m}
												onClick={() => {
													setMode(m);
													setIsRunning(false);
													setTimeLeft(MODE_TIMES[m]);
													setOpen(false);
												}}
												disabled={isRunning}
												className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground ${
													mode === m
														? "bg-accent text-accent-foreground font-semibold"
														: "text-foreground"
												}`}
											>
												{MODE_LABELS[m]}
											</button>
										)
									)}
								</PopoverContent>
							</Popover>
						)}
					</motion.div>

					{/* Status text */}
					<motion.div
						className="text-xl text-center"
						animate={{
							opacity: isExpanded ? 0.8 : 0,
							marginTop: isExpanded ? "2rem" : "0",
						}}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						{isRunning ? "Focus Time" : "Ready to Focus"}
					</motion.div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
