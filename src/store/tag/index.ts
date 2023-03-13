import {defineStore} from "pinia";
import {getTags, params} from "@/api/tag";
import {useSnackBar} from "@/store/snackbar";

export const useTag = defineStore('tag', {
    state: () => ({}),
    actions: {
        async getTagList(params: params) {
            const snackbar = useSnackBar()
            try {
                const {data: {results}} = await getTags(params)
                return results
            } catch (e) {
                const {data, status} = e.response
                if (status!==401){
                    snackbar.error(`CODE:${status} ${Object.entries(data)[0].toString().replace(',', ':')}`)
                }
            }
        }
    }
})