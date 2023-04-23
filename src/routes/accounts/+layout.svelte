<!-- <script context="module">
    export async function load({ params, fetch, session, stuff }) {
        if (session.accessToken) {
            return { status: 302, redirect: '/' }
        }

        return {}
    }
</script> -->
<script lang="ts">
    import { navigating } from '$app/stores'
    import PageLoader from '$lib/components/PageLoader.svelte'
    import '$lib/tailwind.css'
</script>

asdasd
{#if $navigating}
    <PageLoader />
{:else}
    <slot />
{/if}
