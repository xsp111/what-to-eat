import { useStore } from 'zustand';
import { useEffect, useRef, useState } from 'react';
import StartButton from './startButton';
import Button from '../../../components/button';
import CardContainer from '../../../components/cardContainer';
import { foodStore, userStore } from '../../../store';
import { Modal, Popover, Select } from 'antd';
import { modalInfoEnum } from '../../../constant/modalEnum';
import { getFormatDate } from '../../../utils';
import { Link } from 'react-router';
import { billTypeEnum } from '../../../constant/billType';

export default function FoodSelectModal(props) {
	const { setModalState } = props;
	const { foodList } = useStore(foodStore);
	const { user } = useStore(userStore);
	const [foodsIndx, setFoodsIndex] = useState(
		Array.from({ length: foodList.length }, (_, i) => i),
	);
	const [selectedFood, setSelectedFood] = useState(null);
	const [isStart, setIsStart] = useState(null);
	const [popVisible, setPopVisible] = useState(false);
	const ob = user ? user.name : '你';
	const initText = `${ob}会吃什么呢？`;
	const animationRef = useRef(null);
	const startTimeRef = useRef(0);
	const totalDuration = 1500;

	const foodsOptions = foodList.map((item, idx) => ({
		label: item.name,
		value: idx,
	}));

	const getRandomFood = () => {
		if (foodList.length === 0) return `${ob}没有可以吃的东西诶`;
		const randomIndex = Math.floor(Math.random() * foodsIndx.length);
		return foodList[foodsIndx[randomIndex]];
	};

	function startDraw() {
		if (isStart || foodList.length < 1)
			return setSelectedFood(getRandomFood());
		setIsStart(true);
		startTimeRef.current = performance.now();
		function animate(currentTime) {
			const elapsed = currentTime - startTimeRef.current;
			const progress = Math.min(elapsed / totalDuration, 1);
			setSelectedFood(getRandomFood());

			if (progress < 1) {
				animationRef.current = requestAnimationFrame(animate);
			} else {
				setSelectedFood(getRandomFood());
				setIsStart(false);
			}
		}
		animationRef.current = requestAnimationFrame(animate);
	}

	useEffect(() => {
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, []);

	return (
		<Modal
			open
			centered
			maskClosable={false}
			footer={null}
			onCancel={() => {
				setModalState({
					state: modalInfoEnum['unvisible'],
				});
			}}
		>
			<CardContainer className='flex-col border-none'>
				<div className='text-3xl font-bold text-gray-700'>
					下一餐要吃什么呢?
				</div>

				<div className='flex flex-col items-center gap-4'>
					{foodList.length < 1 ? (
						<span className='text-gray-500'>
							你的菜单目前为空，请
							<Link to='/bill'>前往添加你的菜单</Link>
						</span>
					) : (
						<>
							{isStart === null && (
								<div className='text-xl font-bold text-sky-300'>
									{initText}
								</div>
							)}
							{isStart !== null && (
								<div className='flex flex-col items-center gap-2'>
									<span className='text-xl font-bold text-sky-300'>
										{ob}打算吃:
									</span>
									<div className='text-2xl font-bold text-gray-700'>
										{selectedFood?.name}
									</div>
								</div>
							)}
							<div className='flex justify-center'>
								<Popover
									placement='bottom'
									open={popVisible}
									onClick={() => {
										setPopVisible(true);
									}}
									content={
										<div className='w-[300px] flex flex-col gap-2'>
											<span className='text-xs text-gray-800'>
												选择你准备抽取的食物,不选则默认为菜单中的所有食物
											</span>
											<Select
												mode='multiple'
												allowClear
												options={foodsOptions}
												className='w-full'
												placeholder='选择你会吃的东西'
												onChange={(value) => {
													setFoodsIndex(value);
												}}
											/>
											<Button
												className='self-end w-20'
												onClick={() => {
													setPopVisible(false);
												}}
											>
												确认
											</Button>
										</div>
									}
								>
									<span className='text-sm text-gray-400'>
										点击可选择你想要吃的东西
									</span>
								</Popover>
							</div>
							<div className='w-full flex gap-4 justify-center'>
								<StartButton
									disable={isStart}
									onClick={startDraw}
								/>
								{selectedFood && !isStart && (
									<Button
										onClick={() => {
											setModalState({
												state: modalInfoEnum[
													'billModal'
												],
												info: {
													type: billTypeEnum['吃喝'],
													title:
														selectedFood?.name ||
														'',
													desc: '',
													value: selectedFood?.refValue,
													date: getFormatDate(
														new Date(),
													),
												},
											});
										}}
									>
										就吃这个
									</Button>
								)}
							</div>
						</>
					)}
				</div>
			</CardContainer>
		</Modal>
	);
}
