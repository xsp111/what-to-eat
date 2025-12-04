import CardContainer from '../../../components/cardContainer';
import {
	ComposedChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Area,
	Bar,
	Line,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { getCurrentWeekDays } from '../../../utils';
import { useStore } from 'zustand';
import { billStore } from '../../../store';
import { billTypeEnum, billTypeMap } from '../../../constant/billType';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { useState } from 'react';

const COLORS = ['#00C49F', 'pink', '#FFBB28', '#0088FE', '#FF8042'];

function useChartData(dates) {
	const { billList: rawBillList } = useStore(billStore);
	const billList = rawBillList.filter((bill) => dates.includes(bill.date));
	const totalCost = billList.reduce(
		(pre, bill) => pre + Number(bill.value),
		0,
	);
	const dateCost = dates.map((date) => {
		const curDateBill = billList.filter((bill) => bill.date === date);
		const curDateTotalCost = curDateBill.reduce(
			(pre, bill) => pre + Number(bill.value),
			0,
		);
		const curDateFoodCost = curDateBill.reduce((pre, bill) => {
			const cost =
				bill.type === billTypeEnum['吃喝'] ? Number(bill.value) : 0;
			return pre + cost;
		}, 0);
		const percent = (curDateTotalCost / totalCost) * (totalCost / 2);
		return {
			date: dayjs(date).format('MM-DD'),
			total: curDateTotalCost,
			food: curDateFoodCost,
			percent,
		};
	});
	const typeCost = Array.from(
		{ length: Object.keys(billTypeEnum).length },
		(_, i) => i,
	).map((type) => {
		const billListByType = billList.filter((bill) => bill.type === type);
		const cost = billListByType.reduce(
			(pre, bill) => pre + Number(bill.value),
			0,
		);
		return {
			type: billTypeMap[type].label,
			cost: parseInt(cost),
		};
	});
	return {
		totalCost,
		dateCost,
		typeCost,
	};
}

function ChartTooltip(props) {
	const { active, payload, label, totalCost } = props;
	const isVisible = active && payload && payload.length;
	return (
		<div
			className='flex flex-col p-2 shadow bg-white z-10'
			style={{ visibility: isVisible ? 'visible' : 'hidden' }}
		>
			{isVisible && <span>{label}</span>}
			{payload.map((item) => {
				const value =
					item.name !== 'percent'
						? `${item.value.toFixed(2)}￥`
						: `${((item.value / (totalCost / 2)) * 100).toFixed(
								2,
						  )}%`;
				return (
					<span
						style={{
							color: `${item.color}`,
						}}
					>
						{item.name}：{value}
					</span>
				);
			})}
		</div>
	);
}

export default function Chart() {
	const [date, setDate] = useState(dayjs());
	const { totalCost, dateCost, typeCost } = useChartData(
		getCurrentWeekDays(date),
	);

	return (
		<CardContainer className='mt-3 flex-col'>
			<div className='w-full flex flex-col gap-2'>
				<div className='w-full flex justify-between items-center text-gray-600 font-bold text-sm '>
					<span>总花费: {totalCost.toFixed(2)} ￥</span>
					<DatePicker
						picker='week'
						value={dayjs(date)}
						onChange={(date) => {
							setDate(date);
						}}
					/>
				</div>
				<ComposedChart
					style={{
						width: '100%',
						maxWidth: '700px',
						maxHeight: '220px',
						aspectRatio: 1.618,
					}}
					responsive
					data={dateCost}
				>
					<CartesianGrid stroke='#f5f5f5' />
					<XAxis dataKey='date' />
					<YAxis width='auto' />
					<Legend />
					<Tooltip
						isAnimationActive={true}
						content={<ChartTooltip totalCost={totalCost} />}
					/>
					<Bar
						dataKey='total'
						barSize={20}
						fill='#61C0FF'
						isAnimationActive={true}
					/>
					<Line
						type='monotone'
						dataKey='food'
						stroke='#FE9900'
						isAnimationActive={true}
					/>
					<Area
						type='monotone'
						dataKey='percent'
						fill='#FEA5A7'
						stroke='#FEA5A7'
						isAnimationActive={true}
					/>
				</ComposedChart>
			</div>
			<div className='w-full flex flex-col gap-2'>
				<span className='self-end text-gray-600 font-bold text-sm mr-6'>
					各类型开销占比
				</span>
				<PieChart
					style={{
						width: '100%',
						maxWidth: '500px',
						maxHeight: '220px',
						aspectRatio: 1,
					}}
					responsive
				>
					<Pie
						data={typeCost}
						dataKey='cost'
						nameKey='type'
						cx='50%'
						cy='50%'
						innerRadius='50%'
						outerRadius='80%'
						fill='#8884d8'
						label
						isAnimationActive={true}
					>
						{typeCost.map((item, index) => (
							<Cell
								key={`cell-${item.type}`}
								fill={COLORS[index]}
							/>
						))}
					</Pie>
					<Legend />
				</PieChart>
			</div>
		</CardContainer>
	);
}
