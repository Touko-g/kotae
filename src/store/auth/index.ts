import {defineStore} from "pinia";
import {useSnackBar} from "@/store/snackbar";
import {
    login,
    getCode,
    getPswCode,
    refreshToken,
    registerUser,
    userLogout,
    resetPsw,
    verify,
    reset,
    refresh,
    code,
    register,
    logout, verifyToken
} from "@/api/auth";

type login = {
    username: string,
    password: string
}

export const useAuth = defineStore('auth', {
    state: () => {
        return {}
    },
    getters: {},
    actions: {
        async signIn(userInfo: login) {
            const snackbar = useSnackBar()
            try {
                const {data: {access, refresh}} = await login(userInfo)
                localStorage.setItem('token', access)
                localStorage.setItem('refresh', refresh)
                snackbar.success('登录成功')
                return true
            } catch (error) {
                const {data, status} = error.response
                // if (status !== 401) {
                for (let i of Object.entries(data)) {
                    snackbar.error(`CODE:${status} ${i.toString().replace(',', ':')}`)
                }
                // }

            }
        },
        async code(data: code) {
            const snackbar = useSnackBar()
            try {
                const {data: {detail}} = await getCode(data)
                snackbar.success(detail)
                return true
            } catch (error) {
                const {data, status} = error.response
                if (status !== 401) {
                    for (let i of Object.entries(data)) {
                        snackbar.error(`CODE:${status} ${i.toString().replace(',', ':')}`)
                    }
                }
            }
        },
        async pswCode(data: code) {
            const snackbar = useSnackBar()
            try {
                const {data: {detail}} = await getPswCode(data)
                snackbar.success(detail)
                return true
            } catch (error) {
                const {data, status} = error.response
                if (status !== 401) {
                    for (let i of Object.entries(data)) {
                        snackbar.error(`CODE:${status} ${i.toString().replace(',', ':')}`)
                    }
                }
            }
        },
        async register(data: register) {
            const snackbar = useSnackBar()
            try {
                await registerUser(data)
                snackbar.success('注册成功')
            } catch (error) {
                const {data, status} = error.response
                if (status !== 401) {
                    for (let i of Object.entries(data)) {
                        snackbar.error(`CODE:${status} ${i.toString().replace(',', ':')}`)
                    }
                }
            }
        },
        async resetPassword(data: reset) {
            const snackbar = useSnackBar()
            try {
                await resetPsw(data)
                snackbar.success('密码已重置')
            } catch (error) {
                const {data, status} = error.response
                if (status !== 401) {
                    for (let i of Object.entries(data)) {
                        snackbar.error(`CODE:${status} ${i.toString().replace(',', ':')}`)
                    }
                }
            }
        },

        async refresh(data: refresh) {
            try {
                const {data: {access, refresh}} = await refreshToken(data)
                localStorage.setItem('token', access)
                localStorage.setItem('refresh', refresh)
            } catch (e) {
                console.log(e)
            }
        },
        async verify(data: verify) {
            try {
                const res = await verifyToken(data)
                return res
            } catch (e) {
                console.log(e)
            }
        },
        async logOut(data: logout) {
            const snackbar = useSnackBar()
            try {
                await userLogout(data)
                snackbar.success('退出登录')
            } catch (e) {
                console.log(e)
            }
        }
    }
})