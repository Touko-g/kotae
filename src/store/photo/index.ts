import {defineStore} from "pinia";
import {useSnackBar} from "@/store/snackbar";
import {getPhoto, getPhotos, addPhoto, delPhoto, params, mes} from "@/api/photo"

export const usePhoto = defineStore('photo', {
    state: () => {
        return {}
    },
    getters: {},
    actions: {
        async get(id: number | string) {
            const snackbar = useSnackBar()
            try {
                const {data} = await getPhoto(id)
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }
            }
        },
        async gets(params: params) {
            const snackbar = useSnackBar()
            try {
                const {data} = await getPhotos(params)
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }
            }
        },
        async add(data: mes) {
            const snackbar = useSnackBar()
            try {
                await addPhoto(data)
                snackbar.success('已添加')
                return true
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }
            }
        },
        async del(id: string | number) {
            const snackbar = useSnackBar()
            try {
                await delPhoto(id)
                snackbar.success('已删除')
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    for (let i of Object.entries(data)) {
                        snackbar.error(`CODE:${status} ${i.toString().replace(',', ':')}`)
                    }
                }
            }
        }
    }
})
