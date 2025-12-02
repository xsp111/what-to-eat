import { useStore } from 'zustand';
import AppRoutes from './routes';
import './global.css';
import { billStore, foodStore, userStore, weatherStore } from './store';
import { useEffect } from 'react';
import { getIpLoc } from './service/externalServices';

function App() {
	const { initFoodList } = useStore(foodStore);
	const { initBillList } = useStore(billStore);
	const { initWeatherAndEmo } = useStore(weatherStore);
	const { user, initLogState } = useStore(userStore);

	useEffect(() => {
		initWeatherAndEmo();
		getIpLoc(true);
		initLogState();
	}, []);

	useEffect(() => {
		initFoodList(user?.id);
		initBillList(user?.id);
	}, [user?.id]);

	return <AppRoutes />;
}

export default App;
