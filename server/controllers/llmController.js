import * as llmService from '../services/llmService.js';
import * as billService from '../services/billService.js';
import * as foodService from '../services/foodService.js';
import dayjs from 'dayjs';

async function chatWithLLM(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const { input } = req.body;
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	const messageId = dayjs().format('YYYY-MM-DD') + userId;
	await llmService.chat(
		messageId,
		{
			userId,
			input,
		},
		res,
	);
	res.end();
}

async function analyzeDaily(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const date = dayjs().format('YYYY-MM-DD');
	const todayBill = await billService.getBill({
		id: userId,
		date,
	});
	const food = await foodService.getFood(userId);
	const preInfo = {
		todayBill,
		food,
	};
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	const userInput = `针对今日账单信息并结合菜单，总结并给出日常饮食健康和消费方面建议，不要高于56个字:${JSON.stringify(
		preInfo,
		null,
		2,
	)}`;
	const stream = await llmService.chat('once', {
		userId,
		input: userInput,
	});

	for await (const chunk of stream) {
		const text = chunk.content;
		res.write(text);
	}

	llmService.chatMessagesStore.delete('once');
	res.end();
}

async function getHistoryCtx(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const messageId = dayjs().format('YYYY-MM-DD') + userId;
	const history = await llmService.getHistoryCtx(messageId);
	return res.status(200).json({
		success: 1,
		msg: history,
	});
}

export { chatWithLLM, analyzeDaily, getHistoryCtx };
