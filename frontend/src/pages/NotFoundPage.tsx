import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div className="flex h-screen w-screen bg-neutral-950 items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-8 text-center px-4">
				{/* Large 404 */}
				<div className="space-y-4">
					<h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-foreground/20">
						404
					</h1>
					<div className="space-y-2">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
							Page Not Found
						</h2>
						<p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-md">
							Oops! The page you're looking for doesn't exist. It might have
							been moved, deleted, or you entered the wrong URL.
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col gap-4 w-full max-w-sm">
					<Button
						onClick={handleGoHome}
						className="flex items-center gap-2 w-full"
						size="lg"
					>
						<Home className="w-4 h-4" />
						Go Home
					</Button>
					<Button
						onClick={handleGoBack}
						variant="outline"
						className="flex items-center gap-2 w-full"
						size="lg"
					>
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</Button>
				</div>

				{/* PomoKan branding */}
				<div className="mt-8">
					<p className="text-sm text-muted-foreground">
						Return to{" "}
						<span className="font-semibold text-foreground">PomoKan</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
