import request from '@/utils/request'

export type params = {
    name?: string,
    order?: string,
    page?: number,
    pagesize?: number
}

export const getTags = (params: params) => request.get('tag/', {params})