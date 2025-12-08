import { tool } from 'langchain';
import { ChatDeepSeek } from '@langchain/deepseek';
import * as billService from './billService.js';
import * as foodService from './foodService.js';
import dayjs from 'dayjs';

const chatMessagesStore = new Map();
const model = new ChatDeepSeek({
	model: 'deepseek-chat',
	// eslint-disable-next-line
	apiKey: process.env.API_KEY || undefined,
	temperature: 1,
});
const modelWithTools = model.bindTools(getTools());
const SYSTEMPROMPT =
	'你是一个贴心的日常吃喝以及记账的小助手，你会根据用户每日饮食和记账给出相应的建议和合理规划，账单记录了用户的每日消费，食物菜单记录了用户记录可能会吃的食物，账单和菜单信息保存在数据库中，需要的时候可借助工具查询。注意：只有登录的用户能与你对话，因此你禁止在回答中提及任何用户状态信息如‘登录，用户ID’等否则用户会造成困惑，';

function getTools() {
	return [
		tool(
			async ({ userId }) => {
				return await billService.getBill({
					id: userId,
					date: dayjs().format('YYYY-MM-DD'),
				});
			},
			{
				name: 'get_user_today_bills_info',
				description: '获取用户今日账单信息',
				schema: {
					type: 'object',
					properties: {
						userId: {
							type: 'string',
							description: '用户的ID',
						},
					},
					required: ['userId'],
				},
			},
		),
		tool(
			async ({ userId }) => {
				return await billService.getBill({
					id: userId,
				});
			},
			{
				name: 'get_user_all_bills_info',
				description: '获取用户历史所有账单信息',
				schema: {
					type: 'object',
					properties: {
						userId: {
							type: 'string',
							description: '用户的ID',
						},
					},
					required: ['userId'],
				},
			},
		),
		tool(
			async ({ userId }) => {
				return await foodService.getFood(userId);
			},
			{
				name: 'get_user_food_menu_info',
				description: '获取用户已添加菜单的食物信息',
				schema: {
					type: 'object',
					properties: {
						userId: {
							type: 'string',
							description: '用户的ID',
						},
					},
					required: ['userId'],
				},
			},
		),
	];
}

async function chat(messageId, userInput, res) {
	const { userId, input } = userInput;
	if (!chatMessagesStore.has(messageId)) {
		const initPrompt = SYSTEMPROMPT + '当前用户已经登录，ID为' + userId;
		chatMessagesStore.set(messageId, [
			{
				role: 'system',
				content: initPrompt,
			},
		]);
	}
	const message = chatMessagesStore.get(messageId);
	message.push({
		role: 'user',
		content: input,
	});

	if (messageId === 'once') return model.stream(message);

	// tool call
	async function runWithTools(messageInfo) {
		const { messageId, message } = messageInfo;
		const firstResStream = await modelWithTools.stream(message);
		let firstTextMsg = '';
		let fullMsg = null;
		for await (const chunk of firstResStream) {
			fullMsg = fullMsg ? fullMsg.concat(chunk) : chunk;
			const text = chunk.content;
			firstTextMsg += text;
			res.write(text);
		}
		if (fullMsg.tool_calls.length === 0) {
			chatMessagesStore.get(messageId)?.push({
				role: 'assistant',
				content: firstTextMsg,
			});
			return res.end();
		}

		const toolMsgList = [];
		for (const call of fullMsg.tool_calls) {
			const args = call.args;
			const tool = getTools().find((t) => t.name === call.name);
			const result = await tool.invoke(args);
			const toolMsg = {
				role: 'tool',
				tool_call_id: call.id,
				content: JSON.stringify(result),
			};
			toolMsgList.push(toolMsg);
		}

		const finalMessage = [...message, fullMsg, ...toolMsgList];
		const finalResStream = await model.stream(finalMessage);
		let reply = '';
		for await (const chunk of finalResStream) {
			const text = chunk.content;
			reply += text;
			res.write(text);
		}
		chatMessagesStore.get(messageId).push({
			role: 'assistant',
			content: firstTextMsg + reply,
		});
		res.end();
	}

	return runWithTools({
		messageId,
		message,
	});
}

async function getHistoryCtx(messageId) {
	if (!chatMessagesStore.has(messageId)) {
		return [];
	}
	return chatMessagesStore
		.get(messageId)
		.filter((message) => message.role !== 'system');
}

async function clearHistory(messageId) {
	return {
		success: chatMessagesStore.delete(messageId),
	};
}

export { chat, getHistoryCtx, clearHistory, chatMessagesStore };
