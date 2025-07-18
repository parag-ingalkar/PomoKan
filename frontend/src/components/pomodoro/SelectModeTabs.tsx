import React, { useState, useEffect, useRef } from "react";
import { usePomodoroStore } from "@/store/pomodoroStore";

type Mode = "pomodoro" | "short-break" | "long-break";

export const SelectModeTabs: React.FC = () => {
	const mode = usePomodoroStore((s: { mode: Mode }) => s.mode);
	const setMode = usePomodoroStore((s: { setMode: (mode: Mode) => void }) => s.setMode);
	const containerRef = useRef<HTMLDivElement>(null);
	const underlineRef = useRef<HTMLDivElement>(null);

	const modes: { label: string; value: Mode }[] = [
		{ label: "Pomodoro", value: "pomodoro" },
		{ label: "Short Break", value: "short-break" },
		{ label: "Long Break", value: "long-break" },
	];

	useEffect(() => {
		if (!containerRef.current || !underlineRef.current) return;
		const activeIndex = modes.findIndex((m) => m.value === mode);
		const container = containerRef.current;
		const buttons = Array.from(container.querySelectorAll("button"));
		const activeButton = buttons[activeIndex];
		if (activeButton) {
			const buttonRect = activeButton.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			underlineRef.current.style.width = `${buttonRect.width}px`;
			underlineRef.current.style.transform = `translateX(${buttonRect.left - containerRect.left}px)`;
		}
	}, [mode, modes]);

	const handleClick = (newMode: Mode) => {
		setMode(newMode);
	};

	return (
		<div
			ref={containerRef}
			className="relative flex gap-8 select-none"
			style={{ userSelect: "none" }}
		>
			{modes.map(({ label, value }) => (
				<button
					key={value}
					onClick={() => handleClick(value)}
					className={`relative z-10 px-3 py-2 transition-colors duration-300 bg-transparent focus:outline-none${mode === value ? " font-bold" : ""}`}
					type="button"
				>
					{label}
				</button>
			))}
			<div
				ref={underlineRef}
				className="absolute bottom-0 h-0.5 bg-accent-foreground transition-all duration-300 ease-in-out"
				style={{ width: 0, transform: "translateX(0)" }}
			/>
		</div>
	);
};
