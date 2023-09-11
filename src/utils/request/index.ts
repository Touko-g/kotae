// http.ts
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {useSnackBar} from "@/store/snackbar";
import {useAuth} from "@/store/auth";
import {useConfig} from "@/store/config";
import router from "@/router";

const snackbar = useSnackBar()
const config = useConfig()

const queue = new Map()
const addQueue = (config: AxiosRequestConfig) => {
    const url = [
        config.method,
        config.url,
        JSON.stringify(config.params),
        JSON.stringify(config.data),
    ].join('&')
    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
        if (!queue.has(url)) { // 如果 queue 中不存在当前请求，则添加进去
            queue.set(url, cancel)
        }
    })
}

const removeQueue = (config: AxiosRequestConfig) => {
    const url = [
        config.method,
        config.url,
        JSON.stringify(config.params),
        JSON.stringify(config.data),
    ].join('&')
    if (queue.has(url)) { // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
        const cancel = queue.get(url)
        cancel(url)
        queue.delete(url)
    }
}

export const clearPending = () => {
    for (const [url, cancel] of queue) {
        cancel(url)
    }
    queue.clear()
}

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {},
    // 是否跨站点访问控制请求
    withCredentials: false,
    timeout: 3000,
})

instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // removeQueue(config)
        // addQueue(config)
        const token = window.localStorage.getItem("token");
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    })

instance.interceptors.response.use((response: AxiosResponse) => {
    // removeQueue(response)
    return {
        data: response.data,
        status: response.status
    };
}, async (error) => {
    if (axios.isCancel(error)) {
        // snackbar.warning(`repeated request`)
    }
    const originalRequest = error.config;
    // if (typeof error.response === 'undefined') {
    //     snackbar.error(
    //         'A server/network error occurred. ' +
    //         'Looks like CORS might be the problem. ' +
    //         'Sorry about this - we will get it fixed shortly.'
    //     );
    //     return Promise.reject(error);
    // }

    if (
        error.response.status === 401 &&
        originalRequest.url === 'token/refresh/'
    ) {
        snackbar.error('授权过期请重新登录')
        localStorage.clear()
        router.push('/login')
    }

    if (
        error.response.data.code === 'token_not_valid' && (error.response.status === 401 || error.response.status === 403)
    ) {
        const refresh_token = localStorage.getItem('refresh');
        if (refresh_token) {
            const {refresh} = useAuth()
            refresh({refresh: refresh_token}).then(res => {
                if (!['article_create', 'article_edit'].includes(<string>router.currentRoute.value.name)) {
                    config.reload()
                }
                if (router.currentRoute.value.name === 'login') {
                    router.push('/articles')
                }
            })
        }
    }

    return Promise.reject(error);

})

export default instance
