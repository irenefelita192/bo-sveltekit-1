import { get as getStore, writable } from 'svelte/store'

let initPayloadList: PayloadList = {
    meta: {
        status: 'loading',
        error: '',
        totalData: 1,
    },
    data: [],
}

let initPayloadDetail: Payload = {
    meta: {
        status: 'loading',
        error: '',
    },
    data: null,
}

export const dataList = writable(initPayloadList)
export const dataDetail = writable(initPayloadDetail)
export const slugPath = writable()
export const currentPage = writable(1)
export const sortValue = writable('desc')
export const searchParam = writable({ searchField: '', searchKey: '' })
export const pageSize = writable(10)
export const filterDate = writable([null, null])
export const filterURLParam = writable()
export const dataSourceObj = writable({ name: '', value: '' })

export const resetList = () => {
    slugPath.set('')
    currentPage.set(1)
    sortValue.set('desc')
    searchParam.set({ searchField: '', searchKey: '' })
    pageSize.set(10)
    filterDate.set([null, null])
    filterURLParam.set(null)
    dataSourceObj.set({ name: '', value: '' })
}

export const resetDetail = () => {
    dataDetail.set(initPayloadDetail)
}
export const masterDataList = writable()

export const submitStatus = writable({ status: '', error: '' })
export const sendStatus = writable({ status: '', error: '' })
export const submitListStatus = writable({ status: '', error: '', list: [] })

export const submitData = writable({})

export const errorData = writable({})

export const alert = writable({ isShow: false, type: '', body: '', name: '' })

export const downloadStatus = writable({ status: '', error: '' })
