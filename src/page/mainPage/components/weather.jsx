import CardContainer from '../../../components/cardContainer';
import sunriseIcon from '../../../assets/sunrise.svg';
import sunsetIcon from '../../../assets/sunset.svg';
import nightIcon from '../../../assets/night.svg';
import { Popover, Progress, Slider } from 'antd';
import { getCurrentTimePercentOfDaylight, getFormatDate } from '../../../utils';
import WeatherCard, { WeatherDetailModal } from './weatherCard';
import { useStore } from 'zustand';
import { weatherStore } from '../../../store';
import { weatherIconMap } from '../../../constant/weatherIcon';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { useState } from 'react';

const emoIconMap = {
	1: '💔',
	2: '💔',
	3: '💔',
	4: '😭',
	5: '😭',
	6: '😭',
	7: '🥺',
	8: '🥺',
	9: '🥺',
	10: '😟',
	11: '😟',
	12: '😟',
	13: '☺️',
	14: '☺️',
	15: '☺️',
	16: '😊',
	17: '😊',
	18: '😊',
	19: '😁',
	20: '😁',
};
export default function Weather() {
	const { sun, weather, emo, setEmo } = useStore(weatherStore);
	const [viewDateDetail, setViewDateDetail] = useState(null);
	const { percent: dayProgressPercent, status } =
		getCurrentTimePercentOfDaylight(
			sun.sunrise,
			sun.sunset,
			sun.day_length,
		);

	return (
		<>
			<CardContainer className='flex-col '>
				<div className='w-full flex items-center justify-between'>
					<div
						className='flex items-center gap-1'
						onClick={() => {
							const date = getFormatDate();
							setViewDateDetail(date);
						}}
					>
						<span className='text-yellow-500'>今日: </span>
						<span className='text-gray-700 font-bold text-lg'>
							{`${
								weather.current_weather?.temperature || 'N/A'
							}°C`}
						</span>
						<img
							src={
								weatherIconMap[
									weather.current_weather?.weathercode
								]
							}
							alt=''
							width={28}
						/>
					</div>
					<div>
						<span className='text-pink-300 font-bold text-lg '>
							心情：
						</span>

						<Popover
							placement='leftTop'
							content={
								<div className='flex gap-2'>
									<FrownOutlined />
									<Slider
										onChange={setEmo}
										value={emo}
										min={1}
										max={20}
										defaultValue={10}
										tooltip={{
											open: false,
										}}
										className='w-[50vw]'
									/>
									<SmileOutlined />
								</div>
							}
						>
							<span className='text-xl'>{emoIconMap[emo]}</span>
						</Popover>
					</div>
				</div>
				{status === 1 ? (
					<div className='w-full flex justify-between items-center gap-4 text-sm font-bold'>
						<div className='flex flex-col items-center text-orange-300'>
							<img src={sunriseIcon} width={32} />
							<span>{sun.sunrise.toLowerCase() || 'N/A'}</span>
						</div>
						<div className='flex-1'>
							<Progress
								percent={dayProgressPercent}
								showInfo={false}
								strokeColor={{
									'0%': '#FFA500',
									'100%': '#FF4500',
								}}
								trailColor='#e0e0e0'
							/>
						</div>
						<div className='flex flex-col items-center text-red-400'>
							<img src={sunsetIcon} width={32} />
							<span className=''>
								{sun.sunset.toLowerCase() || 'N/A'}
							</span>
						</div>
					</div>
				) : (
					<div className='w-full flex justify-center items-center gap-4'>
						<img src={nightIcon} width={32} />
						<div className='flex flex-col justify-center'>
							<span className='text-xl font-bold text-sky-300'>
								最好要在23:00前要睡觉哦
							</span>
							<></>
						</div>
					</div>
				)}
				<WeatherCard
					weather={weather.daily}
					setViewDateDetail={setViewDateDetail}
				/>
			</CardContainer>
			{viewDateDetail !== null && (
				<WeatherDetailModal
					date={viewDateDetail}
					onCancel={() => {
						setViewDateDetail(null);
					}}
				/>
			)}
		</>
	);
}
