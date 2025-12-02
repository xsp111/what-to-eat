import * as llmService from '../services/llmService.js';
import * as billService from '../services/billService.js';
import * as foodService from '../services/foodService.js';

async function chatWithLLM(req, res) {
	const { message } = req.body;
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	const stream = await llmService.chat(message);

	for await (const chunk of stream) {
		const text = chunk.content;
		res.write(text);
	}

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
	const todayBill = await billService.getBill(userId);
	const food = await foodService.getFood(userId);
	const preInfo = {
		todayBill,
		food,
	};
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	const stream = await llmService.chat(
		preInfo,
		'针对用户今日账单信息并结合菜单，总结并给出日常饮食健康和消费方面建议，不要高于56个字',
	);

	for await (const chunk of stream) {
		const text = chunk.content;
		res.write(text);
	}

	res.end();
}

export { chatWithLLM, analyzeDaily };
