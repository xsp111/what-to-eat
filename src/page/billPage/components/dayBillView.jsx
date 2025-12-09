import { DatePicker, Tabs } from 'antd';
import CardContainer from '../../../components/cardContainer';
import { useState } from 'react';
import { useStore } from 'zustand';
import { billStore } from '../../../store';
import { getBillByDate, getFormatDate } from '../../../utils';
import dayjs from 'dayjs';
import Button from '../../../components/button';
import BillModal from '../../../components/billModal';
import { billTypeEnum, billTypeMap } from '../../../constant/billType';
import { modalInfoEnum } from '../../../constant/modalEnum';

function DateBillItem({ item, onClick }) {
	return (
		<div
			className='relative w-full flex justify-between items-center py-1 px-8 bg-yellow-50 opacity-90 border border-yellow-200 rounded-md'
			onClick={onClick}
		>
			<span className='text-gray-600 font-bold'>{item.title}</span>
			<div>
				{item.value} <span className='text-gray-400'>¥</span>
			</div>
		</div>
	);
}

export default function DayBillView() {
	const today = new Date();
	const [date, setDate] = useState(getFormatDate(today));
	const [billType, setBillType] = useState(0);
	const { billList } = useStore(billStore);
	const [modalState, setModalState] = useState({
		state: modalInfoEnum['unvisible'],
	});
	const dayBillList = getBillByDate(billList, date);
	const renderBillList =
		billType === billTypeEnum['全部']
			? dayBillList
			: dayBillList.filter((item) => item.type === billType);
	const tabsConfig = Array.from({ length: 5 }, (_, i) => i).map((idx) => {
		return {
			key: idx,
			label: (
				<div className='flex w-12 gap-1'>
					<img src={billTypeMap[idx].icon} width={16} />
					<span className='text-sm text-gray-600'>
						{billTypeMap[idx].label}
					</span>
				</div>
			),
		};
	});

	return (
		<CardContainer className='flex-col gap-0'>
			<div className='flex justify-between items-center w-full'>
				<div>
					<span className='text-blue-400'>{'这天开销: '}</span>
					<span>
						{dayBillList
							.reduce(
								(sum, current) =>
									(sum += Number(current.value)),
								0,
							)
							.toFixed(2)}{' '}
						<span className='text-gray-400'>¥</span>
					</span>
				</div>
				<DatePicker
					defaultValue={dayjs(today)}
					onChange={(_, date) => {
						setDate(date);
					}}
				/>
			</div>
			<div className='w-full'>
				<Tabs
					defaultActiveKey={billTypeEnum['吃喝']}
					centered
					tabBarGutter={16}
					tabPosition='top'
					style={{ width: '100%' }}
					items={tabsConfig}
					onChange={(activeKey) => setBillType(Number(activeKey))}
				/>
			</div>
			<div className='flex flex-col gap-2 items-center w-full h-40 overflow-auto'>
				{renderBillList.length < 1 ? (
					<span className='text-sm text-gray-700'>
						这天没有记录该账单哦📝
					</span>
				) : (
					renderBillList.map((item) => (
						<DateBillItem
							item={item}
							key={item.id}
							onClick={() => {
								setModalState({
									state: modalInfoEnum['billModal'],
									info: {
										id: item.id,
									},
								});
							}}
						/>
					))
				)}
			</div>
			<Button
				className='mt-2 self-end h-8 bg-sky-50 border border-blue-300 text-gray-700'
				onClick={() => {
					setModalState({
						state: modalInfoEnum['billModal'],
					});
				}}
			>
				新增
			</Button>
			{modalState.state === modalInfoEnum['billModal'] && (
				<BillModal
					setModalState={setModalState}
					initInfo={{
						id: modalState?.info?.id,
						date,
						type: billType,
					}}
				/>
			)}
		</CardContainer>
	);
}
