import {defineStore} from "pinia";
import {getKey} from "@/api/auth";
import {useSnackBar} from "@/store/snackbar";

export const useConfig = defineStore('config', {
    state: () => ({
        cos: null,
        isRouterAlive: true
    }),
    actions: {
        async getCosKey() {
            const snackbar = useSnackBar()
            try {
                const {data} = await getKey()
                return data
            } catch (e) {
                const {data, status} = e.response
                if (status !== 401) {
                    snackbar.error('发生了错误，尝试关掉代理')
                }
            }
        },
        reload() {
            this.isRouterAlive = false
            setTimeout(() => {
                this.isRouterAlive = true
            }, 100)
        }
    }
})
