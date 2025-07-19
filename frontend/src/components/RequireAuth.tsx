import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RequireAuth = () => {
	const { token } = useAuth();
	const location = useLocation();
	if (!token) {
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
