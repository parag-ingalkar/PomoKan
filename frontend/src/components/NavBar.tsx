import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import UserMenu from "./navbar-components/user-menu";

const NavBar = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col h-screen">
			<nav className="flex justify-between gap-2 px-6 py-4">
				<div
					className="text-2xl font-bold select-none cursor-pointer"
					onClick={() => navigate("/dashboard")}
				>
					PomoKan
				</div>
				<UserMenu user={user} />
			</nav>
			<main className="flex flex-1 overflow-auto">
				<Outlet />
			</main>
		</div>
	);
};

export default NavBar;
