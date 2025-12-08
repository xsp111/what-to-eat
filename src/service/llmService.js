import { ApiFetch } from '../utils';
import apiPrefix from './env';

async function getConversationCtx() {
	return ApiFetch(apiPrefix + '/api/chat/history', {});
}

async function chat(data) {
	return ApiFetch(apiPrefix + '/api/chat', data, {
		stream: true,
	});
}

async function analyze() {
	return ApiFetch(
		apiPrefix + '/api/chat/analyze',
		{},
		{
			stream: true,
		},
	);
}

async function clearConversation() {
	return ApiFetch(apiPrefix + '/api/chat/clear', {});
}

export { chat, analyze, getConversationCtx, clearConversation };
