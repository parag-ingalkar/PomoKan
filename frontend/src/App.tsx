import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import RequireAuth from "./components/RequireAuth";
import HeroPage from "./pages/HeroPage";
import { DashboardPage } from "./pages/Dash";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import NavBar from "./components/NavBar";
import { Toaster } from 'sonner'

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Toaster position="top-center" richColors />
			<Router>
				<Routes>
					<Route path="/" element={<HeroPage />} />
					<Route element={<RequireAuth />}>
						<Route element={<NavBar />}>
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/settings" element={<SettingsPage />} />
							<Route path="/profile" element={<ProfilePage />} />
						</Route>
					</Route>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
