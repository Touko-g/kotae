<template>
  <div class="text-h4 font-weight-bold text-capitalize ma-6">
    {{ t('search_list') }} : {{ route.params.name }}
  </div>
  <v-divider color="surface"/>
  <div v-if="data.articles.length">
    <delay-fade>
      <v-card class="ma-6" v-for="(i,k) in data.articles" :key="i.id" @click="goDetail(i.id)" :data-index="k">
        <v-card-text class="h-100">
          <v-row class="h-100">
            <v-col cols="2" sm="1">
              <v-menu location="end">
                <template v-slot:activator="{ props }">
                  <v-btn
                      icon
                      v-bind="props"
                      variant="flat"
                  >
                    <v-avatar
                    >
                      <v-img
                          :src="i.owner.avatar"
                          :alt="i.owner.username"
                      ></v-img>
                    </v-avatar>
                  </v-btn>
                </template>
                <v-card width="280" style="word-break: break-word">
                  <v-card-text>
                    <div class="mx-auto text-center">
                      <v-avatar
                      >
                        <v-img
                            :src="i.owner.avatar"
                            :alt="i.owner.username"
                        ></v-img>
                      </v-avatar>
                      <h3>{{ i.owner.username }}</h3>
                      <p class="text-caption mt-1">
                        {{ i.owner.email }}
                      </p>
                      <v-divider class="my-3" color="surface"></v-divider>
                      <div>
                        {{ i.owner.about }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
            <v-col cols="10" sm="11" class="d-flex flex-column">
              <div class="mt-1 mb-2 d-flex justify-space-between">
              <span class="text-h5">   {{
                  i.title && i.title.length > 6 ? i.title.slice(0, 6) + '...' : i.title
                }}</span>
                <span class="text-subtitle-2">{{ dayjs(i.create_time).fromNow() }}</span>
              </div>
              <div class="d-flex justify-end h-75">
                <div class="text-subtitle-2">
                  <span>{{ t("likes") }}:{{ i.likes }}</span>
                  <span class="ml-2">{{ t("views") }}:{{ i.views }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </delay-fade>
  </div>
  <div v-else class="ma-6 text-h4 text-grey">
    {{ t('nothing') }}
  </div>
  <div ref="scrollRef" style="height: 1px"></div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive, ref, watch} from "vue";
import {useArticle} from "@/store/article";

import {useI18n} from "vue-i18n";
import {useIntersect} from "@/utils/hook/Intersect";
import DelayFade from '@/components/DelayFade'

const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const {list} = useArticle()
const data = reactive({
  articles: [],
  page: {
    page: 1,
    count: 0
  }
})

watch(() => route.params, async value => {
  const {count, results} = await list({[route.params.type as any]: route.params.name as string})
  data.articles = results
  data.page.count = Math.ceil(count / 10)
  data.page.page = 1
})

const observer = ref({});
const scrollRef = ref({});


const enter = () => {
  if (data.articles.length && data.page.page < data.page.count) {
    data.page.page += 1
    loadMore()
  }
}
const leave = () => {

}

onMounted(async () => {
  if (route.params.name) {
    const {count, results} = await list({[route.params.type as any]: route.params.name as string})
    data.articles = results
    data.page.count = Math.ceil(count / 10)
  }
  observer.value = useIntersect(scrollRef.value as Element, enter, leave, false, {threshold: 1})
})

const goDetail = (id: number) => {
  router.push(`/article/${id}`)
}

const loadMore = async () => {
  const {results} = await list({[route.params.type as any]: route.params.name as string, page: data.page.page})
  data.articles.push(...results)
}

</script>

<style scoped>
</style>