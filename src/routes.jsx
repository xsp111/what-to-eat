import { Route, Routes } from 'react-router';
import MainPage from './page/mainPage';
import SettingsPage from './page/settingsPage';
import RootLayout from './components/rootLayout';
import BillPage from './page/billPage';

export default function AppRoutes() {
	return (
		<Routes>
			<Route element={<RootLayout />}>
				<Route path='/' element={<MainPage />} />
				<Route path='bill' element={<BillPage />} />
				<Route path='settings' element={<SettingsPage />} />
			</Route>
		</Routes>
	);
}
