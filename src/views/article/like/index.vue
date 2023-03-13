<template>
  <div class="text-h4 font-weight-bold text-capitalize ma-6">
    {{ t('like_article') }}
  </div>
  <v-divider color="surface"/>
  <div v-if="data.articles.length">
    <TransitionGroup :css="false"
                     @enter="onEnter"
                     @leave="onLeave"
                     @before-leave="onBeforeLeave">
      <v-card v-for="(i,k) in data.articles" :key="i.id" class="ma-6" @click="goDetail(i.article_info.id)"
              :data-index="k">
        <v-card-text class="d-flex align-center justify-space-between">
          <v-avatar>
            <v-img
                :src="i.article_info.avatar"
                :alt="i.article_info.username"
            ></v-img>
          </v-avatar>
          <div class="text-h5">
            {{
              i.article_info.title && i.article_info.title.length > 6 ? i.article_info.title.slice(0, 6) + '...' : i.article_info.title
            }}
          </div>
          <v-btn icon="mdi-close" variant="flat" @click.stop="del(i.id)">

          </v-btn>
        </v-card-text>
      </v-card>
    </TransitionGroup>
  </div>
  <div v-else class="ma-6 text-h4 text-grey">
    {{ t('nothing') }}
  </div>
  <div ref="scrollRef" style="height: 1px"></div>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {useLike} from "@/store/like";
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import anime from "animejs";
import {useIntersect} from "@/utils/hook/Intersect";
import {useUser} from "@/store/user";

const {t} = useI18n()
const {getLikes, delLike} = useLike()
const {user} = useUser()
const router = useRouter()

const data = reactive({
  articles: [],
  page: {
    page: 1,
    count: 0
  }
})

const observer = ref({});
const scrollRef = ref({});


const enter = () => {
  console.log('enter')
  if (data.articles.length && data.page.page < data.page.count) {
    data.page.page += 1
    loadMore()
  }
}
const leave = () => {

}

onMounted(async () => {
  const {count, results} = await getLikes({user: user.username})
  data.articles = results
  data.page.count = Math.ceil(count / 10)
  observer.value = useIntersect(scrollRef.value as Element, enter, leave, false, {threshold: 1})
})

const goDetail = (id: number) => {
  router.push(`/article/${id}`)
}

const loadMore = async () => {
  const {results} = await getLikes({page: data.page.page})
  data.articles.push(...results)
}

const del = async (id: number) => {
  await delLike(id)
  data.articles = data.articles.filter((i: any) => i.id !== id)
}

const onEnter = (el: any, done: () => void) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateX: [300, 0],
    duration: 1000,
    easing: 'easeOutElastic',
    delay: el.dataset.index % 10 * 100, // build a custom delay based on the index
    complete: done,
  })
}

const onBeforeLeave = (el: any) => {
  // el.style.position = 'absolute'
}
const onLeave = (el: any, done: () => void) => {
  anime({
    targets: el,
    opacity: [1, 0],
    translateY: [0, 100],
    translateX: [0, 100],
    duration: 500,
    easing: 'linear',
    delay: 0, // reverse our custom delay
    complete: done,
  })
}

</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>