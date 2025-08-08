import { Volume2, Play } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useSettingsStore, type AudioOption } from "@/store/settingsStore";
import { useState, useRef } from 'react';

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


export const AudioSettings = () => {
    const {
        selectedAudio,
        setSelectedAudio
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
				// Silently handle audio playback errors
			});

			audioElement.onended = () => {
				setPlayingAudio(null);
			};
		}
	};
    return (
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
    )
}