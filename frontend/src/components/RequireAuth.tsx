import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RequireAuth = () => {
	const { token } = useAuth();
	const location = useLocation();
	if (!token) {
		if (localStorage.getItem("manualLogout")) {
			localStorage.removeItem("manualLogout");
			return <Navigate to="/" replace />;
		}
		return (
			<Navigate
				to="/"
				state={{ from: location, message: "Your session has expired. Please log in again." }}
				replace
			/>
		);
	}
	// return <>{children}</>;
	return <Outlet />;
};

export default RequireAuth;
