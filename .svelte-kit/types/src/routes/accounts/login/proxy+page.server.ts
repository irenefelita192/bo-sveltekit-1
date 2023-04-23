// @ts-nocheck
/** @type {import('./$types').PageServerLoad} */
import { env } from '$env/dynamic/private'
import type { PageServerLoad } from '../../$types'
import { redirect } from '@sveltejs/kit'

export const load = () => {
    console.log('APPOINTMENT_URL:', env.CREDENTIAL_KEY) // secret
    return {
        credentialKey: env.CREDENTIAL_KEY,
        clientID: env.GOOGLE_CLIENT_ID,
    }
}
;null as any as PageServerLoad;