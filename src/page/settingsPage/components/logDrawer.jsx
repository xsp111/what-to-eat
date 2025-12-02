import { Avatar, Drawer } from 'antd';
import { useStore } from 'zustand';
import userStore from '../../../store/userStore';
import { useContext, useEffect, useRef, useState } from 'react';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import Button from '../../../components/button';
import { MessageContext } from '../../../components/rootLayout/context';

function LoginOrSignUp(props) {
	const { setVisible } = props;
	const {
		setUser: setLoginOrSignUpRes,
		loginOrSignUp,
		setHkTips,
	} = useStore(userStore);
	const [isLogin, setIsLogin] = useState(true);
	const tipsType = isLogin ? '登录' : '注册';
	const messageApi = useContext(MessageContext);
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState({
		name: '',
		password: '',
	});

	function handleChange(e) {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	}

	async function handleLoginOrSignUp() {
		if (user.name.trim() === '' || user.password.trim() === '') {
			messageApi.error('请输入正确的用户名或密码');
			return;
		}
		setIsLoading(true);
		const res = await loginOrSignUp(user, isLogin);
		if (!res.success) {
			messageApi.error(tipsType + '失败,' + isLogin ? res.msg : '');
			setIsLoading(false);
			return;
		}
		setHkTips();
		setIsLoading(false);
		setLoginOrSignUpRes(res.msg);
		messageApi.success(tipsType + '成功');
		setVisible(false);
	}

	return (
		<>
			<div className='mb-2 text-gray-700 font-bold text-2xl'>
				{tipsType}
			</div>
			<div className='flex justify-center w-full'>
				<span className='flex-1'>用户名</span>
				<input
					name='name'
					className='w-full flex-3 px-2 rounded-sm border bg-white border-sky-300'
					value={user.name}
					onChange={handleChange}
				/>
			</div>
			<div className='flex justify-center w-full'>
				<span className='flex-1'>密码</span>
				<input
					name='password'
					className='w-full flex-3 px-2 rounded-sm border bg-white border-sky-300'
					value={user.password}
					onChange={handleChange}
				/>
			</div>
			<div className='w-full text-center'>
				<span className=' text-gray-500 text-sm '>
					{isLogin ? (
						<span>
							新用户?点击
							<span
								className='text-blue-500'
								onClick={() => {
									setIsLogin(false);
								}}
							>
								注册
							</span>
						</span>
					) : (
						<span>
							已有账号?点击
							<span
								className='text-blue-500'
								onClick={() => {
									setIsLogin(true);
								}}
							>
								登录
							</span>
						</span>
					)}
				</span>
			</div>
			<Button
				className={`w-full h-8 ${
					isLoading ? 'bg-gray-300' : 'bg-sky-200'
				} border-none text-white`}
				onClick={handleLoginOrSignUp}
			>
				{isLoading ? <LoadingOutlined /> : tipsType}
			</Button>
		</>
	);
}

function EditProfile(props) {
	const { logout, user, setVisible } = props;
	const { editUserInfo } = useStore(userStore);
	const [isLoading, setIsLoading] = useState(false);
	const [form, setForm] = useState({
		name: user.name,
	});
	const fileInput = useRef(null);
	const [selectAvatarSrc, setSelectAvatarSrc] = useState(user.avatar);
	const messageApi = useContext(MessageContext);

	useEffect(() => {
		setSelectAvatarSrc(user.avatar);
	}, [user]);

	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	}

	async function handleEdit() {
		if (form.name.trim() === '' || form.password?.trim() === '') {
			messageApi.error('请输入正确的用户名或密码');
			return;
		}
		setIsLoading(true);
		const res = await editUserInfo(form);
		setIsLoading(false);
		if (res.success) {
			messageApi.success('修改成功');
		} else {
			messageApi.error('修改失败');
		}
		setVisible(false);
	}

	return (
		<>
			<div className='mb-2 text-gray-700 font-bold text-2xl'>
				编辑个人信息
			</div>
			<div className='flex flex-col items-center gap-1'>
				<input
					type='file'
					className='w-0, h-0'
					ref={fileInput}
					onChange={(e) => {
						const file = e.target.files[0];
						setSelectAvatarSrc(URL.createObjectURL(file));
						setForm({
							...form,
							avatarFile: file,
						});
					}}
				/>
				<Avatar
					src={selectAvatarSrc}
					icon={<UserOutlined />}
					size={64}
				/>
				<span
					className='text-[12px] text-gray-500'
					onClick={() => {
						fileInput.current.click();
					}}
				>
					点击修改头像
				</span>
			</div>
			<div className='flex justify-center w-full'>
				<span className='flex-1'>新用户名</span>
				<input
					name='name'
					className='w-full flex-3 px-2 rounded-sm border bg-white border-sky-300'
					value={form.name}
					onChange={handleChange}
				/>
			</div>
			<div className='flex justify-center w-full'>
				<span className='flex-1'>新密码</span>
				<input
					type='password'
					name='password'
					className='w-full flex-3 px-2 rounded-sm border bg-white border-sky-300'
					value={form.password}
					onChange={handleChange}
				/>
			</div>
			<div className='w-full flex gap-2'>
				<Button
					className={`flex-1 h-8 ${
						isLoading ? 'bg-gray-300' : 'bg-sky-200'
					} text-white border-none`}
					onClick={handleEdit}
				>
					{isLoading ? <LoadingOutlined /> : '修改'}
				</Button>
				<Button
					className='flex-1'
					onClick={() => {
						logout();
					}}
				>
					退出登录
				</Button>
			</div>
		</>
	);
}

export default function LogDrawer(props) {
	const { visible, setVisible } = props;
	const { user, logout } = useStore(userStore);
	return (
		<Drawer
			open={visible}
			onClose={() => {
				setVisible(false);
			}}
			placement='bottom'
			closable={false}
		>
			<div className='w-full h-full flex flex-col justify-center items-center gap-5 p-6'>
				{user ? (
					<EditProfile
						logout={logout}
						user={user}
						setVisible={setVisible}
					/>
				) : (
					<LoginOrSignUp setVisible={setVisible} />
				)}
			</div>
		</Drawer>
	);
}
