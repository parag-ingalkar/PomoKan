import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useSettingsStore } from "@/store/settingsStore";
import { Input } from "../ui/input";



export const TimerSettings = () => {
    const { 
		pomodoroDuration,
		setPomodoroDuration,
		shortBreakDuration,
		setShortBreakDuration,
		longBreakDuration,
		setLongBreakDuration
	} = useSettingsStore();
	
    return (
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
								<Input
									type="number"
									
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
								<Input
									type="number"
									
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
								<Input
									type="number"
									
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
    )
}