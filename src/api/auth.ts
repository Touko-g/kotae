import request from '@/utils/request'

type login = {
    username: string,
    password: string
}

export type refresh = {
    refresh: string
}

export type verify = {
    token: string
}

export type logout = {
    refresh_token: string
}
export type code = {
    email: string
}
export type register = {
    username: string
    about?: string
    email?: string
    code: string
    password: string
    password2: string
}

export type reset = {
    email: string
    code: string
    password: string
    password2: string
}


export const login = (data: login) => request.post('token/', data)

export const refreshToken = (data: refresh) => request.post('token/refresh/', data)

export const verifyToken = (data: verify) => request.post('token/verify/', data)

export const userLogout = (data: logout) => request.post('logout/', data)

export const logoutAll = () => request.post('logout_all/')

export const getCode = (data: code) => request.post('code/', data)

export const registerUser = (data: register) => request.post('register/', data)

export const getKey = () => request.get('coskey/')

export const getPswCode = (data: code) => request.post('resetcode/', data)

export const resetPsw = (data: reset) => request.put('user/resetpsw/', data)

