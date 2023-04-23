import 'dotenv/config'
import cookie from 'cookie'

export async function post({ request }) {
    const json = await request.json()
    const baseEndpoint = process.env.BASE_API || ''
    try {
        await fetch(`${baseEndpoint}/authstaff/logout`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${json.token}`,
            },
            body: JSON.stringify({
                refreshToken: json.refreshToken,
            }),
        })
    } catch (err) {}
    return {
        headers: {
            'set-cookie': [
                cookie.serialize('_at', '', {
                    path: '/',
                    httpOnly: true,
                    maxAge: -99999999,
                }),
                cookie.serialize('_rt', '', {
                    path: '/',
                    httpOnly: true,
                    maxAge: -99999999,
                }),
                cookie.serialize('_eat', '', {
                    path: '/',
                    httpOnly: true,
                    maxAge: -99999999,
                }),
            ],
        },
        body: {
            ok: true,
        },
    }
}
