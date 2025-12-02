export function getClientIP(req) {
	return (
		req.headers['cf-connecting-ip'] ||
		req.headers['x-forwarded-for']?.split(',')[0] ||
		req.socket.remoteAddress ||
		req.ip ||
		req.connection.remoteAddress
	);
}
