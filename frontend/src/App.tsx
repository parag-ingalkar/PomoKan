import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import RequireAuth from "./components/RequireAuth";
import HeroPage from "./pages/HeroPage";
// import { DashboardPage } from "./pages/DashboardPage";
import { DashboardPage } from "./pages/Dash";
import NavBar from "./components/NavBar";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Router>
				<Routes>
					<Route path="/" element={<HeroPage />} />
					<Route element={<RequireAuth />}>
						<Route element={<NavBar />}>
							<Route path="/dashboard" element={<DashboardPage />} />
						</Route>
					</Route>
					<Route path="*" element={<Navigate to="/hero" />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
