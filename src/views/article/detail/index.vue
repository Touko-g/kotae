<template>
  <v-card variant="text" v-if="article" class="pa-2 pa-sm-8">
    <v-card-title>
      <div class="d-flex">
        <v-btn size="60" icon variant="flat" @click="router.push({name:'userinfo',params:{id:article.owner.id}})">
          <v-avatar
              size="60"
          >
            <v-img
                :src="article.owner.avatar"
                :alt="article.owner.username"
            ></v-img>
          </v-avatar>
        </v-btn>
        <div class="d-flex flex-column justify-center ml-4">
          <span>{{ article.owner.username }}</span>
          <div class="text-subtitle-2 text-grey">
            <span>{{ dayjs(article.create_time).fromNow() }}</span><span class="mx-2">|</span>
            <span>{{ t('views') }}:{{ article.views }}</span><span class="mx-2">|</span>
            <span>{{ t('comment') }}:{{ article.comments }}</span>
          </div>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="mt-4">
      <div class="text-h4 font-weight-bold" style="overflow-wrap: break-word">{{ article.title }}</div>
    </v-card-text>
    <div style="padding: 0 1rem 2rem 1rem">
      <v-divider class="my-2" color="surface"/>
      <div v-html="article.content" class="detail">

      </div>
      <div class="d-sm-flex align-center mt-6">
        <h3 class="text-grey text-capitalize mr-2">{{ t('tag') }}:</h3>
        <v-chip-group
            active-class="primary--text"
            column
        >
          <v-chip
              v-for="tag in article.tag"
              :key="tag"
              @click="router.push({params: {name:tag.name, type: 'tag'}, name: 'article_search'})"
          >
            {{ tag.name }}
          </v-chip>
        </v-chip-group>
      </div>
      <v-divider class="my-2" color="surface"/>
      <div class="d-flex justify-space-between">
        <div class="d-flex">
          <v-btn variant="text" icon="mdi-comment-outline"></v-btn>
          <span>{{ comments }}</span>
        </div>
        <div class="d-flex">
          <v-btn icon="mdi-circle-edit-outline" variant="text" v-if="user.id === article.owner.id"
                 @click="router.push(`/article/edit/${article.id}`)">
          </v-btn>
          <v-btn icon="mdi-trash-can-outline" variant="text"
                 v-if="article.public&&(user.id === article.owner.id || user.id === 1)" @click="openDel">
          </v-btn>
          <v-btn icon="mdi-thumb-up-outline" variant="text" @click="toggleLike(article.id)"
                 :color="likeFlag&&'primary'"/>
          <span :class="likeFlag&&'text-primary'">{{ likes }}</span>
        </div>
      </div>
    </div>
    <Comment :userId="user.id" :article="article.id" @changeComment="changeComment"/>
  </v-card>
  <v-dialog v-model="delDialog" width="auto">
    <v-card>
      <v-card-title>
        {{ t('del_article') }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            variant="text"
            @click="delDialog = false"
        >
          {{ t('cancel') }}
        </v-btn>
        <v-btn
            variant="text"
            @click="delArticle"
        >
          {{ t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive, ref, watch} from "vue";
import {useArticle} from "@/store/article";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useLike} from "@/store/like";
import Comment from "@/components/Comment"
import {useUser} from "@/store/user";
import {useDisplay} from "vuetify";

const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs
const {t} = useI18n()
const {user} = useUser()
const router = useRouter()
const {smAndDown, xs} = useDisplay()


interface Props {
  id: string | number
}

interface Article {
  comments?: number
  content?: string
  create_time?: string
  id?: number
  likes?: number
  owner?: object
  tag?: []
  title?: string
  update_time?: string
  views?: number
}

const props = defineProps<Props>()

const {get, del} = useArticle()
const {addLike, getLikes} = useLike()
const article = ref(null)

const likes = ref(0)
const likeFlag = ref(false)

const comments = ref(0)

const img = ref({
      width: '',
      height: ''
    }
)

const delDialog = ref(false)
watch(() => props.id, async (value, oldValue) => {
  if (value) {
    await init(value)
  }
})
watch(smAndDown, value => {
  if (value) {
    img.value = {
      width: '100%',
      height: '100%'
    }
  } else {
    img.value = {
      width: '',
      height: ''
    }
  }
}, {
  immediate: true
})

onMounted(async () => {
  await init(props.id)
})

const init = async (id: number | string) => {
  article.value = await get(id)
  likes.value = article.value.likes
  comments.value = article.value.comments
  likeFlag.value = await isLike(user.id)
}

const isLike = async (userId: any) => {
  const {results} = await getLikes({article: props.id, pagesize: 1000})
  if (results) {
    const val = results.map((item: { user_info: { id: any; }; }) => item.user_info.id)
    return val.includes(userId)
  }
  return false
}

const toggleLike = async (id: number) => {
  const res = await addLike({article: id})
  if (res) {
    likes.value += 1
    likeFlag.value = true
  }
}

const changeComment = (num: number) => {
  comments.value = num
}

const openDel = () => {
  delDialog.value = true
}

const delArticle = async () => {
  await del(article.value.id)
  delDialog.value = false
  router.push('/articles')
}

</script>

<style scoped>
.detail :deep(img) {
  width: v-bind('img.width');
  height: v-bind('img.height');
}
</style>
