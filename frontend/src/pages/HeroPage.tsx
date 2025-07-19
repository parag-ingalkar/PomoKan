import { SignInSignUpCard } from "@/components/SignInSignUpCard"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from 'sonner'

const HeroPage = () => {
	const location = useLocation();
	const message = location.state?.message;

	useEffect(() => {
		if (message) {
		  toast.error(message);
		}
	  }, [message]);

	return (
		<div className="hero flex h-screen w-screen bg-neutral-950">
			
			<div className="flex flex-col gap-7 lg:w-2/3 items-center justify-center">
				<h2 className="text-5xl font-semibold text-foreground md:text-5xl lg:text-8xl">
					<span>PomoKan</span>
				</h2>
				<p className="text-base text-muted-foreground md:text-lg lg:text-xl">
					Manage your tasks with Kanban board, Eisenhover Matrix and Pomodoro Clocks          
				</p>
			</div>
			<div className=" h-full w-2/5 flex items-center justify-center">
				<SignInSignUpCard />
			</div>
		</div>
	)
}

export default HeroPage