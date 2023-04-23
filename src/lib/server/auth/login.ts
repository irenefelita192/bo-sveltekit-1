import 'dotenv/config'
import cookie from 'cookie'

export async function post({ request }) {
    const json = await request.json()
    const baseEndpoint = process.env.BASE_API || ''
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
                return {
                    headers: {
                        'set-cookie': [
                            cookie.serialize('_at', data.accessToken, {
                                path: '/',
                                httpOnly: true,
                            }),
                            cookie.serialize('_rt', data.refreshToken, {
                                path: '/',
                                httpOnly: true,
                            }),
                            cookie.serialize('_eat', data.expiryAt, {
                                path: '/',
                                httpOnly: true,
                            }),
                        ],
                    },
                    body: data,
                }
            } else {
                return {
                    status: 500,
                    body: {},
                }
            }
        })
        .catch((error) => ({ status: 500, body: {} }))
}
