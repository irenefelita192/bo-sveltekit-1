export { matchers } from './client-matchers.js';

export const nodes = [() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8')];

export const server_loads = [3,2];

export const dictionary = {
	"/": [4],
	"/about": [7],
	"/accounts/login": [~8,[3]],
	"/(default)/customers": [5,[2]],
	"/(default)/welcome": [6,[2]]
};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};