import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { TimerModeCollapsed, TimerModeExpanded } from "./TimerModePopover";

export function Pomodoro() {
	const [expanded, setExpanded] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [mode, setMode] = useState("pomodoro");
	const [collapsedHeight, setCollapsedHeight] = useState(0);
	useEffect(() => {
		const updateHeights = () => {
			const vh = window.innerHeight;
			const navbarHeight = 64;
			setCollapsedHeight((vh - navbarHeight) / 6);
		};

		updateHeights();
		window.addEventListener("resize", updateHeights);
		return () => window.removeEventListener("resize", updateHeights);
	}, []);

	const Timer = () => (
		<div
			className={`text-center font-bold ${expanded ? "text-9xl" : "text-5xl"}`}
		>
			25:00
		</div>
	);

	const Controls = () => (
		<div className="flex gap-2 items-center">
			<button
				className="p-4 rounded-full gap-2 flex items-center justify-center bg-foreground/10 hover:bg-foreground/20"
				onClick={() => setIsRunning(!isRunning)}
			>
				{isRunning ? (
					<Pause size={expanded ? 24 : 20} />
				) : (
					<Play size={expanded ? 24 : 20} />
				)}
				{expanded && (
					<span className="text-lg">{isRunning ? "Pause" : "Start"}</span>
				)}
			</button>
			<button
				className="p-4 rounded-full gap-2 flex items-center justify-center bg-foreground/10 hover:bg-foreground/20"
				onClick={() => {
					/* reset logic */
				}}
			>
				<RotateCcw size={expanded ? 24 : 20} />
				{expanded && <span className="text-lg">Reset</span>}
			</button>
		</div>
	);

	return (
		<motion.div
			initial={false}
			animate={{
				height: expanded ? "100vh" : collapsedHeight,
				borderTopLeftRadius: expanded ? "0px" : "1rem",
				borderTopRightRadius: expanded ? "0px" : "1rem",
			}}
			transition={{ duration: 0.4, ease: "easeInOut" }}
			className="fixed bottom-0 left-0 w-full bg-background border-t border-border shadow-lg overflow-hidden z-50"
		>
			<div className="h-full w-full ">
				<AnimatePresence mode="wait">
					{expanded ? (
						<motion.div
							key="expanded"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col items-center justify-center gap-6 h-full px-4 py-8"
						>
							<TimerModeExpanded />
							<Timer />
							<Controls />
							{/* Extra expanded-only content can go here */}
						</motion.div>
					) : (
						<motion.div
							key="collapsed"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.3 }}
							className="flex flex-row items-center h-full px-4 w-full "
						>
							{/* Left: Controls */}
							<div className="flex-1 flex justify-start items-center gap-2">
								<Controls />
								<TimerModeCollapsed />
							</div>

							{/* Center: Timer */}
							<div className="flex-1 flex justify-center">
								<Timer />
							</div>

							{/* Right: Empty space for symmetry */}
							<div className="flex-1" />
						</motion.div>
					)}
				</AnimatePresence>
				<motion.button
					onClick={() => setExpanded(!expanded)}
					className="absolute p-2 bg-foreground/10 hover:bg-foreground/20 rounded-full transition-colors z-20"
					animate={{
						top: expanded ? "1rem" : "50%",
						right: expanded ? "1rem" : "1.5rem",
						y: expanded ? 0 : "-50%",
					}}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					aria-label={expanded ? "Collapse Pomodoro" : "Expand Pomodoro"}
				>
					{expanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
				</motion.button>
			</div>
		</motion.div>
	);
}
