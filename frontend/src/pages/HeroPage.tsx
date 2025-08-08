import { SignInSignUpCard } from "@/components/SignInSignUpCard";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Clock, CheckSquare, Kanban, Target, Zap, ArrowRight } from "lucide-react";

const HeroPage = () => {
	const location = useLocation();
	useEffect(() => {
		if (location.state?.message) {
			toast.error(location.state.message);
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);

	const features = [
		{
			icon: Clock,
			title: "Pomodoro Timer",
			description: "Stay focused with timed work sessions"
		},
		{
			icon: Kanban,
			title: "Kanban Board",
			description: "Visualize your workflow"
		},
		{
			icon: CheckSquare,
			title: "Task Management",
			description: "Organize and track your tasks"
		},
		{
			icon: Target,
			title: "Eisenhower Matrix",
			description: "Prioritize what matters most"
		}
	];

	return (
		<div className="min-h-screen bg-black relative overflow-hidden">

			{/* Subtle gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-tl from-white/15 to-black" />

			{/* Main content */}
			<div className="relative z-10 flex min-h-screen">
				{/* Left side - Hero content */}
				<motion.div
					className="flex-3 flex flex-col items-center justify-center px-8 lg:px-16 xl:px-24"
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<div className="max-w-2xl">
						{/* Logo and title */}
						<motion.div
							className="flex items-center gap-4 mb-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<div className="relative">

								<motion.div
									className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-zinc-800 rounded-2xl blur opacity-20"
									animate={{
										opacity: [0.1, 0.3, 0.1],
									}}
									transition={{
										duration: 4,
										repeat: Infinity,
										ease: "easeInOut"
									}}
								/>
							</div>
							<motion.h1
								className="text-5xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.3 }}
							>
								PomoKan
							</motion.h1>
						</motion.div>

						{/* Subtitle */}
						<motion.p
							className="text-xl lg:text-2xl text-zinc-400 mb-12 leading-relaxed max-w-2xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
						>
							Transform your productivity with all-in-one workspace.
							<br />
							<span className="text-white font-semibold">
								{" "}Focus. Organize. Achieve.
							</span>
						</motion.p>

						{/* Features grid */}
						<motion.div
							className="grid grid-cols-2 gap-6 mb-16"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.5 }}
						>
							{features.map((feature, index) => (
								<motion.div
									key={feature.title}
									className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all duration-300 backdrop-blur-sm"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
									whileHover={{
										scale: 1.02,
										transition: { duration: 0.2 }
									}}
								>
									<div className="flex items-start gap-4">
										<div className="p-3 rounded-xl bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-all duration-300 border border-zinc-700/30">
											<feature.icon className="w-6 h-6 text-zinc-300" />
										</div>
										<div>
											<h3 className="font-semibold text-white text-lg mb-1">{feature.title}</h3>
											<p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>


					</div>
				</motion.div>

				{/* Right side - Sign in/up card */}
				<motion.div
					className="flex-1 flex items-center justify-center px-8 lg:px-16 xl:px-24"
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
				>
					<motion.div
						className="w-full max-w-md"
						whileHover={{ scale: 1.02 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<SignInSignUpCard />
					</motion.div>
				</motion.div>
			</div>

			{/* Subtle floating elements */}
			<div className="absolute inset-0 pointer-events-none">
				{Array.from({ length: 30 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 bg-neutral-500 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [0, -80, 0],
							opacity: [0, 1, 0],
						}}
						transition={{
							duration: 4 + Math.random() * 3,
							repeat: Infinity,
							delay: Math.random() * 3,
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default HeroPage;
