const esbuild = require('esbuild');

esbuild
	.build({
		entryPoints: ['./server/app.js'],
		outfile: './server/dist/index.cjs',
		platform: 'node',
		target: 'node22',
		format: 'cjs',
		bundle: true,
		minify: true,
		sourcemap: false,
		external: ['express'],
	})
	.catch(() => process.exit(1));
