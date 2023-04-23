import 'dotenv/config'
import cookie from 'cookie'

export async function post({ request }) {
    try {
        const json = await request.json()
        const baseEndpoint = process.env.BASE_API || ''
        return fetch(`${baseEndpoint}/authstaff/refreshtoken`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${json.token}`,
            },
            body: JSON.stringify({
                refreshToken: json.refreshToken,
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
                        body: {
                            refreshToken: json.refreshToken,
                        },
                    }
                }
            })
            .catch((error) => ({
                status: 500,
                body: {
                    error: error.message,
                    token: json.token,
                    refreshToken: json.refreshToken,
                },
            }))
    } catch (error) {
        return {
            status: 500,
            body: {
                error: error.message,
            },
        }
    }
}
