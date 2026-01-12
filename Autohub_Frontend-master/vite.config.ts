import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import fs from 'node:fs';

function getBaseFromHomepage(): string | undefined {
	try {
		const pkgPath = path.resolve(__dirname, 'package.json');
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
		const homepage: string | undefined = pkg?.homepage;
		if (!homepage) return undefined;
		const url = new URL(homepage);
		const base = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
		return base;
	} catch {
		return undefined;
	}
}

export default defineConfig(({ mode }) => {
	// Load *all* env vars (not just VITE_) so existing process.env.REACT_APP_*
	// references keep working without changing app code.
	const env = loadEnv(mode, process.cwd(), '');
	const processEnv = {
		...env,
		NODE_ENV: mode,
		MODE: mode,
	};

	const base =
		mode === 'development'
			? '/'
			: env.VITE_BASE ||
				env.BASE_URL ||
				env.PUBLIC_URL ||
				getBaseFromHomepage() ||
				'/';

	return {
		base,
		build: {
			target: 'es2015',
			minify: 'esbuild', // Faster than terser, good compression
			cssMinify: true,
			sourcemap: false, // Disable sourcemaps in production for smaller bundles
			reportCompressedSize: false, // Faster builds
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				output: {
					manualChunks(id) {
						const normalized = id.split('\\').join('/');
						
						// Group large vendor libraries into specific chunks
						if (normalized.includes('/node_modules/')) {
							const after = normalized.split('/node_modules/')[1];
							const parts = after.split('/');
							const pkg = parts[0].startsWith('@')
								? `${parts[0]}/${parts[1]}`
								: parts[0];
							
							// Group React and React DOM together (most critical)
							if (pkg === 'react' || pkg === 'react-dom' || pkg === 'react-router-dom') {
								return 'vendor-react';
							}
							
							// Group chart libraries (heavy)
							if (pkg === 'apexcharts' || pkg === 'react-apexcharts') {
								return 'vendor-charts';
							}
							
							// Group MUI (large)
							if (pkg.startsWith('@mui/') || pkg === '@emotion/react' || pkg === '@emotion/styled') {
								return 'vendor-ui';
							}
							
							// Group date/time libraries
							if (pkg === 'moment' || pkg === 'dayjs' || pkg === 'date-fns' || 
							    pkg === 'react-datetime' || pkg === 'react-flatpickr' || pkg === 'flatpickr') {
								return 'vendor-dates';
							}
							
							// Group form libraries
							if (pkg === 'formik' || pkg === 'react-select' || pkg === 'react-number-format') {
								return 'vendor-forms';
							}
							
							// Group Redux
							if (pkg === '@reduxjs/toolkit' || pkg === 'react-redux') {
								return 'vendor-redux';
							}
							
							// Group i18n
							if (pkg.startsWith('i18next') || pkg === 'react-i18next') {
								return 'vendor-i18n';
							}
							
							// Group PDF/Excel libraries (heavy, rarely used together)
							if (pkg === 'jspdf' || pkg === 'jspdf-autotable' || pkg === 'xlsx') {
								return 'vendor-documents';
							}
							
							// Default: split by package name for smaller chunks
							return `vendor-${pkg.replace('@', '').replace('/', '-')}`;
						}
						
						// Group pages by module for better code splitting
						if (normalized.includes('/src/pages/')) {
							if (normalized.includes('/allModules/')) {
								const moduleMatch = normalized.match(/\/allModules\/([^/]+)/);
								if (moduleMatch) {
									return `pages-${moduleMatch[1]}`;
								}
							}
							if (normalized.includes('/dashboard')) {
								return 'pages-dashboard';
							}
							if (normalized.includes('/presentation/')) {
								return 'pages-presentation';
							}
							if (normalized.includes('/documentation/')) {
								return 'pages-docs';
							}
						}
						
						return undefined;
					},
				},
			},
		},
		plugins: [
			react(),
			// Avoid Vite "define" parsing JSX in .js files:
			// provide CRA-style process.env at runtime via HTML injection.
			{
				name: 'inject-process-env',
				transformIndexHtml() {
					return {
						tags: [
							{
								tag: 'script',
								attrs: { type: 'text/javascript' },
								children: `window.process = window.process || {}; window.process.env = ${JSON.stringify(
									processEnv,
								)};`,
								injectTo: 'head-prepend',
							},
						],
					};
				},
			},
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			port: 3000,
		},
	};
});

