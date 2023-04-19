/** @type {import('./$types').PageServerLoad} */
import { env } from '$env/dynamic/private'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
    console.log('APPOINTMENT_URL:',env.APPOINTMENT_URL) // secret

		return {
		    baseApi: env.APPOINTMENT_URL,
            isQueueActive: env.QUEUE_ACTIVE
		}
   
}