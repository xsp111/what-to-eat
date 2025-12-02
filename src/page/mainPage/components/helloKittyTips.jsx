import { useEffect, useState } from 'react';
import HelloKitty3D from '../../../components/helloKitty3D';
import { useStore } from 'zustand';
import { userStore } from '../../../store';
import { analyze } from '../../../service/llmService';

export default function HelloKittyTips() {
	const { user, hkTips, setHkTips } = useStore(userStore);
	const [messages, setMessages] = useState(hkTips);

	useEffect(() => {
		if (hkTips) return;
		send();
	}, []);

	async function send() {
		const reader = await analyze();
		let botText = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			const chunk = new TextDecoder().decode(value);
			botText += chunk;
			setMessages(botText);
		}
		setHkTips(botText);
	}

	return (
		<div className='fixed bottom-[6vh] left-10 flex max-w-[300px]'>
			<HelloKitty3D />
			<div className='flex-1 py-4'>
				<div className='p-1 bg-pink-100 rounded-sm shadow'>
					{user ? (
						<span className='text-gray-500 text-xs font-bold'>
							{messages === undefined
								? `你好呀! ${user.name}`
								: messages}
						</span>
					) : (
						<span className='text-gray-700 font-bold'>
							你好！你还没有登录哦
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
