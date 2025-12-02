import { Modal } from 'antd';
import { Link } from 'react-router';
import { userStore } from '../../../store';
import { useStore } from 'zustand';
import { useEffect, useState } from 'react';

export default function UnLoginModal() {
	const { user } = useStore(userStore);
	const [modalVisible, setModalVisible] = useState(user === null);

	useEffect(() => {
		setModalVisible(user === null);
	}, [user]);

	return (
		<Modal
			open={modalVisible}
			onCancel={() => {
				setModalVisible(false);
			}}
			footer={null}
			centered
			closable={false}
		>
			<div className='text-center'>
				<span className='block'>
					您还未登录，数据将无法保存到远程服务器，
				</span>
				<span className='block'>
					请前往
					<Link to='/settings'>登录</Link>
				</span>
			</div>
		</Modal>
	);
}
