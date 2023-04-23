<!-- <script context="module" lang="ts">
	import { doRenewToken } from '$lib/userAuth'
	import { providerData } from '$stores/provider'

	export async function load({ params, fetch, session }) {
		const { accessToken, refreshToken, expiryAt, uid, name } = session
		let newSession = { accessToken, refreshToken, expiryAt }

		let renewResult = null
		if (accessToken) {
			renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
			if (renewResult && renewResult.accessToken) {
				newSession = renewResult
			} else if (renewResult && renewResult.error) {
				return {
					status: 302,
					redirect: '/accounts/logout'
				}
			}
		}

		if (newSession.accessToken) {
			let env
			const readEnv = await fetch(`/auth/getPath`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (readEnv.status === 200) {
				env = await readEnv.json()
			}
			// let decodedAccessToken: AccessToken = newSession.accessToken
			// 	? jwt_decode(newSession.accessToken)
			// 	: null

			let profileData = null,
				userData = null

			try {
				const profile = await fetch(
					`${env.baseApi || ''}/provider-profiles/provider/${uid || ''}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${newSession.accessToken}`
						}
					}
				)
				if (profile.status === 200) {
					profileData = await profile.json()
				}

				const userRes = await fetch(`${env.baseApi || ''}/customers/${uid || ''}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${newSession.accessToken}`
					}
				})

				if (userRes.status === 200) {
					userData = await userRes.json()
					providerData.set({ ...profileData, email: userData?.email?.address || '' })
				}
			} catch (err) {
				console.error('Error get profile: ', err)
				console.error('Error msg get profile: ', err.message)
			}

			return {
				props: {
					env,
					profileData,
					email: userData?.email?.address || '',
					newSession: renewResult && renewResult.accessToken ? newSession : null
				},
				stuff: {
					env,
					profileData,
					newSession: renewResult && renewResult.accessToken ? newSession : null
				}
			}
		}

		return {
			status: 302,
			redirect: '/accounts/logout'
		}
	}
</script> -->
<script lang="ts">
    import '$lib/tailwind.css'
    import { browser } from '$app/environment'
    import { isSideMenuOpen, closeSideMenu, isSideMenuExpand } from '$stores/menus'
    import { clickOutside } from '$lib/ioevents/click'
    import { keydownEscape } from '$lib/ioevents/keydown'
    import { navigating, page } from '$app/stores'
    import { sessionValue } from '$stores/auth'
    import SideBar from '$lib/layouts/SideBar.svelte'

    import Header from '$lib/layouts/Header.svelte'
    import PageLoader from '$lib/components/PageLoader.svelte'

    console.log('page:', $page)
    // export let env

    // $: if (
    // 	browser &&
    // 	$sessionValue &&
    // 	$sessionValue.accessToken &&
    // 	$sessionValue.accessToken !== $session.accessToken &&
    // 	$sessionValue.refreshToken !== $session.refreshToken &&
    // 	$sessionValue.expiryAt !== $session.expiryAt
    // ) {
    // 	$session.accessToken = $sessionValue.accessToken
    // 	$session.refreshToken = $sessionValue.refreshToken
    // 	$session.expiryAt = $sessionValue.expiryAt
    // }
</script>

xxx
<section id="body">
    <!-- {#if $page.route.id === '/accounts/login'}
        {#if $navigating}
            <PageLoader />
        {:else}
            <slot />
        {/if}
    {:else} -->
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900" class:overflow-hidden={$isSideMenuOpen}>
        <!-- Desktop sidebar -->

        <aside
            class="z-20 hidden {$isSideMenuExpand
                ? 'w-64'
                : 'w-16'} overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
            <!-- <SideBar isExpand={$isSideMenuExpand} /> -->
        </aside>

        <!-- Mobile sidebar -->
        <!-- Backdrop -->
        {#if $isSideMenuOpen}
            <div
                class="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center" />
            <aside
                class="fixed inset-y-0 z-20 flex-shrink-0 w-64 overflow-y-auto bg-white dark:bg-gray-800 md:hidden"
                use:clickOutside={['nav-mobile-hamburger']}
                on:click-outside={closeSideMenu}
                use:keydownEscape
                on:keydown-escape={closeSideMenu}>
                <!-- <SideBar isExpand {env} /> -->
            </aside>
        {/if}

        <div
            class="flex flex-col flex-1 w-full bg-cool-gray-50 dark:bg-gray-900"
            class:relative={$navigating}>
            <Header />

            {#if $navigating}
                <PageLoader />
            {:else}
                <slot />
            {/if}
        </div>
    </div>
    <!-- {/if} -->
</section>

<style>
    aside {
        transition: ease-out 200ms;
    }
</style>
