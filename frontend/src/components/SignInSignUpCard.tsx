import { loginUser, registerUser } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
// import type { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion"

export const SignInSignUpCard = () => {
	const { login } = useAuth();
	const [isSignIn, setIsSignIn] = useState<boolean>(true);

	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const toggleSignIn = () => {
		setEmail("");
		setFirstName("");
		setLastName("");
		setPassword("");
		setError("");
		setIsSignIn(!isSignIn);
	};

	const user = {
		email,
		first_name: firstName,
		last_name: lastName,
		password: password,
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (isSignIn) {
			try {
				// Update context or state if needed
				await login(email, password); // Assuming your useAuth handles token decoding/state
				navigate("/dashboard");
			} catch (err) {
				toast.error("Login failed. Try again.");

			} finally {
				setLoading(false);
			}
		} else {
			try {
				await registerUser(user);
				toast.success("Registration successful! Please log in.");
				setIsSignIn(true); // After successful registration, switch to login
				setEmail("");
				setFirstName("");
				setLastName("");
				setPassword("");
			} catch (err) {
				toast.error("Registration failed. Try again.");
				setError("Registration failed. Try again.");
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<Card className="w-full max-w-sm bg-zinc-800/20">
			<CardHeader>
				<CardTitle>
					{isSignIn ? "Login to your Account" : "Create a new Account"}
				</CardTitle>
				<CardAction>
					<Button variant="link" onClick={toggleSignIn}>
						{isSignIn ? "Register" : "Log In"}
					</Button>
				</CardAction>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="your.email@example.com"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								required
							/>
						</div>
						{isSignIn || (
							<>
								<div className="grid gap-2">
									<Label htmlFor="first-name">First Name</Label>
									<Input
										id="first-name"
										type="first-name"
										placeholder="Enter you First Name"
										onChange={(e) => setFirstName(e.target.value)}
										value={firstName}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="last-name">Last Name</Label>
									<Input
										id="last-name"
										type="last-name"
										placeholder="Enter you Last Name"
										onChange={(e) => setLastName(e.target.value)}
										value={lastName}
										required
									/>
								</div>
							</>
						)}
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
							</div>
							<Input
								id="password"
								type="password"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								required
							/>
						</div>
					</div>

				</CardContent>
				<CardFooter className="mt-6">
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? (isSignIn ? "Logging in..." : "Registering...") : (isSignIn ? "Login" : "Register")}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
};