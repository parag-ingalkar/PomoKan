
import { AudioSettings } from "@/components/settings/AudioSettings";
import { TimerSettings } from "@/components/settings/TimerSettings";


export default function SettingsPage() {
	


	return (
		<div className="container mx-auto p-6 max-w-2xl h-full flex flex-col overflow-hidden">
			<div className="mb-8 flex-none">
				<h1 className="text-3xl font-bold mb-2">Settings</h1>
				<p className="text-muted-foreground">
					Customize your PomoKan experience
				</p>
			</div>

			<div className="setting-cards flex-1 overflow-y-auto no-scrollbar">
			<AudioSettings />
			<TimerSettings />
			<div className="mt-30"/>
			
			</div>
		</div>
	);
}
