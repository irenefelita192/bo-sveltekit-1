/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
    interface Locals {
        accessToken: string
        refreshToken: string
        expiryAt: string
        uid: string
        sid: string
    }

    interface Platform {}

    interface Session {
        accessToken: string
        refreshToken: string
        expiryAt: string
        uid: string
        sid: string
    }
}
