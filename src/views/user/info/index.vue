<template>
  <v-row class="ma-2 ma-sm-6" v-if="userInfo">
    <v-col cols="12" sm="12" md="4" lg="3">
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar
                size="100"
            >
              <v-img
                  sizes="100"
                  :src="userInfo.avatar"
                  :alt="userInfo.username"
              ></v-img>
            </v-avatar>
            <h1 class="my-4">{{ userInfo.username }}</h1>
            <p class="text-caption mt-1">
              {{ userInfo.email }}
            </p>
            <v-divider class="my-3" color="surface"></v-divider>
            <div style="word-break: break-all">
              {{ userInfo.about }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn variant="text" @click="jump">{{ t('edit_user') }}</v-btn>
          <v-spacer/>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="8" lg="9">
      <v-card>
        <v-card-title>
          <div class="d-flex">
            {{ t('my_article') }}
            <v-spacer/>
            <v-btn-toggle color="primary" density="compact" v-model="data.by">
              <v-btn variant="text">{{ t('newest') }}</v-btn>
              <v-btn variant="text">{{ t('like') }}</v-btn>
            </v-btn-toggle>
          </div>
        </v-card-title>
        <v-divider color="surface"/>
        <v-card-text>
          <v-list lines="two">
            <v-list-item v-for="i in articles" :key="i.id" @click="router.push(`/article/${i.id}`)">
              <template v-slot:title>
                <span>{{ i.title }}</span>
              </template>

              <template v-slot:subtitle>
                <div class="d-flex justify-space-between">
                  <div>
                    <span class="text-caption">{{ t('views') }}:{{ i.views }} </span>
                    <span class="text-caption mx-2">{{ t('likes') }}:{{ i.likes }}</span>
                    <span class="text-caption">   {{ t('comment') }}:{{ i.comments }}</span>
                  </div>
                  <span class="text-caption">
                  {{ dayjs(i.create_time).fromNow() }}
                 </span>
                </div>
              </template>
            </v-list-item>
          </v-list>
          <v-pagination
              v-if="page.count"
              :length="page.count"
              rounded="circle"
              @update:modelValue="changePage"
              v-model="page.page"
              density="compact"
          ></v-pagination>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {getCurrentInstance, onMounted, reactive, ref, toRefs, watch} from "vue";
import {useUser} from "@/store/user";
import {useI18n} from "vue-i18n";
import {useArticle} from "@/store/article";
import {useRouter} from "vue-router";

const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs

const router = useRouter()

const {t} = useI18n()
const {get,user} = useUser()
const {list} = useArticle()
const data = reactive({
  userInfo: null,
  articles: [],
  page: {
    page: 1,
    pagesize: 7,
    count: 0,
    order: '-create_time'
  },
  by: 0
})

watch(() => data.by, async value => {
  if (value === 0) {
    data.page.order = '-create_time'
  } else {
    data.page.order = '-likes'
  }
  await getArticles(data.page.page)
})

onMounted(async () => {
  await init(user.id)
})

const getArticles = async (page: number) => {
  const {results} = await list({author: data.userInfo.username, pagesize: data.page.pagesize, page, order: data.page.order})
  data.articles = results
}

const init = async (id: number) => {
  data.userInfo = await get(id)
  const {count, results} = await list({author: data.userInfo.username, pagesize: data.page.pagesize, order: data.page.order})
  data.articles = results
  data.page.count = Math.ceil(count / data.page.pagesize)
}

const changePage = async (page: number) => {
  await getArticles(page)
}

const jump = () => {
  router.push({name: 'user_edit'})
}

const {userInfo, page, articles} = toRefs(data)

</script>

<style scoped>

</style>