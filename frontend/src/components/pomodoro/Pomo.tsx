import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { TimerModeCollapsed } from "./TimerModePopover";
import { SelectModeTabs } from "./SelectModeTabs";
import { Vortex } from "../ui/vortex";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { useSettingsStore } from "@/store/settingsStore";
import api from "@/api/axios";
import type { Todo } from "@/utils/type-todo";
import { useTodosStore } from "@/store/todosStore";

type Mode = "pomodoro" | "short-break" | "long-break";

// MODE_TIMES will be created dynamically using settings

export function Pomodoro() {
	const [expanded, setExpanded] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);
	const lastActiveTimeRef = useRef<number>(Date.now());
	const timerStartTimeRef = useRef<number | null>(null);
	const {
		selectedAudio,
		pomodoroDuration,
		shortBreakDuration,
		longBreakDuration,
	} = useSettingsStore();
	const {
		selectedTask,
		clearSelectedTask,
		setLastUpdatedTask,
		isRunning,
		setIsRunning,
		mode,
		setMode,
		incrementPomodoro,
	} = usePomodoroStore();

	// Create MODE_TIMES dynamically using settings
	const MODE_TIMES: Record<Mode, number> = {
		pomodoro: pomodoroDuration * 60, // Convert minutes to seconds
		"short-break": shortBreakDuration * 60,
		"long-break": longBreakDuration * 60,
	};

	const [timeLeft, setTimeLeft] = useState(MODE_TIMES[mode as Mode]);
	const [collapsedHeight, setCollapsedHeight] = useState(0);
	const [pomodoroCount, setPomodoroCount] = useState(0); // Track completed pomodoros
	const updateTodo = useTodosStore((s) => s.updateTodo);

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

	// Update timeLeft when mode changes or durations change
	useEffect(() => {
		setTimeLeft(MODE_TIMES[mode as Mode]);
		setIsRunning(false);
		timerStartTimeRef.current = null;
	}, [
		mode,
		setIsRunning,
		pomodoroDuration,
		shortBreakDuration,
		longBreakDuration,
	]);

	// Sleep detection effect - simplified since we now use absolute time
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && isRunning && timerStartTimeRef.current) {
				// System wake detected - timer will auto-correct on next update
			}
			lastActiveTimeRef.current = Date.now();
		};

		const handleFocus = () => {
			if (isRunning && timerStartTimeRef.current) {
				// Window focus detected - timer will auto-correct on next update
			}
			lastActiveTimeRef.current = Date.now();
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("focus", handleFocus);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("focus", handleFocus);
		};
	}, [isRunning]);

	// Timer countdown effect - using absolute time for accuracy
	useEffect(() => {
		if (!isRunning || !timerStartTimeRef.current) return;

		const interval = setInterval(() => {
			const now = Date.now();
			const elapsed = Math.floor((now - timerStartTimeRef.current!) / 1000);
			const remaining = Math.max(0, MODE_TIMES[mode as Mode] - elapsed);

			setTimeLeft(remaining);

			// Timer completed
			if (remaining === 0) {
				// Play audio when timer hits 0
				if (audioRef.current) {
					audioRef.current.play().catch((error) => {
						// Silently handle audio playback errors
					});
				}

				setIsRunning(false);
				timerStartTimeRef.current = null;

				if (mode === "pomodoro") {
					// Only increment pomodoro count if mode is 'pomodoro'
					if (selectedTask) {
						incrementPomodoro(selectedTask.id).then((updated: Todo | null) => {
							if (updated) {
								setLastUpdatedTask(updated);
								updateTodo(updated);
							}
						});
					}
					// Switch to short-break or long-break after pomodoro
					if ((pomodoroCount + 1) % 4 === 0) {
						setMode("long-break");
					} else {
						setMode("short-break");
					}
					setPomodoroCount((count) => count + 1);
				} else if (mode === "short-break" || mode === "long-break") {
					// After any break, switch back to pomodoro
					setMode("pomodoro");
				}
			}
		}, 100); // Update every 100ms for smoother display, but calculate based on absolute time

		return () => clearInterval(interval);
	}, [isRunning, mode, selectedTask, pomodoroCount, MODE_TIMES]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const toggleTimer = () => {
		if (!isRunning) {
			// Starting the timer - calculate start time based on current timeLeft
			const elapsedSeconds = MODE_TIMES[mode as Mode] - timeLeft;
			timerStartTimeRef.current = Date.now() - elapsedSeconds * 1000;
			lastActiveTimeRef.current = Date.now();
		} else {
		}
		setIsRunning(!isRunning);
	};

	const resetTimer = () => {
		setIsRunning(false);
		setTimeLeft(MODE_TIMES[mode as Mode]);
		timerStartTimeRef.current = null;
	};

	// const onSelectMode = (newMode: Mode) => {
	// 	setMode(newMode);
	// };

	const Timer = () => (
		<div className="relative select-none">
			<div
				className={`text-center opacity-90 font-bold ${
					expanded ? "text-9xl" : "text-5xl"
				}`}
			>
				{formatTime(timeLeft)}
			</div>
		</div>
	);

	const Controls = () => (
		<div className="flex gap-2 items-center">
			<button
				className="p-4 rounded-full gap-2 flex items-center justify-center bg-foreground/10 hover:bg-foreground/20"
				onClick={toggleTimer}
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
				onClick={resetTimer}
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
			{/* Audio element for timer completion sound */}
			<audio
				ref={audioRef}
				src={`/audio/${selectedAudio}.mp3`}
				preload="auto"
			/>

			<div className="h-full w-full ">
				<AnimatePresence mode="wait">
					{expanded ? (
						<motion.div
							key="expanded"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.3 }}
							className="h-full bg-white/10"
						>
							<Vortex
								backgroundColor="black"
								rangeY={800}
								particleCount={300}
								baseHue={100}
								className="flex flex-col items-center justify-center h-full gap-10"
							>
								<SelectModeTabs />
								<Timer />
								{selectedTask && (
									<div className="mt-2 text-center text-base text-accent-foreground/80 flex flex-col items-center">
										🔥 Working on:{" "}
										<span className="font-semibold">
											{selectedTask.description}
										</span>
										<button
											className="ml-2 w-fit px-2 py-1 text-xs rounded bg-accent hover:bg-red-600"
											onClick={clearSelectedTask}
										>
											Clear
										</button>
									</div>
								)}
								<Controls />
							</Vortex>
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
							{selectedTask ? (
								<div className="mt-2 flex-1 text-center text-base text-accent-foreground/80 flex flex-col items-center">
									🔥 Working on:{" "}
									<span className="font-semibold">
										{selectedTask.description}
									</span>
									<button
										className="ml-2 w-fit px-2 py-1 text-xs rounded bg-accent hover:bg-red-600"
										onClick={clearSelectedTask}
									>
										Clear
									</button>
								</div>
							) : (
								<div className="flex-1" />
							)}

							{/* Right: Empty space for symmetry */}
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
