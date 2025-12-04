import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import foodRoutes from './routes/foodRoute.js';
import billRoutes from './routes/billRoute.js';
import userRoutes from './routes/userRoute.js';
import llmRoutes from './routes/llmRoute.js';
import { getClientIP } from './utils/reqProcess.js';

// 兼容 ESM 和 CommonJS 的 __filename / __dirname 获取
/* eslint-disable */
let __filename_local =
	typeof __filename !== 'undefined' ? __filename : undefined;
let __dirname_local = typeof __dirname !== 'undefined' ? __dirname : undefined;
const relativePathToStatic =
	typeof process !== 'undefined' ? '../../dist' : '../dist';
if (!__filename_local) {
	try {
		// 在 ESM 环境有效
		__filename_local = fileURLToPath(import.meta.url);
		__dirname_local = path.dirname(__filename_local);
	} catch (e) {
		if (typeof process !== 'undefined' && process.argv && process.argv[1]) {
			__filename_local = path.resolve(process.argv[1]);
		} else {
			__filename_local = process.cwd();
		}
		__dirname_local = path.dirname(__filename_local);
	}
}

const app = express();
const port = 4173;
export const staticDir = path.join(__dirname_local, relativePathToStatic);

app.use(express.static(staticDir));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
	// 允许的前端来源
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3018');
	// 允许的请求头
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization',
	);
	// 允许的请求方法
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	);
	// 允许携带 Cookie
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	// 处理预检请求（OPTIONS 方法）：直接返回 204 状态码
	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	next(); // 继续执行后续中间件/路由
});

app.use('/api/food', foodRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', llmRoutes);

app.get('/*splat', (req, res) => {
	res.sendFile(path.join(staticDir, 'index.html'));
	console.log(getClientIP(req), '访问了网站');
});
app.listen(port, () => {
	console.log(`服务运行在 ${port} 端口`);
});
