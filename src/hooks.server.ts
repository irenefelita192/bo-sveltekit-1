import { Handle, redirect } from '@sveltejs/kit'
import * as crypto from 'crypto'
import jwt_decode from 'jwt-decode'

interface AccessToken {
    ID: string
}

export const handle: Handle = async ({ event, resolve }) => {
    // get cookies from browser
    const sessionID = event.cookies.get('_sid')
    const securityKey = event.cookies.get('_sk')
    const initVector = event.cookies.get('_iv')
    console.log('event.route.id', event.route.id)
    const unProtectedRoutes: string[] = ['/accounts/login', '/api/login', '/accounts/logout']
    if (!sessionID || !initVector || !securityKey) {
        // if there is no session load page as normal
        console.log('event.route.id', event.route.id)
        if (event.route.id && !unProtectedRoutes.includes(event.route.id)) {
            throw redirect(302, '/accounts/login')
        }
        return await resolve(event)
    } else if (event.route.id && event.route.id == '/') {
        throw redirect(302, '/welcome')
    }

    // const securityKey = crypto.randomBytes(32)
    let iv = Buffer.from(initVector, 'base64')
    let encryptedText = Buffer.from(sessionID, 'base64')
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(securityKey, 'base64'), iv)
    let decrypted = decipher.update(encryptedText)
    decipher.setAutoPadding(false)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    const decryptedSID = decrypted.toString().replace(/\x07/g, '')
    console.log('decrypted.toString()', decrypted.toString().replace(/\x07/g, ''))
    const sidArr = decryptedSID.split(';')
    let accessToken = '',
        refreshToken = ''
    sidArr.map((tkn) => {
        const pairTkn = tkn.split('=')
        console.log('pairTkn', pairTkn)

        if (pairTkn[0] === '_at') {
            accessToken = pairTkn[1]
        } else if (pairTkn[0] === '_rt') {
            refreshToken = pairTkn[1]
        }
    })
    event.locals.sid = decryptedSID
    event.locals.accessToken = accessToken || ''
    event.locals.refreshToken = refreshToken || ''
    if (accessToken) {
        try {
            let token: AccessToken = jwt_decode(accessToken)
            event.locals.uid = token.ID
            event.locals.expiryAt = token.exp || null
        } catch (err) {
            event.locals.uid = ''
        }
    }

    // event.locals.refreshToken = cookies._rt || ''
    // event.locals.expiryAt = cookies._eat || ''
    // if (cookies._at) {
    //     try {
    //         let token: AccessToken = jwt_decode(cookies._at)
    //         event.locals.uid = token.ID
    //     } catch (err) {
    //         event.locals.uid = ''
    //     }
    // }

    // load page as normal
    return await resolve(event)
}
