import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const model = new ChatDeepSeek({
	model: 'deepseek-chat',
	// eslint-disable-next-line
	apiKey: process.env.API_KEY || undefined,
	temperature: 0,
	streaming: true,
});

const SYSTEMPROMPT =
	'你是一个贴心的日常吃喝以及记账的小助手，你会根据用户每日饮食和记账给出相应的建议和合理规划,';

async function chat(userInput, extraPrompt) {
	const prompt = ChatPromptTemplate.fromMessages([
		['system', SYSTEMPROMPT + extraPrompt],
		['user', '{input}'],
	]);
	const chain = prompt.pipe(model);
	return chain.stream({ input: userInput });
}

export { chat };
