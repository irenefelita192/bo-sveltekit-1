import { writable } from 'svelte/store'
export const slicedData = writable([])
export const selection = writable([])
export const isAllSelected = writable(false)
export const searchParam = writable({ customerId: '', batchNo: '', status: -1 })
export const workingList = writable([])

// export const resetList = () => {
//   slugPath.set('')
//   currentPage.set(1)
//   sortValue.set('desc')
//   searchParam.set({ searchField: '', searchKey: '' })
//   pageSize.set(10)
//   filterDate.set(['', ''])
// }
