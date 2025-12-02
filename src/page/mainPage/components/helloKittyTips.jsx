import HelloKitty3D from '../../../components/helloKitty3D';
import { useStore } from 'zustand';
import { userStore } from '../../../store';

export default function HelloKittyTips() {
	const { user, hkTips } = useStore(userStore);

	return (
		<div className='fixed bottom-[6vh] left-10 flex max-w-[300px]'>
			<HelloKitty3D />
			<div className='flex-1 py-4'>
				<div className='p-1 bg-pink-100 rounded-sm shadow'>
					{user ? (
						<span className='text-gray-500 text-xs font-bold'>
							{hkTips === undefined
								? `你好呀! ${user.name}`
								: hkTips}
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
