// import 'dotenv/config'
/** @type {import('./$types').RequestHandler} */
// import cookie from 'cookie'
import { env } from '$env/dynamic/private'
import * as crypto from 'crypto'

export async function POST({ cookies, request, locals }) {
    const json = await request.json()
    const baseEndpoint = env.BASE_API || ''
    return fetch(`${baseEndpoint}/authstaff/login`, {
        method: 'POST',
        body: JSON.stringify({
            method: 'google',
            googleJWT: json.token,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                // return {
                //     headers: {
                //         'set-cookie': [
                //             cookie.serialize('_at', data.accessToken, {
                //                 path: '/',
                //                 httpOnly: true,
                //             }),
                //             cookie.serialize('_rt', data.refreshToken, {
                //                 path: '/',
                //                 httpOnly: true,
                //             }),
                //             cookie.serialize('_eat', data.expiryAt, {
                //                 path: '/',
                //                 httpOnly: true,
                //             }),
                //         ],
                //     },
                //     body: data,
                // }

                //Using AES encryption
                const algorithm = 'aes-256-cbc'

                // generate 16 bytes of random data
                const initVector = crypto.randomBytes(16)

                // protected data
                const message = `_at=${data.accessToken};_rt=${data.refreshToken}`

                // secret key generate 32 bytes of random data
                const securityKey = crypto.randomBytes(32)

                // the cipher function
                const cipher = crypto.createCipheriv(
                    algorithm,
                    Buffer.from(securityKey),
                    initVector
                )
                // cipher.setAutoPadding(false)
                // encrypt the message
                // input encoding
                // output encoding
                // let chipperToken = cipher.update(message, 'utf-8', 'hex')
                let chipperToken = cipher.update(message)

                chipperToken = Buffer.concat([chipperToken, cipher.final()])
                const base64Token = chipperToken.toString('base64')
                cookies.set('_iv', initVector.toString('base64'), {
                    path: '/',
                    httpOnly: true,

                    sameSite: 'strict',
                })
                cookies.set('_sk', securityKey.toString('base64'), {
                    path: '/',
                    httpOnly: true,

                    sameSite: 'strict',
                })
                cookies.set('_sid', base64Token, {
                    path: '/',
                    httpOnly: true,

                    sameSite: 'strict',
                })

                return new Response(JSON.stringify(base64Token))
            } else {
                return {
                    status: 500,
                    body: {},
                }
            }
        })
        .catch((error) => ({
            status: 500,
            body: {
                error: error,
            },
        }))
}
