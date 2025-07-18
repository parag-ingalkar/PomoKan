import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSettingsStore, type AudioOption } from "@/store/settingsStore";
import { Volume2, Play } from "lucide-react";
import { useRef, useState } from "react";

const audioOptions: {
	value: AudioOption;
	label: string;
	description: string;
	file: string;
}[] = [
	{
		value: "soft-bells",
		label: "Soft Bells",
		description: "Gentle, calming bell sounds",
		file: "/audio/soft-bells.mp3",
	},
	{
		value: "good-morning",
		label: "Good Morning",
		description: "Peaceful chime notification",
		file: "/audio/good-morning.mp3",
	},
	{
		value: "sky-high-pitch",
		label: "Sky High Pitch",
		description: "Clear digital notification sound",
		file: "/audio/sky-high-pitch.mp3",
	},
];

export default function SettingsPage() {
	const { 
		selectedAudio, 
		setSelectedAudio,
		pomodoroDuration,
		setPomodoroDuration,
		shortBreakDuration,
		setShortBreakDuration,
		longBreakDuration,
		setLongBreakDuration
	} = useSettingsStore();
	const [playingAudio, setPlayingAudio] = useState<AudioOption | null>(null);
	const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

	const handleAudioSelect = (audio: AudioOption) => {
		setSelectedAudio(audio);
	};

	const handlePlayAudio = (audio: AudioOption) => {
		const audioElement = audioRefs.current[audio];
		if (audioElement) {
			setPlayingAudio(audio);
			audioElement.currentTime = 0;
			audioElement.play().catch((error) => {
				console.log("Audio playback failed:", error);
			});

			audioElement.onended = () => {
				setPlayingAudio(null);
			};
		}
	};

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Settings</h1>
				<p className="text-muted-foreground">
					Customize your PomoKan experience
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Volume2 className="h-5 w-5" />
						Timer Audio Settings
					</CardTitle>
					<CardDescription>
						Choose the audio that plays when your timer completes
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{audioOptions.map((option) => (
						<div
							key={option.value}
							className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
								selectedAudio === option.value
									? "border-primary bg-primary/5"
									: "border-border hover:bg-accent/50"
							}`}
						>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="font-medium">{option.label}</h3>
									{selectedAudio === option.value && (
										<span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
											Selected
										</span>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{option.description}
								</p>
							</div>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePlayAudio(option.value)}
									disabled={playingAudio === option.value}
								>
									<Play className="h-4 w-4" />
									{playingAudio === option.value ? "Playing..." : "Preview"}
								</Button>

								<Button
									variant={
										selectedAudio === option.value ? "default" : "outline"
									}
									size="sm"
									onClick={() => handleAudioSelect(option.value)}
								>
									{selectedAudio === option.value ? "Selected" : "Select"}
								</Button>
							</div>

							<audio
								ref={(el) => {
									audioRefs.current[option.value] = el;
								}}
								src={option.file}
								preload="auto"
							/>
						</div>
					))}
				</CardContent>
			</Card>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<svg
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Timer Duration Settings
					</CardTitle>
					<CardDescription>
						Customize the duration for each timer mode
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">Pomodoro Duration</h3>
								<p className="text-sm text-muted-foreground">
									Time for focused work sessions
								</p>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="number"
									min="1"
									max="120"
									value={pomodoroDuration}
									onChange={(e) => setPomodoroDuration(parseInt(e.target.value) || 25)}
									className="w-20 px-3 py-2 border border-border rounded-md bg-background text-foreground"
								/>
								<span className="text-sm text-muted-foreground">minutes</span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">Short Break Duration</h3>
								<p className="text-sm text-muted-foreground">
									Quick breaks between pomodoros
								</p>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="number"
									min="1"
									max="30"
									value={shortBreakDuration}
									onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 5)}
									className="w-20 px-3 py-2 border border-border rounded-md bg-background text-foreground"
								/>
								<span className="text-sm text-muted-foreground">minutes</span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">Long Break Duration</h3>
								<p className="text-sm text-muted-foreground">
									Extended breaks after 4 pomodoros
								</p>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="number"
									min="1"
									max="60"
									value={longBreakDuration}
									onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 15)}
									className="w-20 px-3 py-2 border border-border rounded-md bg-background text-foreground"
								/>
								<span className="text-sm text-muted-foreground">minutes</span>
							</div>
						</div>
					</div>
					
					<div className="pt-4 border-t">
						<Button
							variant="outline"
							onClick={() => {
								setPomodoroDuration(25);
								setShortBreakDuration(5);
								setLongBreakDuration(15);
							}}
						>
							Reset to Defaults
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
