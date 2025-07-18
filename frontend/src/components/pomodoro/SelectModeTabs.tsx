import React, { useState, useEffect, useRef } from "react";
import type { Mode } from "./pomodoro/Pomo";

type Props = {
	onSelectMode: (mode: Mode) => void;
	currentMode: Mode;
};

export const SelectModeTabs: React.FC<Props> = ({
	currentMode,
	onSelectMode,
}) => {
	const [activeMode, setActiveMode] = useState<Mode>(currentMode);
	const containerRef = useRef<HTMLDivElement>(null);
	const underlineRef = useRef<HTMLDivElement>(null);

	const modes: { label: string; value: Mode }[] = [
		{ label: "Pomodoro", value: "pomodoro" },
		{ label: "Short Break", value: "short-break" },
		{ label: "Long Break", value: "long-break" },
	];

	useEffect(() => {
		// Update underline position on active mode change
		if (!containerRef.current || !underlineRef.current) return;

		const activeIndex = modes.findIndex((m) => m.value === activeMode);
		const container = containerRef.current;
		const buttons = Array.from(container.querySelectorAll("button"));
		const activeButton = buttons[activeIndex];

		if (activeButton) {
			const buttonRect = activeButton.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();

			underlineRef.current.style.width = `${buttonRect.width}px`;
			underlineRef.current.style.transform = `translateX(${
				buttonRect.left - containerRect.left
			}px)`;
		}
	}, [activeMode, modes]);

	const handleClick = (mode: Mode) => {
		setActiveMode(mode);
		onSelectMode(mode);
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
					className="relative z-10 px-3 py-2  transition-colors duration-300 bg-transparent focus:outline-none"
					type="button"
				>
					{label}
				</button>
			))}

			{/* Underline */}
			<div
				ref={underlineRef}
				className="absolute bottom-0 h-0.5 bg-accent-foreground transition-all duration-300 ease-in-out"
				style={{ width: 0, transform: "translateX(0)" }}
			/>
		</div>
	);
};
