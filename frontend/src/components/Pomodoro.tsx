import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const NAVBAR_HEIGHT = 64; // 4rem
const DOCK_HEIGHT = 80;

export const Pomodoro = () => {
	const alarmRef = useRef(new Audio("/soft-bells-495.mp3"));

	const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro");
	const [settings, setSettings] = useState({
		pomodoro: 1,
		shortBreak: 5,
		longBreak: 15,
	});
	const modes = {
		pomodoro: settings.pomodoro * 60,
		short: settings.shortBreak * 60,
		long: settings.longBreak * 60,
	};
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	const [expanded, setExpanded] = useState(false);
	const [timeLeft, setTimeLeft] = useState(modes.pomodoro);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		setTimeLeft(modes[mode]);
		setIsRunning(false);
	}, [mode, settings]);

	useEffect(() => {
		let timer: ReturnType<typeof setInterval>;
		if (isRunning && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		}

		if (timeLeft === 0 && isRunning) {
			// resetTimer();
			alarmRef.current.play().catch((e) => {
				console.warn("Sound playback failed:", e);
			}); // 🔊 Play sound when time reaches 0
			setIsRunning(false);
		}

		return () => clearInterval(timer);
	}, [isRunning, timeLeft]);

	const resetTimer = () => {
		setTimeLeft(modes[mode]);
		setIsRunning(false);
	};

	return (
		<motion.div
			animate={{
				top: expanded ? NAVBAR_HEIGHT : `calc(100vh - ${DOCK_HEIGHT}px)`, // move upward
			}}
			initial={false}
			transition={{ duration: 0.3 }}
			className="fixed left-0 w-full z-50 bg-zinc-900 border-t border-zinc-700 shadow-lg overflow-hidden"
			style={{
				height: expanded ? `calc(100vh - ${NAVBAR_HEIGHT}px)` : DOCK_HEIGHT,
			}}
		>
			<div className="flex items-center justify-between h-[100px] px-4">
				<span className=" font-semibold text-lg">Pomodoro</span>
				<div className="text-8xl font-thin font-sans mb-6">
					{formatTime(timeLeft)}
				</div>
				<div className="space-x-4">
					<button
						onClick={() => setIsRunning(!isRunning)}
						className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
					>
						{isRunning ? "Pause" : "Start"}
					</button>
					<button
						onClick={resetTimer}
						className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
					>
						Reset
					</button>
				</div>
				<button
					onClick={() => setExpanded(!expanded)}
					className="bg-zinc-800 text-sm px-3 py-1 rounded-md text-white hover:bg-zinc-700 transition"
				>
					{expanded ? "Minimize" : "Expand"}
				</button>
			</div>

			{/* Expanded content */}
			{expanded && (
				<div className="p-6 text-white">
					<h2 className="text-2xl font-bold mb-4">Focus Session</h2>
					<p>Time Remaining: 25:00</p>
				</div>
			)}
		</motion.div>
	);
};
