import { BackwardOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
import { useContext, useEffect, useState } from 'react';
import Button from '../../../components/button';
import { useStore } from 'zustand';
import foodStore from '../../../store/foodStore';
import { MessageContext } from '../../../components/rootLayout/context';

export default function FoodEdit({ searchFood, setSearchFood }) {
	const messageApi = useContext(MessageContext);
	const isAdd = searchFood === 0;
	const [foodInfo, setFoodInfo] = useState({
		name: '',
		refValue: '',
		favor: 0,
	});
	const [loading, setLoading] = useState(false);
	const { editFood, addFood, removeFood } = useStore(foodStore);

	useEffect(() => {
		if (isAdd) {
			setFoodInfo({
				name: '',
				refValue: '',
				favor: 0,
			});
		} else {
			setFoodInfo(searchFood);
		}
	}, [searchFood]);

	function handleChange(e) {
		setFoodInfo({
			...foodInfo,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSave() {
		if (foodInfo?.name.trim() === '') {
			messageApi.error('请输入食物名称');
			return;
		}
		if (foodInfo?.refValue.trim() === '') {
			messageApi.error('请输入预计价格');
			return;
		}
		if (foodInfo.favor === 0) {
			messageApi.error('请输入喜爱程度');
			return;
		}
		if (isAdd) {
			setLoading(true);
			const res = await addFood(foodInfo);
			setLoading(false);
			if (res.success) {
				messageApi.success('新增成功');
				setSearchFood(null);
			} else {
				messageApi.error(res.msg);
			}
		} else {
			setLoading(true);
			const res = await editFood(foodInfo);
			setLoading(false);
			if (res.success) {
				messageApi.success('修改成功');
				setSearchFood(null);
			} else {
				messageApi.error(res.msg);
			}
		}
	}

	async function handleDelete() {
		setLoading(true);
		const { success } = await removeFood(foodInfo?.id);
		setLoading(true);
		if (success) {
			messageApi.success('修改成功');
			setSearchFood(null);
		} else {
			messageApi.error('修改失败');
		}
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
						value={foodInfo.name}
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
						value={foodInfo.refValue}
						name='refValue'
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className='w-full flex justify-start items-center'>
				<span className='flex-1 text-sm text-gray-700'>喜爱程度：</span>
				<div className='flex-3 flex justify-center'>
					<Rate
						value={foodInfo.favor}
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
					loading={loading}
					onClick={handleSave}
				>
					{isAdd ? '新增' : '保存'}
				</Button>
				{!isAdd && (
					<Button
						className='w-full h-8'
						onClick={handleDelete}
						loading={loading}
					>
						delete
					</Button>
				)}
			</div>
		</div>
	);
}
