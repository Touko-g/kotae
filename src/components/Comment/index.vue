<template>
  <div style="padding: 0 1rem 0 1rem">
    <div class="d-flex">
      <v-text-field density="comfortable" color="primary" variant="underlined" v-model="comment" @keyup.enter="postComment">
        <template v-slot:prepend-inner>
          <v-btn icon="mdi-emoticon-sick-outline" size="small" color="primary" variant="plain" @click="emojiDialog=true"></v-btn>
        </template>
        <template v-slot:append>
          <v-btn variant="flat" color="primary" @click="postComment" class="ml-4">{{ t('pcomment') }}</v-btn>
        </template>
      </v-text-field>
    </div>
    <div class="text-capitalize text-h5 font-weight-bold d-flex justify-space-between align-center">{{ t('comment') }}:
      <v-btn v-show="page.count" @click="byTime" variant="text">{{ t('by_time') }}
        <v-icon
            color="primary"
            class="ml-2"
            :icon="timeOrder === 'create_time' ? 'mdi-sort-clock-ascending-outline' :'mdi-sort-clock-descending-outline'"></v-icon>
      </v-btn>
    </div>
    <v-divider class="mt-6" color="surface"/>
    <div ref="el">
      <DelayFade>
        <div v-for="(i,k) in comments" :key="i.id" class="d-flex align-start my-6" :data-index="k">
          <v-btn size="45" icon variant="flat" class="mr-4" @click="router.push({name:'userinfo',params:{id:i.user_info.id}})">
            <v-avatar
                size="45"
            >
              <v-img
                  :src="i.user_info.avatar"
                  alt="avatar"
              ></v-img>
            </v-avatar>
          </v-btn>
          <div>
            <div class="text-grey font-weight-bold">{{ i.user_info.username }}
              <span class="text-grey ml-1" v-if="mobile&&i.ip_address&&i.ip_address!=='未知'">
                {{ i.ip_address.match(/(.+(?=省))/) ? i.ip_address.match(/(.+(?=省))/)[0] : i.ip_address }}
              </span>
            </div>
            <div style="word-break: break-word">{{ i.content }}</div>
            <div class="text-grey"></div>
            <div class="d-flex mt-1">
              <div class="text-grey mr-2" v-if="!mobile&&i.ip_address&&i.ip_address!=='未知'">
                {{ i.ip_address.match(/(.+(?=省))/) ? i.ip_address.match(/(.+(?=省))/)[0] : i.ip_address }}
              </div>
              <div class="text-grey">{{ timeFormat(i.create_time) }}</div>
              <v-btn variant="text" density="compact" color="grey" class="mx-2" @click="open(i.id,i.user_info,k)">
                {{ t('reply') }}
              </v-btn>
            </div>
            <div v-show="i.comment_replies">
              <div v-for="(j,key) in i.comment_replies" :key="j.id">
                <div v-show="key<1||(i.id===data.flag_id)">
                  <div class="d-flex align-start my-6">
                    <v-btn size="40" icon variant="flat" class="mr-4"  @click="router.push({name:'userinfo',params:{id:j.user_info.id}})">
                      <v-avatar
                          size="40"
                      >
                        <v-img
                            :src="j.user_info.avatar"
                            alt="avatar"
                        ></v-img>
                      </v-avatar>
                    </v-btn>
                    <div>
                      <div class="text-grey font-weight-bold">{{ j.user_info.username }}
                        <span class="text-grey ml-1"
                              v-if="mobile&&j.ip_address&&j.ip_address!=='未知'">
                                     {{ j.ip_address.match(/(.+(?=省))/) ? j.ip_address.match(/(.+(?=省))/)[0] : j.ip_address }}
                        </span>
                      </div>
                      <div style="word-break: break-word"><span v-show="j.reply_user" class="text-primary">@{{
                          j.reply_user
                        }} : </span>{{ j.content }}
                      </div>
                      <div class="d-flex mt-1">
                        <div class="text-grey mr-2" v-if="!mobile&&j.ip_address&&j.ip_address!=='未知'">
                          {{ j.ip_address.match(/(.+(?=省))/) ? j.ip_address.match(/(.+(?=省))/)[0] : j.ip_address }}
                        </div>
                        <div class="text-grey">{{ timeFormat(j.create_time) }}</div>
                        <v-btn variant="text" density="compact" color="grey" class="mx-2"
                               @click="open(j.id,j.user_info,k,j.user_info.username)">
                          {{ t('reply') }}
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="key===1&&(i.id!==data.flag_id)">
                  {{ i.comment_replies.length }} {{ t('replies') }}
                  <span class="text-primary" @click="viewMore(i.id)">{{ t('view_more') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DelayFade>
      <v-pagination
          class="mt-13"
          :length="page.count"
          rounded="circle"
          @update:modelValue="changePage"
          v-model="page.page"
          v-if="comments.length"
      ></v-pagination>
      <div v-else class="my-2 text-grey">{{ t('noc') }}</div>
    </div>
  </div>
  <v-dialog v-model="data.dialog" @click:outside="dialogReset" width="auto" transition="dialog-top-transition">
    <v-card width="300">
      <v-card-title>
        To : {{ data.reply_user_info.username }}
      </v-card-title>
      <v-card-text>
        <v-textarea density="comfortable" color="primary" variant="underlined"
                    v-model="data.reply_info.content"/>
        <v-btn icon="mdi-emoticon-sick-outline" color="primary" class="mr-2" @click="emojiDialog=true"
               variant="plain"></v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" @click="toReply()">{{ t('confirm') }}</v-btn>
        <v-btn @click="dialogReset">{{ t('cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="emojiDialog" @click:outside="emojiDialog=false" width="auto" transition="dialog-top-transition">
    <EmojiPicker :native="true" @select="onSelectEmoji"/>
  </v-dialog>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive, ref, toRefs, watch} from "vue";
import {useComment} from "@/store/commnet";
import {useSnackBar} from "@/store/snackbar";
import {useI18n} from "vue-i18n";
import {useDisplay} from "vuetify";
import DelayFade from '@/components/DelayFade'

// import picker compopnent
import EmojiPicker from 'vue3-emoji-picker'
// import css
import 'vue3-emoji-picker/css'
import {useRouter} from "vue-router";

const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs
const {t} = useI18n()
const {mobile} = useDisplay()
const router = useRouter()

interface Props {
  userId: number
  article: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeComment', num: number): void
}>()

const {addComment, getComments} = useComment()
const snackbar = useSnackBar()

const comment = ref('')
const comments = ref([])
const reply_user = ref('')
const el = ref<HTMLDivElement | null>(null)
const data = reactive({
  dialog: false,
  reply_info: {
    article: 0,
    reply: 0,
    content: '',
    k: 0
  },
  reply_user_info: null,
  flag_id: 0
})
const timeOrder = ref('create_time')
const page = reactive({
  page: 1,
  pagesize: 10,
  count: 0
})

const emojiDialog = ref(false)


watch(() => props.article, async value => {
  const data = await getComments({article: value, page: 1})
  comments.value = data.results
  page.count = Math.ceil(data.count / 10)
  page.page = 1
})

onMounted(() => {
  getComment('', 1)
})

const getComment = async (order: string, p: number) => {
  const data = await getComments({article: props.article, order, page: p})
  comments.value = data.results
  page.count = Math.ceil(data.count / 10)
}

const postComment = async () => {
  if (comment.value.trim().length) {
    const res = await addComment({article: props.article, content: comment.value})
    comment.value = ''
    emit('changeComment', res.data.article_info.comments)
    if (timeOrder.value === 'create_time') {
      comments.value.length < 10 && (comments.value.push(res.data))
      el.value.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
    } else {
      comments.value.unshift(res.data)
    }
    snackbar.success('评论成功')
    page.count = Math.ceil(res.data.article_info.len / 10)
  } else {
    snackbar.warning('没有内容')
  }
}

const changePage = async (page: number) => {
  await getComment(timeOrder.value, page)
}

const byTime = async () => {
  timeOrder.value === 'create_time' ? timeOrder.value = '-create_time' : timeOrder.value = 'create_time'
  await getComment(timeOrder.value, 1)
  page.page = 1
}

const open = (reply: number, user_info: any, k: number, replyUser = '') => {
  data.dialog = true
  data.reply_info.reply = reply
  data.reply_user_info = user_info
  data.reply_info.k = k
  reply_user.value = replyUser
}

const toReply = async () => {
  if (data.reply_info.content.trim().length) {
    // console.log(data.reply_info)
    const res = await addComment({
      article: props.article,
      content: data.reply_info.content,
      reply: data.reply_info.reply
    })
    if (reply_user.value) {
      res.data.reply_user = reply_user.value
    }
    emit('changeComment', res.data.article_info.comments)
    comments.value[data.reply_info.k].comment_replies.push(res.data)
    el.value.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
    dialogReset()
    reply_user.value = ''
    snackbar.success('回复成功')
  } else {
    snackbar.warning('没有内容')
  }
}

const viewMore = (id: number) => {
  data.flag_id = id
}

const dialogReset = () => {
  data.dialog = false
  data.reply_info.content = ''
}

const timeFormat = (time: string) => {
  const nowY = new Date().getFullYear()
  const rY = dayjs(time).format('YYYY')
  if (nowY.toString() === rY) {
    return dayjs(time).format('MM-DD HH:mm')
  } else {
    return dayjs(time).format('YYYY-MM-DD')
  }
}

// event callback
const onSelectEmoji = (emoji: any) => {
  if (data.dialog) {
    data.reply_info.content += emoji.i
  } else {
    comment.value += emoji.i
  }
}

</script>

<style scoped>

</style>
