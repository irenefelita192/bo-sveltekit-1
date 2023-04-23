<script context="module">
    // console.log('masuk module')
    export async function load({ fetch, url, session }) {
        return {
            props: {
                referer: url?.searchParams?.get('referer') ?? '',
            },
        }
    }
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    import { session } from '$app/stores'
    import { post } from '$src/lib/utils'
    export let referer
    onMount(async () => {
        // console.log('masuk logout?', $session.accessToken)

        await post(`/auth/logout`, {
            refreshToken: $session.refreshToken,
            token: $session.accessToken,
        })

        try {
            localStorage.removeItem('uac')
        } catch (e) {}

        $session.accessToken = null
        $session.refreshToken = null
        $session.expiryAt = null

        if (window) {
            window.location.href = `/accounts/login${referer ? `?referer=${referer}` : ''}`
        }
    })
</script>
