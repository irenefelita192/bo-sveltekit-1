/** @type {import('./$types').PageServerLoad} */
import { env } from '$env/dynamic/private'
import type { PageServerLoad } from '../$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = ({ locals }) => {
    console.log('locals:', locals) // secret

    return {
        baseApi: env.APPOINTMENT_URL,
        isQueueActive: env.QUEUE_ACTIVE,
        sid: locals.sid,
    }
}
