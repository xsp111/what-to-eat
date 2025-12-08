import { useContext, useEffect, useRef, useState } from 'react';
import Button from '../button';
import {
	ClearOutlined,
	CommentOutlined,
	LoadingOutlined,
	SendOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import chatbot from '../../assets/avatar-chatbot.svg';
import defalutAvatar from '../../assets/user.svg';
import helloKitty from '../../assets/ht-chatbot.svg';
import * as llmService from '../../service/llmService';
import { Drawer, FloatButton, Modal, Skeleton } from 'antd';
import { useStore } from 'zustand';
import { userStore } from '../../store';
import { Link } from 'react-router';
import { MessageContext } from '../rootLayout/context';

export default function Chat() {
	const [chatDrawerVisible, setChatDrawerVisible] = useState(false);
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [input, setInput] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [clearConfirmModalVisible, setClearConfirmModalVisible] =
		useState(false);
	const [clearConfirmLoading, setClearConfirmLoading] = useState(false);
	const messageApi = useContext(MessageContext);
	const { user } = useStore(userStore);
	const endRef = useRef(null);

	useEffect(() => {
		if (chatDrawerVisible) {
			llmService.getConversationCtx().then((res) => {
				if (res.success) {
					setMessages(res.msg);
					setLoading(false);
				} else {
					setLoading(true);
				}
			});
		}
	}, [chatDrawerVisible]);

	// 在 messages 变更时滚动到底部
	useEffect(() => {
		endRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
		});
	}, [messages]);

	async function send() {
		if (isGenerating || input.trim() === '') return;
		const userMsg = { role: 'user', content: input };
		setMessages([
			...messages,
			userMsg,
			{
				role: 'assistant',
				content: '🤔思考中',
			},
		]);
		setIsGenerating(true);
		setInput('');

		const reader = await llmService.chat({ input });
		let botText = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				setIsGenerating(false);
				break;
			}
			const chunk = new TextDecoder().decode(value);
			botText += chunk;

			setMessages([
				...messages,
				userMsg,
				{ role: 'assistant', content: botText },
			]);
		}
	}

	async function handleClear() {
		setClearConfirmLoading(true);
		const { success } = await llmService.clearConversation();
		if (success) {
			messageApi.success('删除成功');
			setMessages([]);
			setClearConfirmModalVisible(false);
		} else {
			messageApi.error('删除失败');
		}
		setClearConfirmLoading(false);
	}

	return (
		<>
			<FloatButton
				icon={<CommentOutlined />}
				onClick={() => setChatDrawerVisible(true)}
			/>

			<Drawer
				open={chatDrawerVisible}
				onClose={() => {
					setChatDrawerVisible(false);
				}}
				placement='bottom'
				size={loading ? 'default' : 'large'}
				title={
					<div className='flex items-center justify-between'>
						<span className='font-bold text-xl'>你的小助手</span>
						{user && messages.length > 0 ? (
							<span
								className='text-gray-400 text-sm'
								onClick={() => {
									setClearConfirmModalVisible(true);
								}}
							>
								<ClearOutlined />
								清空
							</span>
						) : (
							<span>{''}</span>
						)}
					</div>
				}
			>
				<div className='w-full h-full'>
					<div className='flex flex-col gap-3 max-h-[90%] overflow-auto'>
						<Skeleton loading={loading}>
							{messages.map((m, i) => {
								const isUser = m.role === 'user';
								return (
									<div
										key={i}
										className={`flex gap-2 ${
											isUser ? 'justify-end' : ''
										}`}
									>
										{!isUser && (
											<div className='h-7 w-9 shadow rounded-sm'>
												<img src={chatbot} width={36} />
											</div>
										)}
										<div
											className={`relative px-3 py-2 rounded-lg shadow-sm max-w-[75%] wrap-break-word ${
												isUser
													? 'bg-pink-400 text-white rounded-br-none'
													: 'bg-gray-50 text-gray-800 rounded-bl-none'
											}`}
										>
											{isUser ? (
												<span>{m.content}</span>
											) : (
												<>
													<ReactMarkdown
														remarkPlugins={[
															remarkGfm,
														]}
														rehypePlugins={[
															rehypeSanitize,
														]}
														components={{
															code({
																node,
																inline,
																className,
																children,
																...props
															}) {
																if (inline) {
																	return (
																		<code
																			className={`bg-gray-100 px-1 rounded text-sm ${
																				className ??
																				''
																			}`}
																			{...props}
																		>
																			{
																				children
																			}
																		</code>
																	);
																}
																// 处理代码块自动换行
																return (
																	<pre className='whitespace-pre-wrap wrap-break-word bg-gray-50 p-2 rounded text-sm overflow-x-auto'>
																		<code
																			className={
																				className
																			}
																			{...props}
																		>
																			{
																				children
																			}
																		</code>
																	</pre>
																);
															},
														}}
													>
														{m.content || ''}
													</ReactMarkdown>
													{isGenerating &&
														i ===
															messages.length -
																1 && (
															<span className='mt-2 flex items-center gap-2 text-gray-400 text-xs'>
																生成中
																<LoadingOutlined />
															</span>
														)}
												</>
											)}
										</div>
										{isUser && (
											<div className='h-9 w-9 shadow rounded-sm'>
												<img
													src={
														user
															? user.avatar
															: defalutAvatar
													}
													width={36}
													height={36}
												/>
											</div>
										)}
									</div>
								);
							})}
						</Skeleton>

						<div ref={endRef} />
					</div>
					<div className='fixed left-0 bottom-0 w-screen px-6 h-15 bg-white flex items-center gap-2'>
						<img src={helloKitty} width={36} />
						{user ? (
							<>
								<input
									value={input}
									placeholder='快来跟小助手聊天吧~'
									className='flex-6 h-8 px-4 rounded-md border bg-white border-sky-300'
									onChange={(e) => setInput(e.target.value)}
								/>
								<Button
									className={`flex-1 h-8 border-none ${
										isGenerating || loading
											? 'bg-gray-300'
											: 'bg-blue-300'
									} text-white`}
									onClick={send}
								>
									{isGenerating || loading ? (
										<LoadingOutlined />
									) : (
										<SendOutlined />
									)}
								</Button>
							</>
						) : (
							<span className='w-full text-center text-gray-500 font-bold'>
								请先
								<Link
									to='./settings'
									onClick={() => {
										setChatDrawerVisible(false);
									}}
								>
									登录
								</Link>
								,登录后即可与小助手聊天
							</span>
						)}
					</div>
				</div>
			</Drawer>
			<Modal
				open={clearConfirmModalVisible}
				centered
				onCancel={() => {
					setClearConfirmModalVisible(false);
				}}
				onOk={handleClear}
				confirmLoading={clearConfirmLoading}
				okText='删除'
				cancelText='取消'
			>
				<span className=''>删除后记录将无法恢复，确认删除？</span>
			</Modal>
		</>
	);
}
