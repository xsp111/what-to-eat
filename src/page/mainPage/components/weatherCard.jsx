import { weatherIconMap } from '../../../constant/weatherIcon';
import defaultIcon from '../../../assets/default.svg';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { getFutureDayForecast } from '../../../service/externalServices';

function WeatherItem(props) {
	const { weather, onClick } = props;
	return (
		<div
			className='min-w-[30%] flex flex-col items-center border border-sky-300 rounded-md p-2 bg-gray-50 text-sm'
			onClick={onClick}
		>
			<img
				src={weatherIconMap[weather.weatherIcon] || defaultIcon}
				width={42}
			/>
			<span className='text-gray-700 font-bold'>{`${weather.max}~${weather.min}°C`}</span>
			<span className='text-yellow-500'>{`${weather.date.slice(
				5,
			)}`}</span>
		</div>
	);
}

export function WeatherDetailModal(props) {
	const { date, onCancel } = props;
	const [weather, setWeather] = useState();

	useEffect(() => {
		getFutureDayForecast(date).then((res) => {
			setWeather(res?.hourly);
		});
	}, [date]);

	return (
		<Modal
			visible
			loading={!weather}
			onCancel={onCancel}
			closable={false}
			centered
			footer={null}
		>
			<div className='mb-2 text-lg font-bold'>当日天气</div>
			<div className='flex flex-col w-full gap-2 items-center h-[15vh]'>
				<div className='w-full flex justify-around font-bold text-gray-600'>
					<span className='flex-1 text-center'>时间</span>
					<span className='flex-1 text-center'>总降水量🌧</span>
					<span className='flex-1 text-center'>温度🌡</span>
					<span className='flex-1 text-center'>云覆盖率☁</span>
				</div>
				<div className='w-full flex flex-col gap-1 overflow-auto'>
					{weather?.time?.map((time, idx) => {
						return (
							<div className='w-full flex justify-around'>
								<span className='text-gray-700 flex-1 text-center'>
									{time.slice(-5)}
								</span>
								<span className='flex-1 flex items-center justify-center gap-2'>
									<span>{weather?.precipitation[idx]}mm</span>
									<img
										src={
											weatherIconMap[
												weather?.weathercode[idx]
											] || defaultIcon
										}
										width={22}
									/>
								</span>
								<span className='flex-1 text-center'>
									{weather?.temperature_2m[idx]}℃
								</span>
								<span className='flex-1 text-center'>
									{weather?.cloud_cover[idx]}%
								</span>
							</div>
						);
					}) || '暂无数据'}
				</div>
			</div>
		</Modal>
	);
}

export default function WeatherCard(props) {
	const { weather, setViewDateDetail } = props;
	const temperatureData = [1, 2, 3].map((item) => {
		return {
			date: weather?.time?.[item] || 'N/A',
			weatherIcon: weather?.weathercode?.[item],
			max: weather?.temperature_2m_max?.[item] || 'N/A',
			min: weather?.temperature_2m_min?.[item] || 'N/A',
		};
	});

	return (
		<div className='flex justify-between gap-2 w-full'>
			{temperatureData?.map((item) => (
				<WeatherItem
					weather={item}
					onClick={() => {
						setViewDateDetail(item.date);
					}}
				/>
			)) || 'N/A'}
		</div>
	);
}
