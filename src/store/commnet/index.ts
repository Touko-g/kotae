import {defineStore} from "pinia";
import {useSnackBar} from "@/store/snackbar";
import {postComment, postData, params, getComments, getNotice, notice, read, readNotice} from "@/api/comment";

export const useComment = defineStore('comment', {
    state: () => {
        return {}
    },
    getters: {},
    actions: {
        async getComments(params: params) {
            const snackbar = useSnackBar()
            try {
                const {data} = await getComments(params)
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }

            }
        },
        async addComment(data: postData) {
            const snackbar = useSnackBar()
            try {
                const res = await postComment(data)
                return res
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }
            }
        },
        async getNotice(params: notice) {
            const snackbar = useSnackBar()
            try {
                const {data} = await getNotice(params)
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }
            }
        },
        async readMessage(data: read) {
            const snackbar = useSnackBar()

            try {
                await readNotice(data)
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error(data[0])
                }
            }
        }
    }
})