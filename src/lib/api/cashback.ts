// import { get as getStore } from 'svelte/store'
// import { session } from '$app/stores'
import { dataList, submitListStatus } from '$stores/data'
import { sessionValue } from '$stores/auth'

import { doRenewToken } from '$lib/userAuth'
import { flattenObject } from '$src/lib/dataUtils'

let payloadList: PayloadList = {
    meta: {
        status: 'loading',
        error: '',
        totalData: 1,
    },
    data: [],
}

export function reset() {
    payloadList.meta.status = 'loading'
    payloadList.meta.error = ''
    payloadList.data = []
    dataList.set(payloadList)
}

const ERR_MESSAGE = {
    ERROR_MESS_NO_BANK_ACCOUNT: 'No bank account',
    ERROR_MESS_NOT_OUTSTANDING: 'Cashback status is not outstanding',
    ERROR_MESS_NOT_IN_PROGRESS: 'Cashback status is not in progress',
}
let controllerDataList

export async function getDataList({ slug, session, allstatus = null, baseEndpoint }) {
    reset()

    if (typeof controllerDataList !== typeof undefined) {
        controllerDataList.abort()
    }

    controllerDataList = new AbortController()

    const { accessToken, refreshToken, expiryAt } = session
    let newSession = { accessToken, refreshToken, expiryAt }
    const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
    if (renewResult && renewResult.accessToken) {
        newSession = renewResult
        sessionValue.set({ ...newSession })
    }

    // const accessToken =
    //     'eyJhbGciOiJIUzI1NiIsImtpZCI6InNlY3JldC1pZCIsInR5cCI6IkpXVCJ9.eyJFeHRlbnNpb25zIjpudWxsLCJHcm91cHMiOm51bGwsIklEIjoiQUY5QUEwIiwiTmFtZSI6IiIsImF1ZCI6WyIiXSwiZXhwIjoxNjQ5ODUyMDY4LCJpYXQiOjE2NDk4NDg0NjgsIm5iZiI6MTY0OTg0ODQ2OCwic3ViIjoiQUY5QUEwIn0.n0tNxZV9wJ3meXI6Ybqyw6nmN7GaRtBP0IoMNs_0oZM'
    const cleanSlug = slug.indexOf('/') == 0 ? slug.substring(1) : slug
    const qsAllStatus = allstatus ? '?allstatus=1' : ''

    try {
        const response = await fetch(`${baseEndpoint}/${cleanSlug}${qsAllStatus}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${newSession.accessToken}`,
            },
            signal: controllerDataList.signal,
        })

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json()

                let paymentData = []
                const responsePayment = await fetch(`${baseEndpoint}/promos/cashbacks/payments`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${newSession.accessToken}`,
                    },
                    signal: controllerDataList.signal,
                })

                if (responsePayment.status === 200) {
                    paymentData = await responsePayment.json()
                }

                payloadList.meta.status = 'success'
                payloadList.meta.slug = slug

                let list = []

                // if (data.id) {
                //     list.push(flattenObject(data))
                // } else {
                data &&
                    data.map((dt) => {
                        const relatedPayment = paymentData.find(
                            (item) =>
                                item.cashbacks &&
                                item.cashbacks.length > 0 &&
                                item.cashbacks[0].id == dt.id
                        )

                        dt.paymentId = relatedPayment?.id || ''
                        list.push(flattenObject(dt))
                    })
                // }

                payloadList.meta.totalData = list.length
                payloadList.data = [...list]
                dataList.set(payloadList)
            } else if (response.status === 204) {
                payloadList.meta.status = 'no-content'
                payloadList.data = []
                dataList.set(payloadList)
            }
        }
    } catch (err) {
        payloadList.meta.status = 'error'
        payloadList.meta.error = 'Error list: ' + err
        payloadList.data = []
        dataList.set(payloadList)
    }
}

export async function getPolicyStatus({ list, session, baseEndpoint }) {
    const { accessToken, refreshToken, expiryAt } = session
    let newSession = { accessToken, refreshToken, expiryAt }
    const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
    if (renewResult && renewResult.accessToken) {
        newSession = renewResult
        sessionValue.set({ ...newSession })
    }
    let listStatus = {}
    const processList = list.map(async (item) => {
        try {
            const response = await fetch(
                // `${baseEndpoint}/customers/${item.customerId}`,
                `${baseEndpoint}/policies/owner/${item.customerId}?limit=1&offset=0&sort=desc&policyStatus=1`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${newSession.accessToken}`,
                    },
                }
            )

            if (response.status === 200) {
                const data = await response.json()
                listStatus[item.customerId] = data.length > 0
            } else {
                listStatus[item.customerId] = false
            }
        } catch (err) {
            listStatus[item.customerId] = null
        }
    })

    await Promise.all(processList)

    return listStatus
}

export async function proceedPayment({ list, retryList = [], session, baseEndpoint }) {
    const isRetry = retryList.length > 0
    submitListStatus.set({
        status: 'loading',
        error: '',
        list: isRetry ? retryList : [],
    })
    const { accessToken, refreshToken, expiryAt } = session
    let newSession = { accessToken, refreshToken, expiryAt }
    const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
    if (renewResult && renewResult.accessToken) {
        newSession = renewResult
        sessionValue.set({ ...newSession })
    }
    let listStatus = [],
        hasFailed = false

    const submitList = isRetry ? retryList : list

    const processList = submitList.map(async (item) => {
        if ((isRetry && item.status === 'failed') || !isRetry) {
            try {
                const response = await fetch(
                    // `${baseEndpoint}/customers/${item.customerId}`,
                    `${baseEndpoint}/promos/cashbacks/payments`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${newSession.accessToken}`,
                        },
                        body: JSON.stringify({
                            cashbackIds: [item.id],
                        }),
                    }
                )

                if (response.status === 201) {
                    listStatus.push({ id: item.id, customerId: item.id, status: 'success' })
                } else {
                    const result = await response.json()
                    let errorText =
                        result && result.error ? ERR_MESSAGE[result.error] : 'Something wrong'

                    hasFailed = true
                    listStatus.push({
                        id: item.id,
                        status: 'failed',
                        error: errorText,
                    })
                }
            } catch (err) {
                hasFailed = true
                listStatus.push({
                    id: item.id,
                    status: 'failed',
                    error: err.message,
                })
            }
        } else {
            listStatus.push({ id: item.id, status: 'success' })
        }
    })

    await Promise.all(processList)

    submitListStatus.set({
        status: hasFailed ? 'error' : 'success',
        error: '',
        list: [...listStatus],
    })

    return listStatus
}

export async function markAsPaid({ list, retryList = [], session, baseEndpoint }) {
    const isRetry = retryList.length > 0
    submitListStatus.set({
        status: 'loading',
        error: '',
        list: isRetry ? retryList : [],
    })
    const { accessToken, refreshToken, expiryAt } = session
    let newSession = { accessToken, refreshToken, expiryAt }
    const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
    if (renewResult && renewResult.accessToken) {
        newSession = renewResult
        sessionValue.set({ ...newSession })
    }

    let listStatus = [],
        hasFailed = false

    const submitList = isRetry ? retryList : list

    const processList = submitList.map(async (item) => {
        if ((isRetry && item.status === 'failed') || !isRetry) {
            if (item.paymentId) {
                try {
                    const response = await fetch(
                        // `${baseEndpoint}/customers/${item.customerId}`,
                        `${baseEndpoint}/promos/cashbacks/payments/${item.paymentId}/pay`,
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${newSession.accessToken}`,
                            },
                        }
                    )

                    if (response.status === 201) {
                        listStatus.push({
                            id: item.id,
                            paymentId: item.paymentId,
                            status: 'success',
                        })
                    } else {
                        const result = await response.json()

                        let errorText =
                            result && result.error ? ERR_MESSAGE[result.error] : 'Something wrong'

                        hasFailed = true
                        listStatus.push({
                            id: item.id,
                            paymentId: item.paymentId,
                            status: 'failed',
                            error: errorText,
                        })
                    }
                } catch (err) {
                    hasFailed = true
                    listStatus.push({
                        id: item.id,
                        paymentId: item.paymentId,
                        status: 'failed',
                        error: err.message,
                    })
                }
            } else {
                hasFailed = true
                listStatus.push({
                    id: item.id,
                    paymentId: item.paymentId,
                    status: 'failed',
                    error: 'Cashback status is not in progress',
                })
            }
        } else {
            listStatus.push({ id: item.id, paymentId: item.paymentId, status: 'success' })
        }
    })

    await Promise.all(processList)
    submitListStatus.set({
        status: hasFailed ? 'error' : 'success',
        error: '',
        list: [...listStatus],
    })

    return listStatus
}
