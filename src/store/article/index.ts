import {defineStore} from "pinia";
import {useSnackBar} from "@/store/snackbar";
import {
    getArticle,
    getArticles,
    getSearch,
    postSearch,
    postArticle,
    editArticle,
    delArticle,
    addParams,
    search,
    params
} from "@/api/article";

export const useArticle = defineStore('article', {
    state: () => {
        return {}
    },
    getters: {},
    actions: {
        async get(id: string | number) {
            const snackbar = useSnackBar()
            try {
                const {data} = await getArticle(id)
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        },
        async create(data: addParams) {
            const snackbar = useSnackBar()
            try {
                await postArticle(data)
                snackbar.success(`Published successfully`)
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        },
        async edit(id: string | number, data: addParams) {
            const snackbar = useSnackBar()
            try {
                await editArticle(id, data)
                snackbar.success(`Published successfully`)
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        },
        async list(params: params) {
            const snackbar = useSnackBar()
            try {
                const {data} = await getArticles(params)
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        },
        async del(id: string | number){
            const snackbar = useSnackBar()
            try {
                await delArticle(id)
                snackbar.success(`Delete successfully`)
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        },
        async searchList() {
            const snackbar = useSnackBar()
            try {
                const {data: {results}} = await getSearch()
                return results
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        },
        async addSearch(data: search) {
            try {
                await postSearch(data)
            } catch (e) {
                // console.log(e)
            }
        }
    }
})
