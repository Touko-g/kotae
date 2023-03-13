import request from '@/utils/request'

export type params = {
    article?: number,
    user?: string,
    order?: string,
    page?: number,
    pagesize?: number
}

export type postData = {
    article: number,
    reply?: number,
    content: string
}

export type notice = {
    read?: boolean,
    order?: string,
    page?: number,
    pagesize?: number
}

export type read = {
    id?: number
}

export const getComments = (params: params) => request.get(`comment/`, {params})

export const postComment = (data: postData) => request.post(`comment/`, data)

export const getNotice = (params: notice) => request.get(`notice/`, {params})

export const readNotice = (data: read) => request.post(`notice_read/`, data)