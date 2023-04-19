<script lang="ts">
    import {
        isDark,
        isNotificationsMenuOpen,
        isProfileMenuOpen,
        toggleTheme,
        toggleSideMenu,
        pageMenus,
        toggleExpandSideMenu,
        toggleNotificationsMenu,
        toggleProfileMenu,
        closeNotificationsMenu,
        closeProfileMenu,
    } from '$stores/menus'
    import { clickOutside } from '$lib/ioevents/click'
    import { keydownEscape } from '$lib/ioevents/keydown'

    function onToggleExpand() {
        pageMenus.set([])
        toggleExpandSideMenu()
    }
</script>

<header class="z-19 py-7 bg-white shadow-md dark:bg-gray-800">
    <button
        id="nav-hamburger"
        class="absolute top-4 pt-0.5 mr-5 ml-2 focus:outline-none md:block hidden"
        on:click={() => onToggleExpand()}
        aria-label="Menu">
        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd" />
        </svg>
    </button>
    <div class="container flex items-center justify-between h-full px-6 mx-auto">
        <!-- Mobile hamburger -->
        <button
            id="nav-mobile-hamburger"
            class="absolute left-2 top-4 pt-0.5 mr-5 ml-2 focus:outline-none block md:hidden"
            on:click={toggleSideMenu}
            aria-label="Menu">
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</header>
