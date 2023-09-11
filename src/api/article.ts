import request from '@/utils/request'

export type params = {
    title?: string|undefined
    content?: string
    tag?: string
    author?: string
    order?: string
    page?: number,
    pagesize?: number
}

export type addParams = {
    title: string,
    tag: Array<any>,
    content?: string
}

export type search = {
    name: string
}

export const getArticle = (id: number | string) => request.get(`article/${id}`)

export const getArticles = (params: params) => request.get('article/', {params})

export const postArticle = (data: addParams) => request.post('article/create', data)

export const editArticle = (id: string | number, data: addParams) => request.put(`article/${id}/`, data)

export const delArticle = (id:string|number)=>request.delete(`article/${id}/`)

export const getSearch = () => request.get('search/?order=-hot&pagesize=5')

export const postSearch = (data: search) => request.post('search/', data)
