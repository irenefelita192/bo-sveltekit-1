import 'dotenv/config'
import cookie from 'cookie'

export async function post({ request }) {
    const json = await request.json()

    return {
        headers: {
            'set-cookie': [
                cookie.serialize('_at', json.at, {
                    path: '/',
                    httpOnly: true,
                }),
                cookie.serialize('_rt', json.rt, {
                    path: '/',
                    httpOnly: true,
                }),
                cookie.serialize('_eat', json.eat, {
                    path: '/',
                    httpOnly: true,
                }),
            ],
        },
    }
}
