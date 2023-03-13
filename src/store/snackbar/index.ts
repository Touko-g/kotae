import {defineStore} from "pinia";

let t: any = null;
export const useSnackBar = defineStore('snackbar', {
    state: () => {
        return {
            text: '一条五秒钟后消失的信息',
            show: false,
            timeout: 5000,
            location: 'top',
            color: 'info',
            contentClass: 'text-white',
            transition:"scroll-y-transition"
        }
    },
    getters: {},
    actions: {
        setVal(message: object) {
            if (t) {
                clearTimeout(t)
            }
            this.$state = Object.assign(this.$state, message)
            if (this.show && this.timeout > 0) {
                t = setTimeout(() => {
                    this.$state = Object.assign(this.$state, {
                        show: false,
                    });
                }, this.timeout)
            }
        },
        success(text: string, timeout: number = 3000, location: string = 'top') {
            return new Promise((resolve, reject) => {
                this.setVal({text, color: 'success', timeout, show: true})
            })
        },
        info(text: string, timeout: number = 3000, location: string = 'top') {
            return new Promise((resolve, reject) => {
                this.setVal({text, color: 'info', timeout, show: true})
            })
        },
        error(text: string, timeout: number = 3000, location: string = 'top') {
            return new Promise((resolve, reject) => {
                this.setVal({text, color: 'error', timeout, show: true})
            })
        },
        warning(text: string, timeout: number = 3000, location: string = 'top') {
            return new Promise((resolve, reject) => {
                this.setVal({text, color: 'warning', timeout, show: true})
            })
        },
    }

})