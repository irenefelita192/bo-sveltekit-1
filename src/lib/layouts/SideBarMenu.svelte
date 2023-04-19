<script lang="ts">
    import { onMount } from 'svelte'
    import { closeSideMenu, pageMenus, togglePageMenu } from '$stores/menus'
    import { page, session } from '$app/stores'
    import { goto } from '$app/navigation'
    import SideBarMenu from '$src/lib/layouts/SideBarMenu.svelte'
    import { fade } from 'svelte/transition'

    export let link
    export let hasChildren: boolean
    export let hasIcon: boolean = false
    export let isCollapse: boolean = false
    export let isChildren: boolean = false
    export let env
    export let token

    let boV2MenuID = env?.boV2MenuID?.split(','),
        boV1Domain = env?.boV1Domain

    export let isCollapseChildren: boolean = false
    let isOpenDropdown = false
    let activeMenu = $page.url.pathname,
        isActive = false,
        activeLink = link.action
    $: if (activeLink) {
        activeMenu = $page.url.pathname
        isActive = activeMenu == activeLink
        // console.log('$page.url.pathname', $page.url.pathname, ' isActive', isActive)
    }

    const toggleDropdownMenu = (linkName) => {
        togglePageMenu(linkName)
        isOpenDropdown = !isOpenDropdown
    }

    interface LinkInfo {
        id: number
        action: string
        externalUrl?: string
    }

    const handleRedirect = (link: LinkInfo) => {
        closeSideMenu()
        activeLink = link.action
        if (link.externalUrl) {
            window.location.href = `${link.externalUrl}`
        } else if (boV2MenuID.includes(link.id.toString())) {
            //v2
            goto(link.action)
        } else {
            //v1
            window.location.href = `${boV1Domain}${link.action}${token ? `?token=${token}` : ''}`
        }
    }

    export let linksIcon = {
        'Access Role': [
            'M6.5 11C6.5 11.2761 6.72386 11.5 7 11.5C7.27614 11.5 7.5 11.2761 7.5 11H6.5ZM7 7H6.5H7ZM12 2V1.5V2ZM16.5 11C16.5 11.2761 16.7239 11.5 17 11.5C17.2761 11.5 17.5 11.2761 17.5 11H16.5ZM5 11.5H19V10.5H5V11.5ZM19 11.5C19.8284 11.5 20.5 12.1716 20.5 13H21.5C21.5 11.6193 20.3807 10.5 19 10.5V11.5ZM20.5 13V20H21.5V13H20.5ZM20.5 20C20.5 20.8284 19.8284 21.5 19 21.5V22.5C20.3807 22.5 21.5 21.3807 21.5 20H20.5ZM19 21.5H5V22.5H19V21.5ZM5 21.5C4.17157 21.5 3.5 20.8284 3.5 20H2.5C2.5 21.3807 3.61929 22.5 5 22.5V21.5ZM3.5 20V13H2.5V20H3.5ZM3.5 13C3.5 12.1716 4.17157 11.5 5 11.5V10.5C3.61929 10.5 2.5 11.6193 2.5 13H3.5ZM7.5 11V7H6.5V11H7.5ZM7.5 7C7.5 5.80653 7.97411 4.66193 8.81802 3.81802L8.11091 3.11091C7.07946 4.14236 6.5 5.54131 6.5 7L7.5 7ZM8.81802 3.81802C9.66193 2.97411 10.8065 2.5 12 2.5V1.5C10.5413 1.5 9.14236 2.07946 8.11091 3.11091L8.81802 3.81802ZM12 2.5C13.1935 2.5 14.3381 2.97411 15.182 3.81802L15.8891 3.11091C14.8576 2.07946 13.4587 1.5 12 1.5V2.5ZM15.182 3.81802C16.0259 4.66193 16.5 5.80653 16.5 7H17.5C17.5 5.54131 16.9205 4.14236 15.8891 3.11091L15.182 3.81802ZM16.5 7V11H17.5V7H16.5Z',
        ],
        Master: [
            'M15.5 21C15.5 21.2761 15.7239 21.5 16 21.5C16.2761 21.5 16.5 21.2761 16.5 21H15.5ZM14 3V2.5V3ZM10 3V2.5V3ZM8 5H7.5H8ZM7.5 21C7.5 21.2761 7.72386 21.5 8 21.5C8.27614 21.5 8.5 21.2761 8.5 21H7.5ZM4 7.5H20V6.5H4V7.5ZM20 7.5C20.8284 7.5 21.5 8.17157 21.5 9H22.5C22.5 7.61929 21.3807 6.5 20 6.5V7.5ZM21.5 9V19H22.5V9H21.5ZM21.5 19C21.5 19.8284 20.8284 20.5 20 20.5V21.5C21.3807 21.5 22.5 20.3807 22.5 19H21.5ZM20 20.5H4V21.5H20V20.5ZM4 20.5C3.17157 20.5 2.5 19.8284 2.5 19H1.5C1.5 20.3807 2.61929 21.5 4 21.5V20.5ZM2.5 19V9H1.5V19H2.5ZM2.5 9C2.5 8.17157 3.17157 7.5 4 7.5V6.5C2.61929 6.5 1.5 7.61929 1.5 9H2.5ZM16.5 21V5H15.5V21H16.5ZM16.5 5C16.5 4.33696 16.2366 3.70107 15.7678 3.23223L15.0607 3.93934C15.342 4.22064 15.5 4.60218 15.5 5H16.5ZM15.7678 3.23223C15.2989 2.76339 14.663 2.5 14 2.5V3.5C14.3978 3.5 14.7794 3.65804 15.0607 3.93934L15.7678 3.23223ZM14 2.5H10V3.5H14V2.5ZM10 2.5C9.33696 2.5 8.70107 2.76339 8.23223 3.23223L8.93934 3.93934C9.22064 3.65804 9.60218 3.5 10 3.5V2.5ZM8.23223 3.23223C7.76339 3.70107 7.5 4.33696 7.5 5L8.5 5C8.5 4.60218 8.65804 4.22064 8.93934 3.93934L8.23223 3.23223ZM7.5 5V21H8.5V5H7.5Z',
        ],
        Customer: [
            'M8.4 13.7C8.23431 13.4791 7.92091 13.4343 7.7 13.6C7.47909 13.7657 7.43431 14.0791 7.6 14.3L8.4 13.7ZM16.4 14.3C16.5657 14.0791 16.5209 13.7657 16.3 13.6C16.0791 13.4343 15.7657 13.4791 15.6 13.7L16.4 14.3ZM9 8.5C8.72386 8.5 8.5 8.72386 8.5 9C8.5 9.27614 8.72386 9.5 9 9.5V8.5ZM9.01 9.5C9.28614 9.5 9.51 9.27614 9.51 9C9.51 8.72386 9.28614 8.5 9.01 8.5V9.5ZM15 8.5C14.7239 8.5 14.5 8.72386 14.5 9C14.5 9.27614 14.7239 9.5 15 9.5V8.5ZM15.01 9.5C15.2861 9.5 15.51 9.27614 15.51 9C15.51 8.72386 15.2861 8.5 15.01 8.5V9.5ZM21.5 12C21.5 17.2467 17.2467 21.5 12 21.5V22.5C17.799 22.5 22.5 17.799 22.5 12H21.5ZM12 21.5C6.75329 21.5 2.5 17.2467 2.5 12H1.5C1.5 17.799 6.20101 22.5 12 22.5V21.5ZM2.5 12C2.5 6.75329 6.75329 2.5 12 2.5V1.5C6.20101 1.5 1.5 6.20101 1.5 12H2.5ZM12 2.5C17.2467 2.5 21.5 6.75329 21.5 12H22.5C22.5 6.20101 17.799 1.5 12 1.5V2.5ZM8 14C7.6 14.3 7.60012 14.3002 7.60025 14.3003C7.6003 14.3004 7.60044 14.3006 7.60054 14.3007C7.60074 14.301 7.60097 14.3013 7.60122 14.3016C7.60172 14.3023 7.60231 14.3031 7.603 14.304C7.60438 14.3058 7.60612 14.3081 7.60825 14.3108C7.61249 14.3163 7.61822 14.3237 7.62543 14.3328C7.63985 14.351 7.6602 14.3762 7.68635 14.4074C7.73862 14.4697 7.8143 14.556 7.91244 14.6585C8.10833 14.8629 8.39609 15.1336 8.76841 15.4044C9.51113 15.9445 10.6122 16.5 12 16.5V15.5C10.8878 15.5 9.98887 15.0555 9.35659 14.5956C9.04141 14.3664 8.79792 14.1371 8.63443 13.9665C8.55289 13.8815 8.49185 13.8116 8.45232 13.7645C8.43258 13.741 8.41825 13.7232 8.40948 13.7121C8.40509 13.7066 8.4021 13.7027 8.40051 13.7007C8.39972 13.6996 8.39928 13.699 8.39919 13.6989C8.39915 13.6989 8.3992 13.6989 8.39933 13.6991C8.3994 13.6992 8.39949 13.6993 8.3996 13.6995C8.39965 13.6995 8.39975 13.6997 8.39978 13.6997C8.39989 13.6999 8.4 13.7 8 14ZM12 16.5C13.3878 16.5 14.4889 15.9445 15.2316 15.4044C15.6039 15.1336 15.8917 14.8629 16.0876 14.6585C16.1857 14.556 16.2614 14.4697 16.3137 14.4074C16.3398 14.3762 16.3601 14.351 16.3746 14.3328C16.3818 14.3237 16.3875 14.3163 16.3918 14.3108C16.3939 14.3081 16.3956 14.3058 16.397 14.304C16.3977 14.3031 16.3983 14.3023 16.3988 14.3016C16.399 14.3013 16.3993 14.301 16.3995 14.3007C16.3996 14.3006 16.3997 14.3004 16.3997 14.3003C16.3999 14.3002 16.4 14.3 16 14C15.6 13.7 15.6001 13.6999 15.6002 13.6997C15.6002 13.6997 15.6003 13.6995 15.6004 13.6995C15.6005 13.6993 15.6006 13.6992 15.6007 13.6991C15.6008 13.6989 15.6009 13.6989 15.6008 13.6989C15.6007 13.699 15.6003 13.6996 15.5995 13.7007C15.5979 13.7027 15.5949 13.7066 15.5905 13.7121C15.5817 13.7232 15.5674 13.741 15.5477 13.7645C15.5082 13.8116 15.4471 13.8815 15.3656 13.9665C15.2021 14.1371 14.9586 14.3664 14.6434 14.5956C14.0111 15.0555 13.1122 15.5 12 15.5V16.5ZM9 9.5H9.01V8.5H9V9.5ZM15 9.5H15.01V8.5H15V9.5Z',
        ],
        Report: [
            'M23 6H23.5C23.5 5.72386 23.2761 5.5 23 5.5V6ZM13.5 15.5L13.1464 15.8536C13.3417 16.0488 13.6583 16.0488 13.8536 15.8536L13.5 15.5ZM8.5 10.5L8.85355 10.1464C8.65829 9.95118 8.34171 9.95118 8.14645 10.1464L8.5 10.5ZM0.646447 17.6464C0.451184 17.8417 0.451184 18.1583 0.646447 18.3536C0.841709 18.5488 1.15829 18.5488 1.35355 18.3536L0.646447 17.6464ZM17 5.5C16.7239 5.5 16.5 5.72386 16.5 6C16.5 6.27614 16.7239 6.5 17 6.5V5.5ZM22.5 12C22.5 12.2761 22.7239 12.5 23 12.5C23.2761 12.5 23.5 12.2761 23.5 12H22.5ZM22.6464 5.64645L13.1464 15.1464L13.8536 15.8536L23.3536 6.35355L22.6464 5.64645ZM13.8536 15.1464L8.85355 10.1464L8.14645 10.8536L13.1464 15.8536L13.8536 15.1464ZM8.14645 10.1464L0.646447 17.6464L1.35355 18.3536L8.85355 10.8536L8.14645 10.1464ZM17 6.5H23V5.5H17V6.5ZM22.5 6V12H23.5V6H22.5Z',
        ],
    }

    $: childLiClass = hasIcon ? 'px-5 py-3' : 'py-1'
    $: childTitleClass = hasIcon ? 'ml-4' : 'ml-9'

    const fadeIn = {
        delay: 100,
        duration: 200,
    }

    const fadeOut = {
        delay: 0,
        duration: 100,
    }
</script>

<!-- on:mouseleave={() => (!isCollapseChildren && isCollapse ? toggleDropdownMenu(link.name) : {})} -->
{#if hasChildren}
    <li
        on:mouseenter={() =>
            !isCollapseChildren && isCollapse ? toggleDropdownMenu(link.name) : {}}
        on:mouseleave={() =>
            !isCollapseChildren && isCollapse ? toggleDropdownMenu(link.name) : {}}
        class="{!isCollapseChildren && isCollapse ? 'cursor-pointer' : ''} {isOpenDropdown
            ? ''
            : 'relative'} {childLiClass} {isCollapseChildren ? 'px-5 pt-3' : ''}">
        {#if isOpenDropdown && isCollapse}
            <div class="absolute -mt-1 left-16 bg-white border rounded shadow-md">
                {#if $pageMenus[link.name]}
                    <ul
                        class=" mb-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 dark:text-gray-400"
                        aria-label="submenu">
                        {#each link.children as sublink, c}
                            <SideBarMenu
                                isCollapseChildren
                                {env}
                                hasChildren={sublink.children && sublink.children.length > 0}
                                link={sublink}
                                {token} />
                        {/each}
                    </ul>
                {/if}
            </div>
        {/if}
        <button
            on:click={() => togglePageMenu(link.name)}
            class="inline-flex items-center justify-between w-full text-sm transition-colors duration-150 hover:text-vida-green-400 dark:hover:text-gray-200"
            aria-haspopup="true">
            {#if hasIcon}
                <span class="inline-flex items-center">
                    {#if linksIcon[link.name] && linksIcon[link.name].length > 0 && hasIcon}
                        <svg
                            class="w-5 h-5"
                            aria-hidden="true"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            {#each linksIcon[link.name] as s, b}
                                <path d={s} />
                            {/each}
                        </svg>
                    {:else if hasIcon}
                        <svg
                            class="w-5 h-5"
                            aria-hidden="true"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                d={'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'} />
                        </svg>
                    {/if}
                    {#if !isCollapse}
                        <span
                            in:fade={isCollapseChildren || isChildren ? { duration: 0 } : fadeIn}
                            out:fade={isCollapseChildren || isChildren ? { duration: 0 } : fadeOut}
                            class="ml-4 whitespace-nowrap">{link.name}</span
                        >{/if}
                </span>
                {#if !isCollapse}
                    <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                {/if}
            {:else}
                {#if !isCollapse}<span class={isCollapseChildren ? '' : childTitleClass}
                        >{link.name}</span
                    >{/if}
                <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                </svg>
            {/if}
        </button>
    </li>
    {#if $pageMenus[link.name] && !isCollapse}
        <ul
            class="px-5 mb-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 dark:text-gray-400"
            aria-label="submenu">
            {#each link.children as sublink, c}
                <SideBarMenu
                    isChildren
                    {env}
                    hasChildren={sublink.children && sublink.children.length > 0}
                    link={sublink}
                    {token} />
            {/each}
        </ul>
    {/if}
{:else}
    <li class="relative px-5 py-3">
        <a
            class="inline-flex items-center w-full text-sm transition-colors duration-150 font-normal text-gray-500 hover:text-vida-green-400 dark:hover:text-gray-200 cursor-pointer"
            class:text-vida-green-400={isActive}
            class:dark:text-gray-100={isActive}
            href={link.url}
            on:click={(e) => {
                e.preventDefault()
                handleRedirect(link)
            }}>
            {#if !isCollapse} <span class={isCollapseChildren ? '' : 'ml-4'}>{link.name}</span>{/if}
        </a>
    </li>
{/if}
