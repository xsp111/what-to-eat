import { useStore } from 'zustand';
import foodStore from '../../../store/foodStore';
import CardContainer from '../../../components/cardContainer';
import { useState } from 'react';
import { OrderedListOutlined, RightCircleOutlined } from '@ant-design/icons';
import FoodAddSearch from './foodAddSearch';
import FoodEdit from './foodEdit';

function FoodShowItem({ food, onClick }) {
	return (
		<div className='relative flex justify-center items-center w-full h-9 bg-yellow-50 border border-yellow-300 opacity-90 rounded-md'>
			<span className='flex items-center text-gray-600 font-bold h-9'>
				{food}
			</span>
			<span
				className='absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400'
				onClick={onClick}
			>
				<RightCircleOutlined />
			</span>
		</div>
	);
}

export default function FoodsOpera() {
	const { foodList } = useStore(foodStore);
	const [searchFood, setSearchFood] = useState(null);
	return (
		<CardContainer className='flex-col justify-center'>
			<span className='self-start text-blue-400 text-xl'>
				管理菜单 <OrderedListOutlined />
			</span>
			<FoodAddSearch foodList={foodList} setSearchFood={setSearchFood} />
			<div className='w-full h-[211px]'>
				{searchFood !== null ? (
					<FoodEdit
						searchFood={searchFood}
						setSearchFood={setSearchFood}
					/>
				) : (
					<div className='flex flex-col gap-2 justify-start items-center w-full h-full overflow-auto'>
						{foodList.length === 0 && (
							<div className='text-lg text-gray-500 text-center'>
								现在没有想吃的 😩
							</div>
						)}
						{foodList.map((food) => (
							<FoodShowItem
								key={food?.id}
								food={food?.name}
								onClick={() => {
									setSearchFood(food);
								}}
							/>
						))}
					</div>
				)}
			</div>
		</CardContainer>
	);
}
