import { createStore } from 'zustand';
import {
	getSunriseAndSunsetTime,
	getWeather,
} from '../../service/externalServices.js';

const weatherStore = createStore((_set) => ({
	emo: 10,
	weather: {},
	sun: {},
	setEmo: (emo) => {
		_set({
			emo,
		});
		localStorage.setItem('emo', emo);
	},
	initWeatherAndEmo: async () => {
		getSunriseAndSunsetTime().then((data) => {
			_set({
				sun: {
					sunrise: data.results.sunrise,
					sunset: data.results.sunset,
					day_length: data.results.day_length,
				},
			});
		});
		getWeather().then((data) => {
			_set({
				weather: {
					current_weather: data.current_weather,
					daily: data.daily,
				},
			});
		});
		const emo = localStorage.getItem('emo');
		if (emo) {
			_set({
				emo,
			});
		}
	},
}));
export default weatherStore;
