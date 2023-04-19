import { writable } from 'svelte/store'

let payload = {
    meta: {
        status: 'loading',
        error: '',
    },
    data: [],
}

export const treemenus = writable(payload)
export const menuList = writable([])
