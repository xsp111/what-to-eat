import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	server: {
		port: 3018,
		allowedHosts: true,
	},
	build: {
		minify: 'esbuild',
		rollupOptions: {
			output: {
				manualChunks: {
					framework: [
						'react',
						'react-dom',
						'react-router',
						'zustand',
					],
					componentLib: ['recharts', '@ant-design/icons', 'antd'],
					animated: [
						'three',
						'@react-three/fiber',
						'@react-three/drei',
					],
					utils: [
						'dayjs',
						'tailwind-merge',
						'react-markdown',
						'remark-gfm',
						'rehype-sanitize',
					],
				},
			},
		},
	},
	plugins: [
		react(),
		tailwindcss({
			config: './tailwind.config.js',
		}),
		// VitePWA({
		// 	// 是否启用 PWA
		// 	enabled: true,

		// 	// 开发环境是否启用
		// 	devOptions: {
		// 		enabled: true, // 开发环境通常关闭
		// 		type: 'module',
		// 	},

		// 	// Service Worker 相关配置
		// 	workbox: {
		// 		// ✅ 自动把构建后的所有文件（html, js, css, assets）加入 precache
		// 		globPatterns: [
		// 			'**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,json,webmanifest}',
		// 		],

		// 		// 生成的 SW 文件路径
		// 		swDest: 'sw.js',

		// 		// 清除旧缓存
		// 		cleanupOutdatedCaches: true,
		// 		clientsClaim: true,
		// 		skipWaiting: true,

		// 		// 缓存策略配置
		// 		runtimeCaching: [
		// 			// 缓存静态资源（CSS、JS、图片等）
		// 			{
		// 				urlPattern:
		// 					/^https:\/\/thehun-charges-bargains-holland\.trycloudflare\.com\/.*$/,
		// 				handler: 'CacheFirst', // 优先使用缓存
		// 				options: {
		// 					cacheName: 'site-assets',
		// 					expiration: {
		// 						maxEntries: 60, // 最多缓存 60 个条目
		// 						maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天过期
		// 					},
		// 				},
		// 			},
		// 		],
		// 	},

		// 	// PWA 应用的 manifest 配置（用于添加到桌面等功能）
		// 	manifest: {
		// 		name: 'What to Eat',
		// 		short_name: 'LLF EAT',
		// 		description: '这是一个给陆琳菲找吃的应用',
		// 		theme_color: '#ffffff',
		// 		background_color: '#ffffff',
		// 		display: 'standalone',
		// 		scope: '/',
		// 		start_url: '/',
		// 		id: '/',
		// 		icons: [
		// 			{
		// 				src: 'icon1.png',
		// 				sizes: '192x192',
		// 				type: 'image/png',
		// 			},
		// 			{
		// 				src: 'icon2.png',
		// 				sizes: '512x512',
		// 				type: 'image/png',
		// 			},
		// 			{
		// 				src: 'icon3.png',
		// 				sizes: '512x512',
		// 				type: 'image/png',
		// 				purpose: 'maskable', // 适配不同形状的图标
		// 			},
		// 		],
		// 	},
		// }),
	],
});
