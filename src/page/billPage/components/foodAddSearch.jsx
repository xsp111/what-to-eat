import { SearchOutlined } from '@ant-design/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { MessageContext } from '../../../components/rootLayout/context';

export default function FoodAddSearch({ foodList, setSearchFood }) {
	const messageApi = useContext(MessageContext);
	const [inputValue, setInputValue] = useState('');
	const [dropdownOpen, setIsDropdownOpen] = useState(false);
	const inputRef = useRef(null);
	const dropdownRef = useRef(null);
	const matches = foodList
		.map((food) => food?.name)
		.filter((item) =>
			item?.toLowerCase()?.includes(inputValue?.toLowerCase()),
		);

	useEffect(() => {
		function handleClickOutside(e) {
			if (
				inputRef.current &&
				!inputRef.current.contains(e.target) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	function handleSearch(selectedFood) {
		if (!foodList.find((item) => item.name === selectedFood)) {
			messageApi.error('该食物不存在');
			return;
		}
		setInputValue(selectedFood);
		const foodName = selectedFood;
		setSearchFood(foodList.find((food) => food?.name === foodName));
	}

	return (
		<div className='flex gap-1 justify-center items-center w-full'>
			<div className='flex-5 relative'>
				<input
					ref={inputRef}
					className='w-full h-9 px-4 rounded-md border bg-white border-pink-300'
					placeholder='搜索食物 🤔'
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value || '');
						setIsDropdownOpen(true);
					}}
				/>
				<span
					className='absolute right-4 top-1/2 -translate-y-1/2'
					onClick={() => {
						handleSearch(inputValue);
					}}
				>
					<SearchOutlined />
				</span>
				{dropdownOpen && (
					<div
						ref={dropdownRef}
						className='absolute top-full left-0 w-full max-h-52 px-4 py-2 shadow rounded-b-md border-t-0 bg-white z-10 flex flex-col gap-1 overflow-auto'
					>
						{matches.length > 0 ? (
							matches.map((item) => (
								<span
									className='text-sm text-gray-500 font-bold'
									onClick={() => {
										handleSearch(item);
										setIsDropdownOpen(false);
									}}
								>
									{item}
								</span>
							))
						) : (
							<span className='text-center text-sm text-gray-500'>
								暂无该食物
							</span>
						)}
					</div>
				)}
			</div>
			<button
				className='flex-1 flex justify-center items-center h-9 px-2.5 py-1.5 rounded-md text-gray-500 bg-blue-50 border border-sky-300'
				onClick={() => {
					setSearchFood(0);
				}}
			>
				<span className='text-lg font-bold'>新增</span>
			</button>
		</div>
	);
}
