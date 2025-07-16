// src/pages/PomodoroPage.tsx
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import type { Todo } from "../utils/type-todo";

const PomodoroPage = () => {
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
	const [timeLeft, setTimeLeft] = useState(modes.pomodoro);
	const [isRunning, setIsRunning] = useState(false);
	const [selectedTaskId, setSelectedTaskId] = useState<string>("");
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// useEffect(() => {
	//   fetch("/api/user/settings")
	//     .then(res => res.json())
	//     .then(setSettings);
	// }, []);

	const fetchTodos = async () => {
		setLoading(true);
		try {
			const res = await api.get("/todos/");
			const in_progress_todos = res.data.filter(
				(t: Todo) => t.status == "in progress"
			);
			console.log(in_progress_todos);
			setTodos(in_progress_todos);
		} catch {
			setError("Failed to fetch todos");
		} finally {
			setLoading(false);
		}
	};

	const increment_pomodoro = async (selectedTaskId: string) => {
		try {
			const res = await api.put(`/todos/${selectedTaskId}/increment-pomodoro`);
			console.log(res.data);
		} catch {
			console.log("Failed to increment pomodoro count");
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

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
			console.log(selectedTaskId);
			increment_pomodoro(selectedTaskId);
			// resetTimer();
			alarmRef.current.play().catch((e) => {
				console.warn("Sound playback failed:", e);
			}); // 🔊 Play sound when time reaches 0
			setIsRunning(false);
		}

		return () => clearInterval(timer);
	}, [isRunning, timeLeft]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	const resetTimer = () => {
		setTimeLeft(modes[mode]);
		setIsRunning(false);
	};

	const currentTask = todos.find((t) => t.id === selectedTaskId);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
			<h1 className="text-4xl font-bold mb-4">Pomodoro Timer</h1>

			{/* Task Selector */}
			<div className="mb-4 w-full max-w-md">
				<label className="block text-left mb-2 text-gray-700 font-medium">
					Focus on Task:
				</label>
				<select
					value={selectedTaskId ?? ""}
					onChange={(e) => setSelectedTaskId(String(e.target.value))}
					className="w-full px-4 py-2 border rounded"
				>
					<option value="">Select a task</option>
					{todos.map((task) => (
						<option key={task.id} value={task.id}>
							{task.description}
						</option>
					))}
				</select>
			</div>

			{/* Mode Selector */}
			<div className="flex space-x-2 mb-6">
				<button
					onClick={() => setMode("pomodoro")}
					className={`px-4 py-2 rounded ${
						mode === "pomodoro" ? "bg-red-500 text-white" : "bg-gray-200"
					}`}
				>
					Pomodoro
				</button>
				<button
					onClick={() => setMode("short")}
					className={`px-4 py-2 rounded ${
						mode === "short" ? "bg-blue-500 text-white" : "bg-gray-200"
					}`}
				>
					Short Break
				</button>
				<button
					onClick={() => setMode("long")}
					className={`px-4 py-2 rounded ${
						mode === "long" ? "bg-green-500 text-white" : "bg-gray-200"
					}`}
				>
					Long Break
				</button>
			</div>

			{/* Timer */}
			<div className="text-7xl font-mono mb-6">{formatTime(timeLeft)}</div>

			{/* Controls */}
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

			{/* Current Task Display */}
			{currentTask && (
				<div className="mt-8 text-lg font-medium text-gray-800">
					🔥 Working on:{" "}
					<span className="font-semibold">{currentTask.description}</span>
				</div>
			)}
		</div>
	);
};

export default PomodoroPage;
