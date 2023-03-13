import request from '@/utils/request'

export type params = {
    article?: number | string,
    user?: string,
    order?: string,
    page?: number,
    pagesize?: number
}

export type like = {
    article: number
}

export const get = (params: params) => request.get('like/', {params})

export const add = (data: like) => request.post('like/', data)

export const del = (id: number) => request.delete(`like/${id}`)