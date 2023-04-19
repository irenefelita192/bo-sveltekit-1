import { sendStatus } from '$stores/data'
import { sessionValue } from '$stores/auth'

import { doRenewToken } from '$lib/userAuth'

export async function sendNotification({ body, session, baseEndpoint }) {
    sendStatus.set({ status: 'loading', error: '' })
    const { accessToken, refreshToken, expiryAt } = session
    let newSession = { accessToken, refreshToken, expiryAt }
    const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
    if (renewResult && renewResult.accessToken) {
        newSession = renewResult
        sessionValue.set({ ...newSession })
    }

    try {
        const result = await fetch(`${baseEndpoint}/notifications/blast`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${newSession.accessToken}`,
            },
            body: JSON.stringify({ ...body }),
        })

        if (result.status === 200) {
            sendStatus.set({ status: 'success', error: '' })
        } else {
            const errorText = await result.text()
            sendStatus.set({
                status: 'error',
                error: `${errorText || result.statusText}`,
            })
        }
    } catch (err) {
        // console.log('errrr', err)
        // console.log('err', err.message)
        sendStatus.set({
            status: 'error',
            error: `Submit error ${err.message ?? ''}`,
        })
    }
}

export async function isNotificationExist({ session, baseEndpoint, id }) {
    const { accessToken, refreshToken, expiryAt } = session
    let newSession = { accessToken, refreshToken, expiryAt }
    const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
    if (renewResult && renewResult.accessToken) {
        newSession = renewResult
        sessionValue.set({ ...newSession })
    }

    try {
        const result = await fetch(`${baseEndpoint}/notification-contents/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${newSession.accessToken}`,
            },
        })

        if (result.status === 200) {
            return true
        } else if (result.status === 204) {
            return false
        }
    } catch (err) {
        console.error('Error get isNotificationExist', err.message)
        return true
    }
}
