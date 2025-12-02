import { Outlet } from 'react-router';
import TabBar from './tabBar';
import { message } from 'antd';
import Chat from '../chat';
import { MessageContext } from './context';

export default function RootLayout() {
	const [messageApi, contextHolder] = message.useMessage();

	return (
		<MessageContext.Provider value={messageApi}>
			{contextHolder}
			<Outlet />
			<div className='fixed bottom-0 left-0 w-full'>
				<TabBar />
			</div>
			<Chat />
		</MessageContext.Provider>
	);
}
