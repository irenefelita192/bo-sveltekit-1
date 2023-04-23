<!-- <script context="module">
    import CryptoJS from 'crypto-js'
    let scrt = 'bovida'
    export async function load({ url, params, fetch, session, stuff }) {
        const token = url?.searchParams?.get('token') ?? '',
            referer = url?.searchParams?.get('referer') ?? ''

        let credential = ''

        let env
        const readEnv = await fetch(`/auth/readEnv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (readEnv.status === 200) {
            env = await readEnv.json()
        }

        if (token) {
            // console.log('token login', token)
            const decoded = decodeURIComponent(token)

            let bytes
            try {
                bytes = CryptoJS.AES.decrypt(decoded, 'bovida')
                credential = bytes ? bytes.toString(CryptoJS.enc.Utf8) : ''
            } catch (err) {
                console.error('Token error:', err)
                // return {
                //     // status: 302,
                //     // redirect: '/accounts/logout',
                // }
            }
        }

        return {
            props: {
                clientID: env.googleClientID,
                credential,
                referer,
            },
        }
    }
</script> -->
<script lang="ts">
    interface ServerData {
        credentialKey: string
        clientID: string
    }
    import CryptoJS from 'crypto-js'
    import { onMount } from 'svelte'
    import jwt_decode from 'jwt-decode'
    //   import { session } from "$app/stores";
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'

    let googleUrl = 'https://accounts.google.com/gsi/client'
    import { post } from '$lib/utils/fetch'

    export let credential: string

    console.log('kes isnisis')
    export let referer: string
    export let data: ServerData
    //@ts-check
    // export let location;
    let gsiReady = false
    let mounted = false
    onMount(async () => {
        console.log('page sss:', $page)
        loadAuth()
        // mounted = true
        // console.log('kesini')
        // if (gsiReady) {
        //     loadAuth()
        // }

        if (credential) {
            // console.log('onmount credential', credential)
            getAccess({ credential, isByPass: true })
        }
    })
    let loginTimeout: number

    function loadAuth() {
        //         @googleapis/oauth2
        // -D @types/google.accounts
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: data.clientID, //'160188974421-j5iaiku1jf583neaocpj2s2m6jva0cf7.apps.googleusercontent.com',
                callback: onCredentialResponse,
                // login_uri: 'http://localhost:90/accounts/login',
                context: 'signin',
                ux_mode: 'popup',
            })
            // google.accounts.id.prompt();

            const googleBtnEl = document.getElementById('google-button')
            google.accounts.id.renderButton(googleBtnEl, {
                type: 'standard',
                theme: 'filled_blue',
                size: 'large',
                text: 'signin_with',
                width: googleBtnEl?.clientWidth,
                locale: 'en-US',
            })
        } else {
            // console.log('loginTimeout', loginTimeout)
            if (loginTimeout) {
                clearTimeout(loginTimeout)
            }
            setTimeout(loadAuth, 500)
        }
    }

    interface GoogleCredentialResponse {
        credential: string
    }

    interface ResponsePayload {
        given_name: string
        family_name: string
        email: string
        picture: string
    }

    // function getAccess(credential): Promise<AccessObject> {
    //     return post(`/auth/login`, { token: credential }).then((res) => { return res as AccessObject})
    // }

    interface AccessData {
        credential: string
        isByPass: boolean
    }

    async function getAccess(accessData: AccessData) {
        const sid = await post(`/api/login`, {
            token: accessData.credential,
        })
        // const result = accessObj.json()
        console.log('accesssidObj', sid)

        if (sid) {
            const responsePayload: ResponsePayload = jwt_decode(accessData.credential)

            const chpTkn = CryptoJS.AES.encrypt(
                accessData.credential,
                data.credentialKey
            ).toString()

            const userData: UserData = {
                firstName: responsePayload.given_name,
                lastName: responsePayload.family_name,
                email: responsePayload.email,
                imageUrl: responsePayload.picture,
                credential: chpTkn,
                isByPass: accessData.isByPass,
            }

            try {
                localStorage.setItem('uac', JSON.stringify(userData))
            } catch (e) {
                console.log('error', e)
            }

            // $session.accessToken = accessObj.accessToken;
            // try {
            //   $session.uid = jwt_decode(accessObj?.accessToken || "")?.ID;
            // } catch (err) {
            //   console.error("Error parsing token");
            //   $session.uid = "";
            // }
            // $session.refreshToken = accessObj.refreshToken;
            // $session.expiryAt = accessObj.expiryAt;
            goto('/welcome')
            if (referer && referer.indexOf('logout') == -1) {
                goto(referer)
            }
        }
    }

    async function onCredentialResponse(response: GoogleCredentialResponse) {
        const result = await getAccess({ credential: response.credential, isByPass: false })
        console.log('result', result)
        // const accessObj = await post(`/auth/login`, { token: response.credential })

        // if (accessObj && accessObj.accessToken) {
        //     const responsePayload: ResponsePayload = jwt_decode(response.credential)

        //     const userData: UserData = {
        //         firstName: responsePayload.given_name,
        //         lastName: responsePayload.family_name,
        //         email: responsePayload.email,
        //         imageUrl: responsePayload.picture,
        //         credential: response.credential,
        //     }

        //     try {
        //         localStorage.setItem('uac', JSON.stringify(userData))
        //     } catch (e) {
        //         console.log('error', e)
        //     }

        //     $session.accessToken = accessObj.accessToken
        //     $session.uid = jwt_decode(accessObj.accessToken).ID
        //     $session.refreshToken = accessObj.refreshToken
        //     $session.expiryAt = accessObj.expiryAt
        //     // goto('/')
        // }
        // }
    }

    // function onLoaded() {
    //     console.log('onloaded', mounted)
    //     gsiReady = true
    //     if (mounted) {
    //         loadAuth()
    //     }
    // }
</script>

<svelte:head>
    <script src={googleUrl}></script>
</svelte:head>

<main>
    <section
        class="relative w-full h-full py-40 min-h-screen flex flex-auto justify-center items-center">
        <div class="w-72">
            <h5 class="text-center mb-2 text-gray-600 font-semibold">Sign in to Vida Backoffice</h5>
            <div class="w-full" id="google-button" />
        </div>
    </section>
</main>
