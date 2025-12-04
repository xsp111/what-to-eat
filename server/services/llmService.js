import { ChatDeepSeek } from '@langchain/deepseek';

const model = new ChatDeepSeek({
	model: 'deepseek-chat',
	// eslint-disable-next-line
	apiKey: process.env.API_KEY || undefined,
	temperature: 1,
	streaming: true,
});
const chatMessagesStore = new Map();
const SYSTEMPROMPT =
	'你是一个贴心的日常吃喝以及记账的小助手，你会根据用户每日饮食和记账给出相应的建议和合理规划,';

async function chat(messagesId, userInput) {
	if (!chatMessagesStore.has(messagesId)) {
		chatMessagesStore.set(messagesId, [
			{
				role: 'system',
				content: SYSTEMPROMPT,
			},
		]);
	}
	const messages = chatMessagesStore.get(messagesId);
	messages.push({
		role: 'user',
		content: userInput,
	});
	return model.stream(messages);
}

async function getHistoryCtx(messageId) {
	if (!chatMessagesStore.has(messageId)) {
		chatMessagesStore.set(messageId, [
			{
				role: 'system',
				content: SYSTEMPROMPT,
			},
		]);
	}
	return chatMessagesStore
		.get(messageId)
		.filter((message) => message.role !== 'system');
}

export { chat, getHistoryCtx, chatMessagesStore };
