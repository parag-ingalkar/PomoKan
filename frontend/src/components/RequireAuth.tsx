import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RequireAuth = () => {
	const { token, isLoading } = useAuth();
	
	// Don't redirect while loading
	if (isLoading) {
		return null; // or a loading spinner
	}
	
	if (!token) {
		// Redirect to home without any message
		return <Navigate to="/" replace />;
	}
	
	return <Outlet />;
};

export default RequireAuth;
