import {defineStore} from "pinia";
import {useSnackBar} from "@/store/snackbar";
import {useUser} from "@/store/user";

type State = {
    publicChatRoom: WebSocket | null
    publicChatMes: object[],
    publicChatOnline: number
}

interface Getters {

}

interface Actions {
    setPublicWs(url: string): void
}

export const useWs = defineStore<string, State, {}, Actions>('ws', {
    state: () => {
        return {
            publicChatRoom: null,
            publicChatMes: [],
            publicChatOnline: 0
        }
    },
    getters: {},
    actions: {
        setPublicWs(url) {
            const {user} = useUser()
            const snackbar = useSnackBar()
            this.publicChatRoom = new WebSocket(import.meta.env.VITE_WS_URL + url)

            this.publicChatRoom.onopen = () => {
                snackbar.success('进入聊天室')
                this.publicChatRoom && this.publicChatRoom.send(JSON.stringify({"type": "join", "user": user.id}))
            }

            this.publicChatRoom.onmessage = (e) => {
                const data = JSON.parse(e.data)
                if (data.hasOwnProperty('online')) {
                    this.publicChatOnline = data['online']
                } else {
                    if (data['status']) {
                        data['status'] === 'join' ? this.publicChatMes.push({
                            state: 'join',
                            user: data['user']
                        }) : this.publicChatMes.push({state: 'leave', user: data['user']})
                    }
                    if (data['message']) {
                        this.publicChatMes.push(data)
                    }
                }
            }

            this.publicChatRoom.onerror = (e) => {
                snackbar.error('发生了错误')
            }

            this.publicChatRoom.onclose = (e) => {
                snackbar.success('退出聊天室')
                this.publicChatRoom = null
            }
        }
    }
})