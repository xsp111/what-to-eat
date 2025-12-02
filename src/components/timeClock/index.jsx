import { useState, useEffect } from 'react';

export default function TimeClock() {
	const [currentDateTime, setCurrentDateTime] = useState({
		year: '',
		month: '',
		day: '',
		hours: '',
		minutes: '',
		seconds: '',
	});

	function formatDateTime() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		return {
			year,
			month,
			day,
			hours,
			minutes,
			seconds,
		};
	}

	useEffect(() => {
		setCurrentDateTime(formatDateTime());
		const timer = setInterval(() => {
			setCurrentDateTime(formatDateTime());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className='p-4 flex flex-col gap-4 text-center text-pink-300'>
			<div className='text-5xl font-bold'>{`${currentDateTime.year}.${currentDateTime.month}.${currentDateTime.day}`}</div>
			<div className='text-4xl font-bold'>{`${currentDateTime.hours}:${currentDateTime.minutes}:${currentDateTime.seconds}`}</div>
		</div>
	);
}
