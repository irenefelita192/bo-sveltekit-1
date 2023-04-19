/* eslint-disable @typescript-eslint/no-explicit-any */
declare type Template = 'default' | 'cashback' | 'notification'
declare type Method = 'get' | 'post' | 'update' | 'delete' | 'put' | 'option' | 'patch'

type FieldSize = 'short' | 'medium' | 'long'

declare interface Fields {
    [index: string]: any | any[]
}

// declare interface TableGroup {
//     title: string
//     key?: string
//     fields: Field[]
//     $expandRow?: ExpandRow
// }

declare interface TableGroup {
    title: string
    group: FieldGroup[]
}

declare interface FieldGroup {
    title: string
    fields: Field[]
    type?: string
    key?: string
    $expandRow?: ExpandRow
}

declare interface Field {
    key: any
    label: string
    size?: FieldSize
    heightClass?: string
    isRowExpand?: boolean
    formatText?: string
    type?: string
    isDefault?: boolean
    options?: Field[]
    redirectUrl?: string
    dateFormat?: string
    addClass?: string
    contentClass?: string
    master?: string
    masterId?: string
    masterName?: string
    required?: boolean
    disabled?: boolean
    defaultValue?: any
    hide?: boolean
    dependant?: string[]
    maxLength?: number
    toolbars?: string[]
}

declare interface CreateField {
    title: string
    redirectUrl: string
}

declare interface SearchField {
    key: any
    label: string
    dataSource?: string
    dataSourceName?: string
    master?: string
    masterId?: string
    masterName?: string
    isCompleteSearch?: boolean
    urlSearchById?: string
    urlSearchByName?: string
}

declare interface ExpandRow {
    key: string
    $column: Field[]
    isDefaultOpen?: boolean
}

declare interface UI {
    template: Template
    permissions: any
    title?: string
    headerText?: string
    $primary?: FieldGroup[]
    $table?: TableGroup
    $editor?: FieldGroup[]
    $media?: FieldGroup[]
    $column?: Field[]
    $filter?: Field[]
    $search?: SearchField[]
    $expandRow?: ExpandRow
    $sort?: Field[]
    detailUrl?: string
    $actions?: any[]
    $allstatus?: boolean
    $download?: Field[]
    createPage?: CreateField
    downloadParam?: string
    requiredField?: string[]

    //$download?:
    //download ada modal title, modal button etc
    //
}

declare interface SchemaAttribute {
    data?: any | any[]
    name: string
    path: string
    method: Method
}

declare interface UserData {
    imageUrl: string
    firstName: string
    lastName: string
    fullName?: string
    email: string
    credential: string
    isByPass: boolean
}

declare interface PayloadList {
    meta: any
    data: any[]
}

declare interface Payload {
    meta: any
    data: any
}

declare var google: any
declare var easepick: any
declare var EasyMDE: any
declare var Diff: any
