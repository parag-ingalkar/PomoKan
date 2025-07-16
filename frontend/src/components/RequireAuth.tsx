import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RequireAuth = () => {
	const { token } = useAuth();
	const location = useLocation();
	if (!token) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}
	// return <>{children}</>;
	return <Outlet />;
};

export default RequireAuth;
