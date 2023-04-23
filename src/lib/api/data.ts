// // import { get as getStore } from 'svelte/store'
// // import { session } from '$app/stores'
// import { dataList, masterDataList, dataDetail, submitStatus, downloadStatus } from '$stores/data'
// import { sessionValue } from '$stores/auth'
// import { config } from '$lib/variables'
// import { doRenewToken } from '$lib/userAuth'
// import { flattenObject } from '$src/lib/dataUtils'

// let payloadList: PayloadList = {
//     meta: {
//         status: 'loading',
//         error: '',
//         totalData: 1,
//     },
//     data: [],
// }

// export function reset() {
//     payloadList.meta.status = 'loading'
//     payloadList.meta.error = ''
//     payloadList.data = []
//     dataList.set(payloadList)
// }

// let controllerDataList, controllerDataCount, controllerDataDetail
// const getDataCount = async ({
//     slug,
//     filterDate = '',
//     search = '',
//     accessToken,
//     allstatus = '',
//     filterURLParam = '',
//     baseEndpoint,
// }) => {
//     if (typeof controllerDataCount !== typeof undefined) {
//         controllerDataCount.abort()
//     }

//     controllerDataCount = new AbortController()

//     let countData = 1
//     try {
//         const response = await fetch(
//             `${baseEndpoint}/${slug}?getcount=true${filterDate}${search}${allstatus}${filterURLParam}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 signal: controllerDataCount.signal,
//             }
//         )

//         if (response.ok) {
//             const data = await response.json()
//             countData = data.count
//         }
//     } catch (err) {
//         console.error('error get count:', err.message)
//     }

//     return countData
// }

// export async function getDataList({
//     slug,
//     searchField = '',
//     searchKey = '',
//     page = 1,
//     startDate = '',
//     endDate = '',
//     sort = 'desc',
//     pageSize = 10,
//     slugOriginal = '',
//     session,
//     allstatus = null,
//     filterURLParam = null,
//     baseEndpoint,
// }) {
//     reset()

//     if (typeof controllerDataList !== typeof undefined) {
//         controllerDataList.abort()
//     }

//     controllerDataList = new AbortController()

//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     const cleanSlug = slug.indexOf('/') == 0 ? slug.substring(1) : slug

//     const qsFilterDate = startDate && endDate ? `&startdate=${startDate}&enddate=${endDate}` : '',
//         qsSearch =
//             searchField && searchKey ? `&searchfield=${searchField}&searchkey=${searchKey}` : '',
//         qsAllStatus = allstatus ? '&allstatus=1' : '',
//         qsfilterURLParam = filterURLParam ? `&${filterURLParam}` : ''

//     let totalData = await getDataCount({
//         slug: cleanSlug,
//         filterDate: qsFilterDate,
//         search: qsSearch,
//         accessToken: newSession.accessToken,
//         allstatus: qsAllStatus,
//         filterURLParam: qsfilterURLParam,
//         baseEndpoint,
//     })

//     const offset = (page - 1) * pageSize,
//         qsPaging = `&limit=${pageSize}&offset=${offset}`

//     // const at = userResponse.accessToken
//     // console.log('newAccessObj', newAccessObj)
//     try {
//         const response = await fetch(
//             `${baseEndpoint}/${cleanSlug}?sort=${sort}${qsPaging}${qsFilterDate}${qsSearch}${qsAllStatus}${qsfilterURLParam}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${newSession.accessToken}`,
//                 },
//                 signal: controllerDataList.signal,
//             }
//         )

//         if (response.status === 200) {
//             const data = await response.json()
//             payloadList.meta.status = 'success'
//             if (slugOriginal) payloadList.meta.slug = slugOriginal
//             payloadList.meta.totalData = totalData || 1

//             let list = []

//             if (data.id) {
//                 list.push(flattenObject(data))
//             } else {
//                 data &&
//                     data.map((dt) => {
//                         list.push(flattenObject(dt))
//                     })
//             }
//             payloadList.data = [...list]
//             dataList.set(payloadList)
//         } else if (response.status === 204) {
//             payloadList.meta.status = 'no-content'
//             payloadList.data = []
//             dataList.set(payloadList)
//         }
//     } catch (err) {
//         if (err.message.indexOf('aborted')) {
//             payloadList.meta.status = 'loading'
//             payloadList.meta.error = ''
//             payloadList.data = []
//         } else {
//             payloadList.meta.status = 'error'
//             payloadList.meta.error = 'Error list: ' + err
//             payloadList.data = []
//         }
//         dataList.set(payloadList)
//     }
// }

// let payloadDetail: Payload = {
//     meta: {
//         status: 'loading',
//         error: '',
//     },
//     data: null,
// }

// export function resetDetail() {
//     payloadDetail.meta.status = 'loading'
//     payloadDetail.meta.error = ''
//     payloadDetail.data = null
//     dataDetail.set(payloadDetail)
// }

// export async function getDataDetail({ slug, session, baseEndpoint }) {
//     resetDetail()

//     if (typeof controllerDataList !== typeof undefined) {
//         controllerDataList.abort()
//     }

//     controllerDataList = new AbortController()

//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     const cleanSlug = slug.indexOf('/') == 0 ? slug.substring(1) : slug

//     try {
//         const response = await fetch(`${baseEndpoint}/${cleanSlug}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${newSession.accessToken}`,
//             },
//             signal: controllerDataList.signal,
//         })

//         if (response.status == 200) {
//             const data = await response.json()
//             payloadDetail.meta.status = 'success'
//             payloadDetail.data = flattenObject(data)

//             dataDetail.set(payloadDetail)
//         } else if (response.status == 204) {
//             payloadDetail.meta.status = 'no-content'
//             payloadDetail.data = null
//             dataDetail.set(payloadDetail)
//         }
//     } catch (err) {
//         payloadDetail.meta.status = 'error'
//         payloadDetail.meta.error = 'Error detail: ' + err
//         payloadDetail.data = null
//         dataDetail.set(payloadDetail)
//     }
// }

// export const getFileUrl = async (imageUrl, session, baseEndpoint) => {
//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     // Fetch the image.
//     // const at = getUserData().accessToken
//     let objectUrl = imageUrl

//     if (imageUrl.indexOf(baseEndpoint) > -1) {
//         const response = await fetch(`${imageUrl}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${newSession.accessToken}`,
//             },
//         })
//         // Create an object URL from the data.
//         if (response.ok) {
//             const blob = await response.blob()
//             objectUrl = URL.createObjectURL(blob)
//         }
//     }

//     return objectUrl
// }

// export const uploadFile = async ({ file, dataSource, session, baseEndpoint }) => {
//     const url = dataSource?.split('?') ?? ''
//     const urlParams = new URLSearchParams(url[1] || '')
//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     const clientId = urlParams.get('clientId')

//     let formData = new FormData()
//     //hardcode dulu, nanti baru baca dari schema
//     // formData.append('clientId', 'afb7c664-6e0c-4050-90e2-031d960a4ae3')
//     formData.append('clientId', clientId)
//     formData.append('file', file)

//     return fetch(`${baseEndpoint}${url[0] || ''}`, {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer ${newSession.accessToken}`,
//         },
//         body: formData,
//     })
//         .then((response) => response.json())
//         .catch((error) => error)

//     // if (response.ok) {
//     //     fileUrl = response.url
//     //     console.log('response', response)
//     // }

//     // return fileUrl
//     // return axios
//     //     .post(`${baseEndpoint}${url[0] || ''}`, formData, {
//     //         headers: {
//     //             Authorization: `Bearer ${at}`,
//     //             'Content-Type': 'multipart/form-data',
//     //             // 'Content-Disposition': `attachment; filename=${file.name}`,
//     //         },
//     //     })
//     //     .then((result) => result)
//     //     .catch((error) => {})
// }

// export async function updateDetailData({ slug, method = 'PUT', body, session, baseEndpoint }) {
//     submitStatus.set({ status: 'loading', error: '' })
//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     try {
//         const result = await fetch(`${baseEndpoint}${slug}`, {
//             method,
//             headers: {
//                 Authorization: `Bearer ${newSession.accessToken}`,
//             },
//             body: JSON.stringify({ ...body }),
//         })

//         if (result.status === 200) {
//             submitStatus.set({ status: 'success', error: '' })
//         } else {
//             const errorText = await result.text()
//             submitStatus.set({
//                 status: 'error',
//                 error: `${errorText || result.statusText}`,
//             })
//         }
//     } catch (err) {
//         // console.log('errrr', err)
//         // console.log('err', err.message)
//         submitStatus.set({
//             status: 'error',
//             error: `Submit error ${err.message ?? ''}`,
//         })
//     }
// }

// export async function deleteData({ slug, session, baseEndpoint }) {
//     submitStatus.set({ status: 'loading', error: '' })
//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     try {
//         const result = await fetch(`${baseEndpoint}/${slug}`, {
//             method: 'DELETE',
//             headers: {
//                 Authorization: `Bearer ${newSession.accessToken}`,
//             },
//         })

//         // console.log('result', result)
//         if (result.status === 200) {
//             submitStatus.set({ status: 'success', error: '' })
//         } else {
//             submitStatus.set({
//                 status: 'error',
//                 error: `Delete error`,
//             })
//         }
//     } catch (err) {
//         submitStatus.set({
//             status: 'error',
//             error: `Delete error ${err.message ?? ''}`,
//         })
//     }
// }

// export function resetMasterData(key, slug) {
//     const masterList = {
//         [key]: {
//             meta: {
//                 status: 'loading',
//                 error: '',
//                 totalData: 1,
//                 slug,
//             },
//             data: [],
//         },
//     }
//     masterDataList.set(masterList)
// }

// const getMasterCount = async ({
//     slug,
//     filterDate = '',
//     search = '',
//     accessToken,
//     allstatus = '',
//     filterURLParam = '',
//     baseEndpoint,
// }) => {
//     let countData = 1
//     try {
//         const response = await fetch(
//             `${baseEndpoint}/${slug}?getcount=true${filterDate}${search}${allstatus}${filterURLParam}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             }
//         )

//         if (response.ok) {
//             const data = await response.json()
//             countData = data.count
//         }
//     } catch (err) {
//         console.error('error get count:', err.message)
//     }

//     return countData
// }

// export async function getMasterData({ key = null, slug, session, limit, baseEndpoint }) {
//     const masterKey = key || slug
//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     const cleanSlug = slug.indexOf('/') == 0 ? slug.substring(1) : slug
//     resetMasterData(masterKey, slug)

//     let totalData = await getMasterCount({
//         slug: cleanSlug,
//         accessToken,
//         baseEndpoint,
//     })

//     const qsPaging = limit ? `?limit=${limit}&offset=0` : ''

//     try {
//         const response = await fetch(`${baseEndpoint}/${cleanSlug}${qsPaging}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${newSession.accessToken}`,
//             },
//         })
//         if (response.ok) {
//             const data = await response.json()
//             const masterList = {
//                 [masterKey]: {
//                     meta: {
//                         status: 'success',
//                         error: '',
//                         totalData,
//                         slug,
//                     },
//                     data: [...data],
//                 },
//             }

//             masterDataList.set(masterList)
//         }
//     } catch (err) {
//         const masterList = {
//             [masterKey]: {
//                 meta: {
//                     status: 'error',
//                     error: 'Error list: ' + err,
//                     slug,
//                 },
//                 data: [],
//             },
//         }
//         masterDataList.set(masterList)
//     }
// }

// let controllerSearch, controllerSearchParam
// export async function getSearchListParam({ sourcePath, sourceParam, session, baseEndpoint }) {
//     if (typeof controllerSearchParam !== typeof undefined) {
//         controllerSearchParam.abort()
//     }

//     controllerSearchParam = new AbortController()

//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     let result = { error: '', data: [] }
//     try {
//         const response = await fetch(
//             `${baseEndpoint}/${sourcePath}${sourceParam ? `/${sourceParam}` : ''}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${newSession.accessToken}`,
//                 },
//                 signal: controllerSearchParam.signal,
//             }
//         )

//         if (response.status == 200) {
//             const data = await response.json()

//             result.data = [data] || []
//             result.error = ''
//         } else {
//             result.data = []
//             result.error = response.statusText
//         }
//     } catch (err) {
//         result.data = []
//         result.error = err.message
//     }
//     return result
// }

// export async function getSearchList({ sourcePath, searchfield, searchkey, session, baseEndpoint }) {
//     if (typeof controllerSearch !== typeof undefined) {
//         controllerSearch.abort()
//     }

//     controllerSearch = new AbortController()

//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     const qsSearch =
//         searchfield && searchkey ? `?searchfield=${searchfield}&searchkey=${searchkey}` : ''
//     let result = { error: '', data: [] }
//     try {
//         const response = await fetch(`${baseEndpoint}/${sourcePath}${qsSearch}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${newSession.accessToken}`,
//             },
//             signal: controllerSearch.signal,
//         })

//         if (response.status == 200) {
//             const data = await response.json()

//             result.data = data || []
//             result.error = ''
//         } else {
//             result.data = []
//             result.error = response.statusText
//         }
//     } catch (err) {
//         console.log('err', err)
//         result.data = []
//         result.error = err.message
//     }
//     return result
// }

// export async function downloadFile({ url, session, baseEndpoint }) {
//     downloadStatus.set({ status: 'loading', error: '' })
//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     try {
//         const response = await fetch(`${baseEndpoint}${url}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${newSession.accessToken}`,
//             },
//         })

//         if (response.status == 200) {
//             const blob = await response.blob()
//             downloadStatus.set({
//                 status: 'success',
//                 error: '',
//             })
//             return blob
//         } else {
//             downloadStatus.set({
//                 status: 'error',
//                 error: `Download error: ${response.statusText ?? ''}`,
//             })
//         }
//     } catch (err) {
//         downloadStatus.set({
//             status: 'error',
//             error: `Download error: ${err.message ?? ''}`,
//         })
//         return err
//     }
// }

// export const getAllData = async ({
//     slug,
//     searchField = '',
//     searchKey = '',
//     page = 1,
//     startDate = '',
//     endDate = '',
//     sort = 'desc',
//     pageSize = 10,
//     slugOriginal = '',
//     session,
//     allstatus = null,
//     filterURLParam = null,
//     baseEndpoint,
// }) => {
//     let allDataList: PayloadList = {
//         meta: {
//             status: 'loading',
//             error: '',
//             totalData: 1,
//         },
//         data: [],
//     }

//     const { accessToken, refreshToken, expiryAt } = session
//     let newSession = { accessToken, refreshToken, expiryAt }
//     const renewResult = await doRenewToken(fetch, accessToken, refreshToken, expiryAt)
//     if (renewResult && renewResult.accessToken) {
//         newSession = renewResult
//         sessionValue.set({ ...newSession })
//     }

//     const cleanSlug = slug.indexOf('/') == 0 ? slug.substring(1) : slug

//     const qsFilterDate = startDate && endDate ? `&startdate=${startDate}&enddate=${endDate}` : '',
//         qsSearch =
//             searchField && searchKey ? `&searchfield=${searchField}&searchkey=${searchKey}` : '',
//         qsAllStatus = allstatus ? '&allstatus=1' : '',
//         qsfilterURLParam = filterURLParam ? `&${filterURLParam}` : ''

//     const offset = (page - 1) * pageSize,
//         qsPaging = `&limit=${pageSize}&offset=${offset}`

//     try {
//         const response = await fetch(
//             `${baseEndpoint}/${cleanSlug}?sort=${sort}${qsPaging}${qsFilterDate}${qsSearch}${qsAllStatus}${qsfilterURLParam}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${newSession.accessToken}`,
//                 },
//                 signal: controllerDataList.signal,
//             }
//         )

//         if (response.status === 200) {
//             const data = await response.json()
//             allDataList.meta.status = 'success'
//             if (slugOriginal) allDataList.meta.slug = slugOriginal

//             let list = []

//             if (data.id) {
//                 list.push(flattenObject(data))
//             } else {
//                 data &&
//                     data.map((dt) => {
//                         list.push(flattenObject(dt))
//                     })
//             }
//             allDataList.meta.totalData = list.length
//             allDataList.data = [...list]
//         } else if (response.status === 204) {
//             allDataList.meta.status = 'no-content'
//             allDataList.data = []
//         }

//         return allDataList
//     } catch (err) {
//         allDataList.meta.status = 'error'
//         allDataList.meta.error = 'Error list: ' + err
//         allDataList.data = []
//         return allDataList
//     }
// }
