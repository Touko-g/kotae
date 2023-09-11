<template>
  <v-card class="ma-6">
    <v-tabs
        v-model="type"
        color="primary"
        centered
    >
      <v-tab
          value="reply"
      >
        <v-badge dot color="error" floating v-if="replyData?.unread">
          {{ t('reply') }}
        </v-badge>
        <span v-else>    {{ t('reply') }}</span>

      </v-tab>
      <v-tab
          value="comment"
      >
        <v-badge dot color="error" floating v-if="commentData?.unread">
          {{ t('comment') }}
        </v-badge>
        <span v-else>     {{ t('comment') }}</span>

      </v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="type">
        <v-window-item value="reply">
          <v-card>
            <v-tabs v-model="read" grow color="primary">
              <v-tab
                  :value="0"
              >
                <v-badge v-if="replyData?.unread" :content="replyData?.unread.length" color="error" floating>
                  {{ t('unread') }}
                </v-badge>
                <span v-else>{{ t('unread') }}</span>
              </v-tab>
              <v-tab
                  :value="1"
              >
                {{ t('read') }}
              </v-tab>
            </v-tabs>
            <v-card-text>
              <v-window v-model="read">
                <v-window-item :value="0">
                  <v-list-item v-for="i in replyData?.unread" :key="i.id"
                               @click=" router.push(`/article/${i.target_info.id}`)">
                    <div class="d-flex">
                      <v-btn icon>
                        <v-avatar
                            size="40"
                        >
                          <v-img
                              :src="i.user_info.avatar"
                              alt="avatar"
                          ></v-img>
                        </v-avatar>
                      </v-btn>


                      <div class="d-flex flex-column ml-4">
                        <div>
                          <div>
                            <span class="font-weight-bold">{{ i.user_info.username }}</span><span
                              class="mx-2">{{ t('rtmc') }}</span>
                          </div>
                          <span class="text-grey">"{{ i.reply_content }}"</span>
                        </div>
                        <span class="my-1">{{ i.content }}</span>
                        <span
                            class="text-caption text-grey">{{
                            dayjs(i.create_time).format('YYYY-MM-DD HH:mm:ss')
                          }}</span>
                      </div>
                    </div>
                  </v-list-item>
                </v-window-item>
                <v-window-item :value="1">
                  <v-list-item v-for="i in replyData?.read" :key="i.id"
                               @click=" router.push(`/article/${i.target_info.id}`)">
                    <div class="d-flex">
                      <v-btn icon>
                        <v-avatar
                            size="40"
                        >
                          <v-img
                              :src="i.user_info.avatar"
                              alt="avatar"
                          ></v-img>
                        </v-avatar>
                      </v-btn>


                      <div class="d-flex flex-column ml-4">
                        <div>
                          <div>
                            <span class="font-weight-bold">{{ i.user_info.username }}</span><span
                              class="mx-2">{{ t('rtmc') }}</span>
                          </div>
                          <span class="text-grey">"{{ i.reply_content }}"</span>
                        </div>
                        <span class="my-1">{{ i.content }}</span>
                        <span
                            class="text-caption text-grey">{{
                            dayjs(i.create_time).format('YYYY-MM-DD HH:mm:ss')
                          }}</span>
                      </div>
                    </div>
                  </v-list-item>
                </v-window-item>
              </v-window>

            </v-card-text>

          </v-card>
        </v-window-item>
        <v-window-item value="comment">
          <v-card>
            <v-tabs v-model="cRead" grow color="primary">
              <v-tab
                  :value="0"
              >
                <v-badge v-if="commentData?.unread" :content="commentData?.unread.length" color="error" floating>
                  {{ t('unread') }}
                </v-badge>
                <span v-else>{{ t('unread') }}</span>
              </v-tab>
              <v-tab
                  :value="1"
              >
                {{ t('read') }}
              </v-tab>
            </v-tabs>
            <v-card-text>
              <v-window v-model="cRead">
                <v-window-item :value="0">
                  <v-list-item v-for="i in commentData?.unread" :key="i.id"
                               @click=" router.push(`/article/${i.target_info.id}`)">
                    <div class="d-flex">
                      <v-btn icon>
                        <v-avatar
                            size="40"
                        >
                          <v-img
                              :src="i.user_info.avatar"
                              alt="avatar"
                          ></v-img>
                        </v-avatar>
                      </v-btn>


                      <div class="d-flex flex-column ml-4">
                        <div>
                          <div>
                            <span class="font-weight-bold">{{ i.user_info.username }}</span><span
                              class="mx-2">{{ t('coya') }}</span>
                          </div>
                          <span class="font-weight-bold">{{ i.target_info.title }}</span>
                        </div>
                        <span class="my-1">{{ i.content }}</span>
                        <span
                            class="text-caption text-grey">{{
                            dayjs(i.create_time).format('YYYY-MM-DD HH:mm:ss')
                          }}</span>
                      </div>
                    </div>
                  </v-list-item>
                </v-window-item>
                <v-window-item :value="1">
                  <v-list-item v-for="i in commentData?.read" :key="i.id"
                               @click=" router.push(`/article/${i.target_info.id}`)">
                    <div class="d-flex">
                      <v-btn icon>
                        <v-avatar
                            size="40"
                        >
                          <v-img
                              :src="i.user_info.avatar"
                              alt="avatar"
                          ></v-img>
                        </v-avatar>
                      </v-btn>


                      <div class="d-flex flex-column ml-4">
                        <div>
                          <div>
                            <span class="font-weight-bold">{{ i.user_info.username }}</span><span
                              class="mx-2">{{ t('coya') }}</span>
                          </div>
                          <span class="font-weight-bold text-decoration-underline">{{ i.target_info.title }}</span>
                        </div>
                        <span class="my-1">{{ i.content }}</span>
                        <span
                            class="text-caption text-grey">{{
                            dayjs(i.create_time).format('YYYY-MM-DD HH:mm:ss')
                          }}</span>
                      </div>
                    </div>
                  </v-list-item>
                </v-window-item>
              </v-window>

            </v-card-text>

          </v-card>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {getCurrentInstance, onMounted, onUnmounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useComment} from "@/store/commnet";
import {useRouter} from "vue-router";
import {inject} from "vue";

const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs
const notice = inject('notice')

const {t} = useI18n()
const {getNotice, readMessage} = useComment()
const router = useRouter()

const read = ref(0)
const cRead = ref(0)
const type = ref('reply')
const replyData = ref(null)
const commentData = ref(null)

onMounted(async () => {
  const {results} = await getNotice({pagesize: 10000, order: "-create_time"})
  const {reply, comment} = results.reduce((res: any, cur: any) => {
    if (cur.verb === '回复') {
      res['reply'] = [...(res['reply'] || []), cur]
    } else {
      res['comment'] = [...(res['comment'] || []), cur]
    }
    return res
  }, {})
  replyData.value = reply&&reply.reduce((res: any, cur: any) => {
    if (cur.read) {
      res['read'] = [...(res['read'] || []), cur]
    } else {
      res['unread'] = [...(res['unread'] || []), cur]
    }
    return res
  }, {})
  commentData.value = comment&&comment.reduce((res: any, cur: any) => {
    if (cur.read) {
      res['read'] = [...(res['read'] || []), cur]
    } else {
      res['unread'] = [...(res['unread'] || []), cur]
    }
    return res
  }, {})
})
onUnmounted(async () => {
  await readMessage({})
  notice.value = 0
})
</script>

<style scoped>

</style>
