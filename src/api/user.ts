import request from '@/utils/request'

export type editPswParam = {
    old_password: string
    password: string
    password2: string
}

type restPsw = {
    username: string
}

export type user = {
    username: string
    about?: string
    avatar: string
    email: string
}
export const getUsers = () => request.get('users/')

export const getUser = (id: number) => request.get(`user/${id}`)

export const editPsw = (id: number, data: editPswParam) => request.patch(`user/editpsw/${id}/`, data)

export const restPsw = (data: restPsw) => request.put('user/restpsw/', data)

export const updateUser = (id: number, data: user) => request.put(`user/${id}/`, data)