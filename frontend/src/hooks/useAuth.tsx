import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";
import { loginUser, logout as logoutUser } from "@/api/userApi";
import type { User } from "@/utils/type-user";

interface AuthContextType {
	user: User;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<any>(null);
	const [token, setToken] = useState<string | null>(() =>
		localStorage.getItem("token")
	);

	useEffect(() => {
		if (token) {
			api
				.get("/users/me")
				.then((res) => setUser(res.data))
				.catch(() => setUser(null));
		} else {
			setUser(null);
		}
	}, [token]);

	const login = async (email: string, password: string) => {
		const res = await loginUser(email, password);
		setToken(res.access_token);
		localStorage.setItem("token", res.access_token);
	};

	const logout = () => {
		localStorage.setItem("manualLogout", "true");
		logoutUser();
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};
