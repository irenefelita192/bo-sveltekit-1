import { writable } from 'svelte/store'

//, refreshToken: '', expiryAt: ''
export const sessionValue = writable({ accessToken: '', refreshToken: '', expiryAt: '' })
