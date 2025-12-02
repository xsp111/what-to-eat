import { useStore } from 'zustand';
import CardContainer from '../../../components/cardContainer';
import overviewIcon from '../../../assets/overview.png';
import { billStore } from '../../../store';
import { Link } from 'react-router';
import { getBillByDate, getFormatDate } from '../../../utils';
import BillModal from '../../../components/billModal';
import eatIcon from '../../../assets/eat.svg';
import { useState } from 'react';
import FoodSelectModal from './foodSelectModal';
import { billTypeEnum } from '../../../constant/billType';
import { modalInfoEnum } from '../../../constant/modalEnum';

function BillOverviewItem({ item, onClick }) {
	return (
		<div
			className='h-6 flex items-center justify-evenly bg-blue-50 opacity-90 border border-sky-300 rounded-md w-full text-center'
			onClick={onClick}
		>
			<div className='flex-1 p-2 w-full text-sm text-gray-600 font-bold truncate'>
				{item.title}
			</div>
			<div className='flex-1 w-full text-sm'>
				{item.value + ' '}
				<span className='text-gray-400'>¥</span>
			</div>
		</div>
	);
}

export default function FoodOverview() {
	const { billList } = useStore(billStore);
	const [modalState, setModalState] = useState({
		state: modalInfoEnum['unvisible'],
		info: null,
	});
	const todayBillList = getBillByDate(
		billList,
		getFormatDate(new Date()),
	).filter((item) => item.type === billTypeEnum['吃喝']);

	return (
		<CardContainer classame='justify-between'>
			<div className='flex-1 flex flex-col items-center gap-4'>
				<img src={overviewIcon} width={84} className='flex-3' />
				<button
					className='flex-1 flex justify-center items-center h-10 px-2.5 py-0.5 rounded-lg border border-pink-300 text-red-300 font-normal text-sm'
					onClick={() => {
						setModalState({
							state: modalInfoEnum['selectModal'],
						});
					}}
				>
					<div className='flex justify-center items-center gap-1'>
						<img src={eatIcon} width={16} />
						eat
					</div>
				</button>
			</div>
			<div className='h-full flex-2 flex flex-col gap-2 justify-start items-center w-[80%]'>
				<div className='flex justify-center items-center relative w-full text-xl font-bold text-pink-300'>
					<span>今日已吃</span>
					{todayBillList.length > 3 && (
						<Link to='/bill'>
							<span className='absolute right-0 bottom-0 text-gray-500 text-sm'>
								more
							</span>
						</Link>
					)}
				</div>
				<div className='w-full flex flex-col gap-2'>
					{todayBillList.length < 1 && (
						<span className='text-center text-gray-500 font-bold'>
							还没有吃东西哦🍽️
						</span>
					)}
					{todayBillList.slice(0, 3).map((item) => (
						<BillOverviewItem
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
					))}
				</div>
			</div>
			{modalState.state === modalInfoEnum['billModal'] && (
				<BillModal
					setModalState={setModalState}
					initInfo={modalState?.info}
				/>
			)}
			{modalState.state === modalInfoEnum['selectModal'] && (
				<FoodSelectModal setModalState={setModalState} />
			)}
		</CardContainer>
	);
}
