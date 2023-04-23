// @ts-nocheck
/** @type {import('./$types').PageServerLoad} */
import { env } from '$env/dynamic/private'
import type { PageServerLoad } from '../$types'
import { redirect } from '@sveltejs/kit'

export const load = ({ locals }: Parameters<PageServerLoad>[0]) => {
    console.log('locals:', locals) // secret
}
