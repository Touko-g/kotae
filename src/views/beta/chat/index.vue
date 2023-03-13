<template>
  <v-card class="ma-6 pa-2 d-flex flex-column" height="560">
    <v-card-title class="d-flex align-center">
      {{ t('public_chat') }}
      <v-spacer/>
      <v-icon icon="mdi-account-outline" size="small"/>
      {{ ws.publicChatOnline }}
    </v-card-title>
    <v-divider/>
    <v-card-text class="overflow-hidden overflow-y-auto">
      <div ref="el" style="padding-bottom: 56px">
        <v-list>
          <v-list-item
              v-for="(i,k) in ws.publicChatMes"
              :key="k"
          >
            <div class="w-100 text-center text-grey text-caption" v-if="i.state">
              {{ i.state === 'join' ? `${i.user}${t('etcr')}` : `${i.user}${t('ltcr')}` }}
            </div>
            <div :class="i.username === user.username ? 'd-flex w-100 flex-row-reverse' : 'd-flex w-100' " v-else>
              <v-list-item-avatar :image="i.avatar">

              </v-list-item-avatar>
              <div
                  :class="i.username === user.username ? 'd-flex flex-column mr-2 text-right' : 'd-flex flex-column ml-2' ">
                <span class="font-weight-bold text-primary">{{ i.username }}</span>
                <span style="word-break: break-all">{{ i.message }}</span>
              </div>
            </div>
          </v-list-item>
        </v-list>
      </div>

    </v-card-text>
    <v-card-actions class="bg-surface">
      <v-text-field color="primary" variant="outlined" density="compact" hide-details v-model="mes">

      </v-text-field>
      <v-btn @click="sendMes" color="primary" variant="flat" class="ml-2">
        {{ t('send') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {useWs} from "@/store/ws";
import {useUser} from "@/store/user";
import {useSnackBar} from "@/store/snackbar";
import {useI18n} from "vue-i18n";
import {onMounted, onUnmounted, ref, watch} from "vue";
import * as _ from "lodash";

const ws = useWs()
const snackbar = useSnackBar()
const {user} = useUser()
const {t} = useI18n()

const mes = ref('')
const el = ref<HTMLDivElement | null>(null)
const chatList = ref([])

watch(() => ws.publicChatMes.length, (value, oldValue) => {
  if (value) {
    el.value.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
  }
})

onMounted(() => {
  join()
  el.value.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
})

const join = () => {
  ws.setPublicWs('chat/public/')
}
const logout = () => {
  if (ws.publicChatRoom && ws.publicChatRoom.url) {
    ws.publicChatRoom.send(JSON.stringify({"type": "leave", "user": user.id}))
    ws.publicChatRoom.close()
  }
}

const sendMes = _.debounce(() => {
  if (mes.value.trim().length > 0) {
    if (ws.publicChatRoom && ws.publicChatRoom.url) {
      ws.publicChatRoom.send(JSON.stringify({
        "type": "message",
        "message": mes.value,
        "username": user.username,
        "avatar": user.avatar
      }))
    }
  } else {
    snackbar.warning('信息为空')
  }
  mes.value = ''
}, 200)

onUnmounted(() => {
  logout()
})

</script>

<style scoped>

</style>