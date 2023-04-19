import preprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

/** @type {import('@sveltejs/kit').Config} */
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({ out: 'dist' }),
		alias: {
			$src: './src',
			$lib: './src/lib',
			$stores: './src/stores',
			$assets: './src/assets',
			$icon: './node_modules/svelte-bootstrap-icons/lib'
		}
	}
}

export default config
