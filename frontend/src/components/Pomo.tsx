import React from "react";
import { ChevronUp, ChevronDown, Pause, Play, TimerReset } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"; // adjust imports as needed
import { cn } from "@/lib/utils";

interface PomodoroProps {
	expanded: boolean;
	onToggle: () => void;
}

export const Pomodoro = ({ expanded, onToggle }: PomodoroProps) => {
	const [isRunning, setIsRunning] = React.useState(false);
	const [timeLeft, setTimeLeft] = React.useState(1500); // Example: 25 mins

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	return (
		<div className=" w-full h-full flex flex-col px-4 bg-orange-100 dark:bg-orange-500/10">
			{/* Toggle Chevron at the top */}
			<div className="  z-10">
				<button
					onClick={onToggle}
					className="text-sm p-2 rounded-full hover:bg-zinc-700 transition"
				>
					{expanded ? <ChevronDown /> : <ChevronUp />}
				</button>
			</div>

			{/* Timer + Controls centered */}
			<div className="flex flex-1 flex-col items-center justify-center gap-4">
				<div
					className={cn(
						"select-none cursor-default",
						expanded ? "text-9xl" : "text-5xl"
					)}
				>
					{formatTime(timeLeft)}
				</div>

				<div className="flex text-foreground/60 space-x-4">
					<button
						onClick={() => setIsRunning(!isRunning)}
						className="rounded-full p-2"
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={isRunning ? "pause" : "play"}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.25 }}
							>
								{isRunning ? <Pause size={30} /> : <Play size={30} />}
							</motion.div>
						</AnimatePresence>
					</button>
					<button
						onClick={() => setTimeLeft(1500)}
						className="rounded-full p-2"
					>
						<TimerReset size={30} />
					</button>
					{/* TimerModePopover or other controls */}
				</div>
			</div>
		</div>
	);
};
