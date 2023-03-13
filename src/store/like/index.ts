import {defineStore} from "pinia";
import {useSnackBar} from "@/store/snackbar";
import {add, like, get, params, del} from "@/api/like"

export const useLike = defineStore('like', {
    state: () => {
        return {}
    },
    getters: {},
    actions: {
        async getLikes(params: params) {
            const snackbar = useSnackBar()
            try {
                const {data} = await get(params)
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }
            }
        },
        async addLike(data: like) {
            const snackbar = useSnackBar()
            try {
                await add(data)
                snackbar.success('已点赞')
                return true
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }
            }
        },
        async delLike(id:number){
            const snackbar = useSnackBar()
            try {
                await del(id)
                snackbar.success('已删除')
            } catch (e) {
                const {data, status} = e.response
                if (status!==401){
                    for (let i of Object.entries(data)) {
                        snackbar.error(`CODE:${status} ${i.toString().replace(',', ':')}`)
                    }
                }
            }
        }
    }
})