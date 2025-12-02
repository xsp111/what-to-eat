import { BackwardOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
import { useContext, useEffect, useState } from 'react';
import Button from '../../../components/button';
import { useStore } from 'zustand';
import foodStore from '../../../store/foodStore';
import { getID } from '../../../utils';
import { MessageContext } from '../../../components/rootLayout/context';

export default function FoodEdit({ searchFood, setSearchFood }) {
	const messageApi = useContext(MessageContext);
	const isAdd = searchFood === 0;
	const [foodInfo, setFoodInfo] = useState(null);
	const { editFood, addFood, removeFood } = useStore(foodStore);

	useEffect(() => {
		setFoodInfo(searchFood);
	}, [searchFood]);

	function handleChange(e) {
		setFoodInfo({
			...foodInfo,
			[e.target.name]: e.target.value,
		});
	}

	function handleSave() {
		if (isAdd) {
			addFood({
				...foodInfo,
				id: getID(),
			});
			messageApi.success('新增成功');
		} else {
			editFood(foodInfo);
			messageApi.success('修改成功');
		}
		setSearchFood(null);
	}

	function handleDelete() {
		removeFood(foodInfo?.id);
		messageApi.success('修改成功');
		setSearchFood(null);
	}

	return (
		<div className='w-full p-2 flex flex-col items-center gap-4'>
			<div className='w-full relative text-gray-700 text-center text-xl font-bold'>
				{isAdd ? '新增食物' : '食物详情'}
				<div
					className='absolute left-0 top-0'
					onClick={() => {
						setSearchFood(null);
					}}
				>
					<BackwardOutlined />
				</div>
			</div>
			<div className='w-full flex justify-start items-center'>
				<span className='flex-1 text-sm text-gray-700'>食物名称：</span>
				<div className='flex-3 flex justify-center'>
					<input
						className='w-full px-2 text-center border-b  border-b-pink-300 outline-0'
						value={foodInfo?.name}
						name='name'
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className='w-full flex justify-start items-center'>
				<span className='flex-1 text-sm text-gray-700'>默认价格：</span>
				<div className='flex-3 flex justify-center'>
					<input
						className='w-full px-2 text-center border-b  border-b-pink-300 outline-0'
						value={foodInfo?.refValue}
						name='refValue'
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className='w-full flex justify-start items-center'>
				<span className='flex-1 text-sm text-gray-700'>喜爱程度：</span>
				<div className='flex-3 flex justify-center'>
					<Rate
						value={foodInfo?.favor}
						onChange={(value) => {
							setFoodInfo({
								...foodInfo,
								favor: value,
							});
						}}
					/>
				</div>
			</div>
			<div className='flex w-full gap-4'>
				<Button
					className='w-full h-8 border-sky-300 bg-blue-50 text-gray-500'
					onClick={handleSave}
				>
					{isAdd ? '新增' : '保存'}
				</Button>
				{!isAdd && (
					<Button className='w-full h-8' onClick={handleDelete}>
						delete
					</Button>
				)}
			</div>
		</div>
	);
}
