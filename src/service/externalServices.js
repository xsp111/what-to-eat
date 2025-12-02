import { getFormatDate } from '../utils';

async function getSunriseAndSunsetTime() {
	const date = getFormatDate();
	const { latitude, longitude } = await getIpLoc();
	return fetch(
		`https://api.sunrise-sunset.org/json?tzid=Asia/Shanghai&lat=${latitude}&lng=${longitude}&date=${date}`,
	).then((res) => res.json());
}

async function getWeather() {
	const { latitude, longitude } = await getIpLoc();
	return fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=4&timezone=Asia/Shanghai`,
	).then((res) => res.json());
}

async function getFutureDayForecast(date) {
	const { latitude, longitude } = await getIpLoc();
	return fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,cloud_cover,weathercode,precipitation&start_date=${date}&end_date=${date}&forecast=1&timezone=Asia/Shanghai`,
	).then((res) => res.json());
}

async function getIpLoc(init = false) {
	if (!init) {
		const position = JSON.parse(localStorage.getItem('position'));
		if (position) return position;
	}
	try {
		const res = await fetch(`https://ipwho.is/`);
		const data = await res.json();
		localStorage.setItem(
			'position',
			JSON.stringify({
				latitude: data.latitude,
				longitude: data.longitude,
			}),
		);
	} catch (error) {
		console.error('IP 地理位置解析失败:', error);
		return {
			latitude: 39.9042,
			longitude: 116.4074,
		};
	}
}

export { getSunriseAndSunsetTime, getWeather, getFutureDayForecast, getIpLoc };
