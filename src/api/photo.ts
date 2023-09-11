import request from '@/utils/request'

export type params = {
    user?: string,
    order?: string,
    page?: number,
    pagesize?: number
}

export type mes = {
    name?: string,
    picture: string
}

export const getPhoto = (id: number | string) => request.get(`photo/${id}`)

export const getPhotos = (params: params) => request.get('photo/', {params})

export const addPhoto = (data: mes) => request.post('photo/', data)

export const delPhoto = (id: number|string) => request.delete(`photo/${id}`)
