import { ApiFetch } from '../utils';
import devPrefix from './env';

async function chat(data) {
	return ApiFetch(devPrefix + '/api/chat', data, {
		stream: true,
	});
}

async function analyze() {
	return ApiFetch(
		devPrefix + '/api/chat/analyze',
		{},
		{
			stream: true,
		},
	);
}

export { chat, analyze };
