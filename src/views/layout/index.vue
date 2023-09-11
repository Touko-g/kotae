<template>
  <v-navigation-drawer width="60" v-if="!mobile" permanent elevation="3" class="d-flex flex-column">
    <div class="d-flex justify-center align-center h-100">
      <v-btn icon="mdi-circle-edit-outline" variant="flat" v-if="!route.path.startsWith('/article/edit')"
             @click="router.push('/article/create')">
      </v-btn>
    </div>
  </v-navigation-drawer>
  <v-app-bar
  >
    <v-app-bar-title @click="router.push({name:'articles'})" class="font-italic font-weight-bold text-primary">
      <TransitionGroup @enter="onEnter" @leave="onLeave" :css="false">
        <span v-for="(i,k) in 'KOTAE'" :data-index="k" v-if="titleFlag">{{ i }}</span>
      </TransitionGroup>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="show=true">
      <v-icon>mdi-magnify</v-icon>
      <!--      <v-tooltip-->
      <!--          activator="parent"-->
      <!--          location="start"-->
      <!--      > {{ t('search') }}-->
      <!--      </v-tooltip>-->
    </v-btn>
    <v-btn icon @click="router.push('/article/like')">
      <v-icon>mdi-heart</v-icon>
      <!--      <v-tooltip-->
      <!--          activator="parent"-->
      <!--          location="bottom"-->
      <!--      > {{ t('likes') }}-->
      <!--      </v-tooltip>-->
    </v-btn>
    <v-btn icon @click="toggleTheme">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-btn icon @click="changeLanguage">
      <v-icon>mdi-translate</v-icon>
    </v-btn>
    <Fade>
      <v-btn icon="mdi-circle-edit-outline" variant="flat" v-if="!route.path.startsWith('/article/edit')&&mobile"
             @click="router.push('/article/create')">
      </v-btn>
    </Fade>
    <v-menu location="bottom">
      <template v-slot:activator="{ props }">
        <v-badge color="error" dot v-if="notice">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-badge>
        <v-btn icon v-bind="props" v-else>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list width="225">
        <v-list-item prepend-icon="mdi-message-reply-outline" @click="router.push({name:'user_message'})">
          <div class="w-100 d-flex justify-space-between align-center">
            {{ t('message') }}
            <v-badge
              v-if="notice"
              color="primary"
              :content="notice"
              inline
            ></v-badge>
          </div>
        </v-list-item>
        <v-list-item prepend-icon="mdi-emoticon-lol-outline" @click="router.push({name:'chat_public'})" v-show="mobile">
          {{ t('public_chat') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-palette" @click="ct=true" v-show="mobile">
          {{ t('ct') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-key" @click="router.push({name:'user_editpsw'})">
          {{ t('change_psw') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-human" @click="router.push({name:'userinfo',params:{id:user.user.id}})">
          {{ t('about_me') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-logout" @click="logout">
          {{ t('logout') }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
  <v-navigation-drawer width="60" v-if="!mobile" permanent location="right" elevation="4">
    <slider>
      <slider-item :key="4">
        <v-sheet class="d-flex flex-column">
          <v-btn icon v-for="i in themes" :key="i.name" :color="i.color" @click="theme.global.name.value=i.name"
                 class="my-2" size="42">
          </v-btn>
          <v-btn icon @click="ct=true" size="42">
            <v-icon>mdi-palette</v-icon>
            <v-tooltip
              activator="parent"
              location="start"
            > {{ t('ct') }}
            </v-tooltip>
          </v-btn>
        </v-sheet>
      </slider-item>
      <slider-item :key="2">
        <v-sheet class="d-flex flex-column">
          <v-btn class="my-2" icon="mdi-dots-grid" @click="mode=true" size="42"/>
          <v-btn icon="mdi-format-list-bulleted" @click="mode=false" size="42"/>
        </v-sheet>
      </slider-item>
      <slider-item :key="3">
        <v-btn class="my-2" icon @click="router.push({name:'chat_public'})" size="42">
          <v-icon>mdi-emoticon-lol-outline</v-icon>
          <v-tooltip
            activator="parent"
            location="start"
          > {{ t('public_chat') }}
          </v-tooltip>
        </v-btn>
      </slider-item>
      <slider-item :key="1">
        <v-btn class="my-2" :icon="audioPlay ? 'mdi-music-note-off' :'mdi-music-note-eighth'"
               @click="play" size="42">
        </v-btn>
        <audio ref="audio"
               :src="audioUrl"
               preload="auto"
               loop></audio>
      </slider-item>
    </slider>
  </v-navigation-drawer>
  <v-main>
    <router-view v-if="config.isRouterAlive"/>
  </v-main>
  <v-dialog v-model="show" :fullscreen="mobile" width="auto">
    <v-card :width="mobile ? 'auto' : 800" height="500">
      <v-card-title>
        {{ t('search_by') }}:
        <v-radio-group density="compact" :inline="!mobile" v-model="radioGroup">
          <v-radio
            class="text-overline mx-2"
            v-for="n in radios"
            :key="n"
            :label="n"
            :value="n"
          ></v-radio>
        </v-radio-group>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              :label="t('search_article')"
              v-model="searchValue"
              density="comfortable"
              :hint="`by ${radioGroup}`"
              variant="outlined"
              clearable
              @update:modelValue="searchArticle"
            ></v-text-field>
            <div class="d-flex justify-space-between align-center">
              <p class="text-button">{{ topShow ? t('tts') : t('sla') + ' : ' + searchValue }}</p>
              <v-btn variant="text" size="small" v-show="!topShow" @click="jump(searchValue)">view all</v-btn>
            </div>

            <v-divider/>
          </v-col>
          <Transition>
            <v-col cols="12" v-if="topShow">
              <v-list variant="flat" @click:select="selectItem">
                <v-list-item v-for="(i,k) in tops" :key="i" :value="i" active-color="primary"
                             lines="two"
                             density="compact"
                             @click="jump(i.name)"
                >
                  <v-list-item-title class="d-flex align-center">
                    <v-icon :icon="`mdi-numeric-${k+1}`" size="x-large" class="mx-1" color="white"></v-icon>
                    {{ i.name.length > 6 ? i.name.slice(0, 6) + '...' : i.name }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-icon icon="mdi-fire"></v-icon>
                    <span class="text-subtitle-1 text-grey" style="width: 20px">{{ i.hot }}</span>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" v-else>
              <v-list variant="flat">
                <v-list-item v-for="(i,k) in results" :key="i" :value="i" active-color="primary"
                             lines="two"
                             density="compact"
                             @click="goDetail(i.id)"
                >
                  <v-list-item-title class="d-flex align-center">
                    <v-icon :icon="`mdi-numeric-${k+1}`" size="x-large" class="mx-1" color="white"></v-icon>
                    {{ i.title.length > 6 ? i.title.slice(0, 6) + '...' : i.title }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <span class="text-grey">{{ i?.owner?.username }}</span>
                    <v-divider class="mx-2" vertical/>
                    <span class="text-body-2 text-grey">{{ dayjs(i.create_time).fromNow() }}</span>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
          </Transition>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="ct" width="auto">
    <v-card :width="mobile ? 300 : 800" height="500">
      <v-card-title class="d-flex justify-space-between">
        {{ t('ct') }}
        <v-btn variant="text" @click="ct=false" icon="mdi-close"></v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-color-picker
              v-model="color"
              class="ma-2"
              :swatches="swatches"
              show-swatches
              style="background: #999999 !important;"
            ></v-color-picker>
          </v-col>
          <v-col class="d-flex flex-column justify-center">
            <div class="d-flex">
              <v-checkbox
                v-model="setTheme.background.check"
                :color="setTheme.background.color"
                label="background"
              ></v-checkbox>
              <v-sheet width="50" height="50" :color="setTheme.background.color"></v-sheet>
            </div>
            <div class="d-flex">
              <v-checkbox
                v-model="setTheme.surface.check"
                :color="setTheme.surface.color"
                label="surface"
              ></v-checkbox>
              <v-sheet width="50" height="50" :color="setTheme.surface.color"></v-sheet>
            </div>
            <div class="d-flex">
              <v-checkbox
                v-model="setTheme.primary.check"
                :color="setTheme.primary.color"
                label="primary"
              ></v-checkbox>
              <v-sheet width="50" height="50" :color="setTheme.primary.color"></v-sheet>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {reactive, toRefs, watch, getCurrentInstance, onMounted, ref, toRef, inject, provide, computed} from "vue";
import {useDisplay, useTheme} from "vuetify"
import {useI18n} from "vue-i18n";
import {useAuth} from "@/store/auth";
import {useRoute, useRouter} from "vue-router";
import {useArticle} from "@/store/article";
import * as _ from "lodash";
import Fade from "@/components/Fade"
import Slider from "@/components/Slider"
import SliderItem from "@/components/Slider/SliderItem"
import {useUser} from "@/store/user";
import anime from "animejs";
import {useComment} from "@/store/commnet";
import {useConfig} from "@/store/config";


const {mobile} = useDisplay()
const theme = useTheme()
const {t, locale} = useI18n()
const {logOut} = useAuth()
const {list, searchList, addSearch} = useArticle()
const user = useUser()
const {getNotice} = useComment()
const config = useConfig()

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs

const refresh_token = localStorage.getItem('refresh') || ''
const search = reactive({
  show: false,
  topShow: true,
  searchValue: '',
  results: [],
  radioGroup: 'title',
  radios: ['title', 'content', 'tag', 'author'],
  tops: [],
})

const themes = ref([
  {
    name: "ZF",
    color: "#835656"
  },
  {
    name: "GY",
    color: "#00f3eb"
  },
])
const ct = ref(false)
const color = ref(null)
const swatches = [
  ['#FF0000', '#AA0000', '#550000'],
  ['#FFFF00', '#AAAA00', '#555500'],
  ['#00FF00', '#00AA00', '#005500'],
  ['#00FFFF', '#00AAAA', '#005555'],
  ['#0000FF', '#0000AA', '#000055'],
]
const setTheme = ref({
  primary: {
    color: '',
    check: false
  },
  background: {
    color: '',
    check: false
  },
  surface: {
    color: '',
    check: false
  },
})

const titleFlag = ref(false)

const themeName = toRef(theme, 'name')
// 列表、栅格展现方式
const mode = inject('mode')

// 未读消息
const notice = ref(0)

const audio = ref(null)
const audioUrl = computed(() => `https://chen-1302611521.cos.ap-nanjing.myqcloud.com/music/deep_${Math.floor(Math.random() * (6 - 1 + 1)) + 1}.mp3`)
const audioPlay = ref(false)

provide('notice', notice)

watch(color, (value) => {
  if (setTheme.value.primary.check || setTheme.value.background.check || setTheme.value.surface.check) {
    theme.global.name.value = 'custom'
    console.log()
    console.log(theme)
    if (setTheme.value.primary.check) {
      setTheme.value.primary.color = value
      theme.themes.value.custom.colors.primary = value
    }
    if (setTheme.value.background.check) {
      setTheme.value.background.color = value
      theme.themes.value.custom.colors.background = value
    }
    if (setTheme.value.surface.check) {
      setTheme.value.surface.color = value
      theme.themes.value.custom.colors.surface = value
    }
  }
})

watch(themeName, value => {
  if (value) {
    titleFlag.value = false
    setTimeout(() => {
      titleFlag.value = true
    })

  }
})

watch(() => search.show, async (value, oldValue) => {
  if (value) {
    search.tops = await searchList()
  }
})
watch(() => search.results.length, (value) => {
  value ? search.topShow = false : search.topShow = true
})
watch(() => search.radioGroup, async value => {
  if (search.searchValue.trim().length) {
    search.results = await list({[value]: search.searchValue})
  }
})

onMounted(async () => {
  const token = localStorage.getItem('token') || ''
  if (token) {
    const id = JSON.parse(decodeURIComponent(escape(window.atob(token.split(".")[1])))).user_id
    user.user = await user.get(id)
  }
  titleFlag.value = true
  const {count} = await getNotice({read: false, pagesize: 10000})
  notice.value = count
})

const logout = async () => {
  await logOut({refresh_token})
  localStorage.removeItem('refresh')
  localStorage.removeItem('token')
  await router.push('/login')
}

const goDetail = (id: number) => {
  router.push(`/article/${id}`)
  search.show = false
}

const jump = (name: string) => {
  router.push({name: 'article_search', params: {name, type: search.radioGroup}})
  search.show = false
}

const searchArticle = _.debounce(async (e: string) => {
  if (e.length) {

    const {results} = await list({[search.radioGroup]: e})
    search.results = results
    await addSearch({name: e})
  } else {
    search.results.length = 0
  }
}, 500)

const selectItem = async (e: any) => {
  // console.log(e)
}

const changeLanguage = () => {
  locale.value === 'en' ? locale.value = 'cn' : locale.value = 'en'
  dayjs.locale() === 'en' ? dayjs.locale('zh-cn') : dayjs.locale('en')
}
const toggleTheme = () => {
  // console.log(theme.global.name.value, theme.global.current.value)
  theme.global.name.value === 'light' ? theme.global.name.value = 'dark' : theme.global.name.value = 'light'
}

const play = () => {
  if (audio.value) {
    audioPlay.value = !audioPlay.value
    audio.value.volume = 0.3
    audioPlay.value ? audio.value.play() : audio.value.pause()
  }
}

const onEnter = (el: any, done: any) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateX: [100, 0],
    easing: 'easeOutElastic',
    delay: el.dataset.index * 100,
    duration: 1200,
    complete: done,
  })
}
const onLeave = (el: any, done: any) => {
  anime({
    targets: el,
    opacity: [1, 0],
    translateY: [0, -100],
    duration: 1000,
    easing: 'easeOutElastic',
    delay: (5 - el.dataset.index + 1) * 100, //
    complete: done,
  })
}

const {show, topShow, searchValue, results, radioGroup, radios, tops} = toRefs(search)

</script>

<style scoped>
.v-radio-group :deep(.v-input__details) {
  display: none !important;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(-50%);
}
</style>
