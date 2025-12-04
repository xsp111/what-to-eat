import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'; // ES 2015

dayjs.extend(isoWeek);

function getBillByDate(billList, date) {
	return billList.filter((item) => item.date === date);
}

function getFormatDate(date) {
	if (!date) {
		date = new Date();
	}
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function getCurrentPosition() {
	if ('geolocation' in navigator) {
		return new Promise((resolve) => {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;
					console.log(`纬度: ${latitude}, 经度: ${longitude}`);
					resolve({ latitude, longitude });
				},
				(error) => {
					console.error(
						'定位失败:',
						error.code === 1
							? '用户拒绝授权'
							: error.code === 2
							? '位置不可用'
							: '请求超时',
					);
				},
			);
		});
	}
}

function getID() {
	return Date.now() + Math.floor(Math.random() * 1000);
}

function getCurrentTimePercentOfDaylight(
	sunrise,
	sunset,
	dayLength,
	currentTime = new Date(),
) {
	// 1. 工具函数：将 "时:分:秒 AM/PM" 格式转换为当天的总秒数
	const timeToTotalSeconds = (timeStr) => {
		const [timePart, period] = timeStr.split(' ');
		let [hours, minutes, seconds] = timePart.split(':').map(Number);
		if (period === 'PM' && hours !== 12) hours += 12;
		if (period === 'AM' && hours === 12) hours = 0;
		if (isNaN(seconds)) seconds = 0;
		return hours * 3600 + minutes * 60 + seconds;
	};

	// 2. 工具函数：将 "时:分:秒" 格式的时长转换为总秒数
	const durationToTotalSeconds = (durationStr) => {
		const [hours, minutes, seconds] = durationStr.split(':').map(Number);
		if (isNaN(hours) || isNaN(minutes))
			throw new Error('白天时长格式错误，需为 "时:分:秒"');
		return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
	};

	try {
		// 3. 转换所有时间为总秒数
		const sunriseSec = timeToTotalSeconds(sunrise); // 日出的当天总秒数
		const sunsetSec = timeToTotalSeconds(sunset); // 日落的当天总秒数
		const dayLengthSec = durationToTotalSeconds(dayLength); // 总白天时长（秒）
		// 当前时间的当天总秒数（从 00:00:00 开始算）
		const currentSec =
			currentTime.getHours() * 3600 +
			currentTime.getMinutes() * 60 +
			currentTime.getSeconds();

		// 4. 边界判断：当前时间是否在白天范围内
		if (currentSec < sunriseSec || currentSec > sunsetSec) {
			return { percent: 0, status: 2 };
		}

		// 5. 计算占比：（当前时间 - 日出时间）/ 总白天时长 * 100
		const elapsedSec = currentSec - sunriseSec;
		const percent = (elapsedSec / dayLengthSec) * 100;

		return {
			percent: Number(percent.toFixed(2)), // 保留 2 位小数
			status: 1,
		};
	} catch {
		return { percent: null, status: 0 };
	}
}

async function ApiFetch(url, data, options = {}) {
	const defaultHeaders = {
		'Content-Type': 'application/json',
		...options.headers,
	};
	const fetchOptions = {
		method: 'POST',
		credentials: 'include',
		headers: defaultHeaders,
		body: JSON.stringify(data),
	};
	try {
		const res = await fetch(url, fetchOptions);
		if (options.stream) return res.body.getReader();
		return res.json();
	} catch (error) {
		console.error('请求失败', error);
		throw error;
	}
}

function getCookieByKey(key) {
	return document.cookie.replace(
		new RegExp(
			'(?:(?:^|.*;)\\s*' +
				key.replace(/[-.+*]/g, '\\$&') +
				'\\s*\\=\\s*([^;]*).*$)|^.*$',
		),
		'$1',
	);
}

function removeCookieByKey(key) {
	if (!key) {
		return false;
	}
	document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	return true;
}

function getCurrentWeekDays(date) {
	return Array.from({ length: 7 }, (_, i) =>
		dayjs(date).isoWeekday(i).format('YYYY-MM-DD'),
	);
}

export {
	ApiFetch,
	getBillByDate,
	getCurrentTimePercentOfDaylight,
	getID,
	getCurrentPosition,
	getFormatDate,
	getCookieByKey,
	removeCookieByKey,
	getCurrentWeekDays,
};
