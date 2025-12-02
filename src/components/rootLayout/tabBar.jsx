import { Link, useLocation } from 'react-router';
import homeIcon from '../../assets/home.svg';
import {
	HomeOutlined,
	SettingOutlined,
	HomeFilled,
	SettingFilled,
	AccountBookOutlined,
	AccountBookFilled,
} from '@ant-design/icons';

function HelloKitty() {
	return <img src={homeIcon} width={128} />;
}

const tabsConfig = [
	{
		path: '/bill',
		icon: <AccountBookOutlined />,
		activeIcon: <AccountBookFilled />,
		label: '账单',
	},
	{
		path: '/',
		icon: <HelloKitty />,
		activeIcon: <HelloKitty />,
		label: '',
	},
	{
		path: '/settings',
		icon: <SettingOutlined />,
		activeIcon: <SettingFilled />,
		label: '设置',
	},
];

function TabItem({ item, activePath }) {
	const isActive = activePath === item.path;
	return (
		<Link key={item.path} to={item.path}>
			<div className={`${isActive ? 'text-pink-300' : ''}`}>
				<div className='flex flex-col justify-center items-center'>
					<div className='flex-3 text-xl'>
						{isActive ? item.activeIcon : item.icon}
					</div>
					<div className='flex-1 text-[10px] '>{item.label}</div>
				</div>
			</div>
		</Link>
	);
}

export default function TabBar() {
	const location = useLocation();
	return (
		<>
			<div className='flex justify-around items-center w-screen h-[6vh] px-4 py-2 bg-white overflow-hidden border-t-2 border-gray-100'>
				{tabsConfig.map((item) => (
					<TabItem item={item} activePath={location.pathname} />
				))}
			</div>
		</>
	);
}
