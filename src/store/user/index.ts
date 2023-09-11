import {defineStore} from "pinia";
import {getUser, updateUser, editPsw, editPswParam, user} from "@/api/user";
import {useSnackBar} from "@/store/snackbar";

export const useUser = defineStore('user', {
    state: () => {
        return {
            user: null
        }
    },
    getters: {},
    actions: {
        async get(id: number) {
            const snackbar = useSnackBar()
            try {
                const {data} = await getUser(id)
                console.log(data)
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        },
        async update(id: number, mes: user) {
            const snackbar = useSnackBar()
            try {
                const {data} = await updateUser(id, mes)
                snackbar.success('修改成功')
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        },
        async editPassword(id: number, data: editPswParam) {
            const snackbar = useSnackBar()
            try {
                await editPsw(id, data)
                return true
            } catch (e) {
                const {data, status} = e.response
                const errors = Object.values(data).flat(Infinity)
                if (status !== 401) {
                    snackbar.error(errors[0] as string)
                }
            }
        }
    }
})
