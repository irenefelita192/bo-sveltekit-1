<!-- <script context="module">
    export function load({ session }) {
        const { accessToken } = session

        if (!accessToken) {
            return {
                status: 302,
                redirect: '/accounts/logout',
            }
        }

        return {}
    }
</script> -->

<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    // import { session } from '$app/stores'
    import { goto } from '$app/navigation'
    import { getTreemenus } from '$lib/api/treemenus'
    import { treemenus } from '$stores/treemenus'
    import { userRoles } from '$stores/permissions'
    import {
        isDark,
        isNotificationsMenuOpen,
        isProfileMenuOpen,
        toggleTheme,
        toggleProfileMenu,
        closeNotificationsMenu,
        closeProfileMenu,
    } from '$stores/menus'
    // import { post } from '$lib/utils'
    import { clickOutside } from '$lib/ioevents/click'
    import { keydownEscape } from '$lib/ioevents/keydown'
    import SideBarMenu from '$lib/layouts/SideBarMenu.svelte'
    // import { getUserData } from '$lib/userAuth'

    export let env

    export let isExpand: boolean = false
    let menus:any,
        // userData: UserData = getUserData(),
        userName = `${userData?.firstName ?? ''} ${userData?.lastName ?? ''}`,
        token = ''
    const pkg = __PACKAGE__,
        version = pkg.version

    onMount(() => {
        if (userData && !userData.isByPass) {
            token = encodeURIComponent(userData?.credential)
        }
    })

    // $: if ($treemenus.meta.status === 'loading') {
    //     getTreemenus({ session: $session, baseEndpoint: env?.baseEndpoint || '' })
    // }

    const unsubscribe = treemenus.subscribe((value) => {
        menus = value
    })
    onDestroy(unsubscribe)

    async function logout() {
        goto('/accounts/logout')
    }
</script>

<div
    class="flex flex-col h-full {isExpand ? 'py-4' : 'pt-2 pb-4'} text-gray-500 dark:text-gray-400">
    <a
        class="transition ease-out duration-200 h-10 flex {isExpand
            ? 'ml-6'
            : 'collapse mx-3'} text-vida-brown-200 items-end"
        href="/">
        <img src="/images/vida-logo.svg" alt="Vida Backoffice" />
        {#if isExpand}<span class="text-2xl font-semibold mb-1">Backoffice</span>{/if}
    </a>

    <ul class="my-6 {isExpand ? '' : 'pt-2'}">
        {#if menus}
            {#if menus.meta.status === 'success'}
                {#each menus.data as link, i}
                    {#if link.children && link.children.length > 0}
                        <!-- <SideBarMenu
                            isCollapse={!isExpand}
                            hasIcon={true}
                            hasChildren={true}
                            {link}
                            {env}
                            {token} /> -->
                    {:else}
                        <!-- <SideBarMenu
                            isCollapse={!isExpand}
                            hasChildren={false}
                            {link}
                            {env}
                            {token} /> -->
                    {/if}
                {/each}
            {:else if menus.meta.status === 'loading'}
                <div class={'loading-wrapper'}>
                    <div class={'loading-card loading-100'} />
                    <div class={'loading-card loading-80'} />
                    <div class={'loading-card loading-40'} />
                    <div class={'loading-card loading-60'} />
                </div>
            {/if}
        {/if}
    </ul>

    <div
        on:mouseenter={() => (!isExpand ? toggleProfileMenu() : {})}
        on:mouseleave={() => (!isExpand ? toggleProfileMenu() : {})}
        class="mt-auto  mb-5 {isExpand
            ? 'relative mx-5 px-2 py-2 border rounded-sm'
            : 'flex cursor-pointer'}">
        {#if isExpand}
            <button
                id="nav-profile-photo"
                class="profile-container rounded-full focus:shadow-outline-purple focus:outline-none"
                on:click={toggleProfileMenu}
                use:keydownEscape
                on:keydown-escape={closeProfileMenu}
                aria-label="Account"
                aria-haspopup="true">
                <div class="profile-image">
                    <img
                        class="object-contain w-10 h-10 rounded-full"
                        src={'/images/profile-placeholder.svg'}
                        alt=""
                        aria-hidden="true" />
                </div>
                <div class="text-left font-semibold text-sm pr-6">
                    {userData?.fullName || userName}
                </div>
                <div class="text-left text-xs capitalize">
                    {($userRoles && $userRoles.length > 0 && $userRoles[0].name) || ''}
                </div>
                <div class="absolute right-2">
                    <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </button>
        {:else}
            <div class="collapse profile-image px-4">
                <img
                    class="object-contain w-10 h-10 rounded-full"
                    src={'/images/profile-placeholder.svg'}
                    alt=""
                    aria-hidden="true" />
            </div>
        {/if}
        {#if $isProfileMenuOpen}
            <div class="absolute z-30 {isExpand ? 'right-0 bottom-full space-y-2' : ' left-16'}">
                <ul
                    use:clickOutside={['nav-profile-photo']}
                    on:click-outside={closeProfileMenu}
                    use:keydownEscape
                    on:keydown-escape={closeProfileMenu}
                    class="w-56 p-2 mb-2 text-gray-600 bg-white border border-gray-100 rounded shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
                    aria-label="submenu">
                    <!-- <li class="flex">
                    <div class="w-full px-2 py-1 ">
                        <button
                            class="inline-flex items-center text-sm font-semibold rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer"
                            on:click={toggleTheme}
                            aria-label="Toggle color mode">
                            {#if $isDark}
                                <svg
                                    class="w-4 h-4 mr-3"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                                </svg>
                                <span>Dark theme</span>
                            {:else}
                                <svg
                                    class="w-4 h-4 mr-3"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                                <span>Light theme</span>
                            {/if}
                        </button>
                    </div>
                </li> -->
                    <li class="flex">
                        <div
                            class="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer"
                            on:click={logout}>
                            <svg
                                class="w-4 h-4 mr-3"
                                aria-hidden="true"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span>Log out</span>
                        </div>
                    </li>
                </ul>
            </div>
        {/if}
    </div>
    <div class="version px-5 text-cool-gray-400">{version}</div>
</div>

<style>
    .loading-wrapper {
        padding: 0.5rem 1.5rem;
    }

    .loading-card {
        animation-duration: 3.6s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        animation-name: lightShimmerAnimation;
        height: 1.3rem;
        border-radius: 0.5rem;
        overflow: hidden;
        margin-bottom: 1.5rem;
    }

    .loading-100 {
        width: 100%;
    }

    .loading-80 {
        width: 80%;
    }

    .loading-60 {
        width: 60%;
    }

    .loading-40 {
        width: 40%;
    }

    @keyframes lightShimmerAnimation {
        from {
            background-color: rgba(165, 165, 165, 0.1);
        }

        25% {
            background-color: rgba(0, 0, 0, 0.3);
        }

        50% {
            background-color: rgba(165, 165, 165, 0.1);
        }

        to {
            background-color: rgba(165, 165, 165, 0.1);
        }
    }

    .profile-container {
        display: grid;
        width: 100%;
        grid-template-columns: 18% 80%;
        grid-column-gap: 0.7rem;
        align-items: center;
    }

    .profile-image {
        grid-row: span 2;
    }

    @keyframes fade {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    .collapse {
        animation: fade 700ms ease-in-out;
    }

    .version {
        font-size: 0.625rem;
    }
</style>
