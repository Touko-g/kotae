<template>
  <v-row class="pa-3 pa-sm-6 mb-0">
    <TransitionGroup :css="false"
                     @enter="onEnter">
      <v-col cols="12" :sm="mode ? 6 : 12" :md="mode ? 4 : 12" v-for="(i,k) in articles" :key="i.id" :data-index="k">
        <v-card class="ma-2 position-relative" @click="goDetail(i.id)">
          <v-sheet class="position-absolute mt-2" style="right: 0;rotate: 30deg;background-color: transparent"
                   v-if="!i.public">{{ t('deleted') }}
          </v-sheet>
          <v-card-title class="d-flex align-center">
            <v-btn icon variant="flat" @click.stop="router.push({name:'userinfo',params:{id:i.owner.id}})">
              <v-avatar
                size="40"
              >
                <v-img
                  :src="i.owner.avatar"
                  alt="avatar"
                ></v-img>
              </v-avatar>
            </v-btn>

            <div class="text-subtitle-2 ml-3">
              <div>{{ i.owner.username }}</div>
              <div class="text-grey" style="word-break: break-word">
                {{
                  i.owner.about.length ? i.owner.about.length < 12 ? i.owner.about : i.owner.about.slice(0, 12) + '...' : '...'
                }}
              </div>
            </div>
          </v-card-title>
          <v-divider/>
          <v-card-text style="height: 80px">
            <h3>
              {{ i.title }}
            </h3>
          </v-card-text>
          <v-card-actions class="d-flex align-center text-caption font-weight-bold text-grey" style="padding: 16px">
            <div>
              <span class="mr-2">{{ t('views') }}:{{ i.views }}</span>
              <span class="">{{ t('likes') }}:{{ i.likes }}</span>
            </div>
            <v-spacer/>
            <span>{{ dayjs(i.create_time).fromNow() }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </TransitionGroup>
  </v-row>
  <div ref="scrollRef"></div>
</template>

<script setup lang="ts">
import {getCurrentInstance, inject, onMounted, onUnmounted, reactive, ref, toRefs} from "vue";
import {useArticle} from "@/store/article";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {useSnackBar} from "@/store/snackbar";
import anime from "animejs";
import {useIntersect} from "@/utils/hook/Intersect";


const router = useRouter()
const {list} = useArticle()
const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs
const {t} = useI18n()
const snackbar = useSnackBar()
const data = reactive({
  articles: [] as any[],
  page: {
    page: 1,
    count: 0,
  }
})

const observer = ref<null | IntersectionObserver>(null);
const scrollRef = ref({});

const mode = inject('mode')

const goDetail = (id: number) => {
  router.push(`/article/${id}`)
}

const getArticles = async () => {
  const {results} = await list({page: data.page.page, order: '-create_time'})
  data.articles.push(...results)
}

const onEnter = (el: any, done: () => void) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateX: [100, 0],
    duration: 500,
    easing: 'easeInOutSine',
    delay: el.dataset.index % 10 * 100, // build a custom delay based on the index
    complete: done,
  })
}

const enter = () => {
  if (data.articles.length && data.page.page < data.page.count) {
    data.page.page += 1
    getArticles()
  }
}
const leave = () => {

}

onMounted(async () => {
  const {count, results} = await list({order: '-create_time'})
  data.articles = results
  data.page.count = Math.ceil(count / 10)
  observer.value = useIntersect(scrollRef.value as Element, enter, leave, false, {threshold: 1})
})
onUnmounted(() => {
  observer.value && observer.value.disconnect()
})
const {articles} = toRefs(data)
</script>

<style scoped>

</style>
