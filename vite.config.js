import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server:{
		port: 90,
		strictPort: false
	}
};

export default config;
