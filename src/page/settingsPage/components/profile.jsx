import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useState } from 'react';
import { useStore } from 'zustand';
import userStore from '../../../store/userStore';
import LogDrawer from './logDrawer';
import Chart from './chart';

export default function Profile() {
	const [editProfileVisible, setEditProfileVisible] = useState(false);
	const { user } = useStore(userStore);
	const isLogin = user !== null;
	return (
		<>
			<div className='relative h-full w-full flex flex-col gap-2 bg-white'>
				<div className='absolute left-[5vw] flex items-center transform -translate-y-1/3 rounded-[50%]'>
					<Avatar
						size={108}
						icon={<UserOutlined />}
						src={isLogin && user.avatar}
					/>
				</div>
				<div className='w-full p-4 flex flex-col items-center justify-between'>
					<div className='flex items-center justify-end gap-12 w-full'>
						<span
							className={`pl-[40%] text-lg ${
								isLogin ? 'font-bold' : 'text-gray-500'
							} flex-1`}
						>
							{isLogin ? user.name : '尚未登录'}
						</span>
						<div
							onClick={() => {
								setEditProfileVisible(true);
							}}
						>
							<span className='mr-1 text-gray-500'>账号管理</span>
							<EditOutlined />
						</div>
					</div>
				</div>
				<Chart />
			</div>
			<LogDrawer
				visible={editProfileVisible}
				setVisible={setEditProfileVisible}
			/>
		</>
	);
}
