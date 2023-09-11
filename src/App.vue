<template>
  <v-app>
    <v-progress-linear :model-value="percent" color="primary" style="z-index: 9999" :height="2"
                       v-show="percent"></v-progress-linear>
    <v-app-bar height="22" elevation="2" style="-webkit-app-region: drag;">
      <v-spacer></v-spacer>
      <v-btn size="small" @click="setScreen('min')" style="-webkit-app-region: no-drag;">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn size="small" @click="setScreen('max')" style="-webkit-app-region: no-drag;">
        <v-icon>mdi-checkbox-blank-outline</v-icon>
      </v-btn>
      <v-btn size="small" class="mr-0" @click="setScreen('close')" style="-webkit-app-region: no-drag;">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <router-view></router-view>
    <snackbar/>
    <div class="name w-100 h-100 d-flex justify-center align-center" v-if="route.path==='/'" @click="jump">
      <TransitionGroup @enter="onEnter" @leave="onLeave" :css="false">
        <!--        <span class="name" @click="jump" v-if="flag">Kotae</span>-->
        <span v-for="(i,k) in name" :data-index="k" v-if="flag">{{ i }}</span>
      </TransitionGroup>
    </div>
    <fab :show="scrollTop>1000"/>
  </v-app>
</template>

<script setup lang="ts">
import Snackbar from '@/components/Snackbar/index.vue'
import Fab from '@/components/Fab/index'
import {useRoute, useRouter} from "vue-router";
import anime from "animejs";
import {onMounted, provide, ref} from "vue";
import {useSnackBar} from "@/store/snackbar";
import {useI18n} from "vue-i18n";

const router = useRouter()
const route = useRoute()
const snackbar = useSnackBar()
const {t} = useI18n()

const flag = ref(false)
const clickFlag = ref(false)
const name = 'Kotae'
const mode = ref(true)

const scrollTop = ref(0)
const percent = ref(0)

const token = localStorage.getItem('token') || ''

provide('mode', mode)
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

const jump = () => {
  if (clickFlag.value) {
    flag.value = false
    setTimeout(() => {
      if (token){
        router.push('/articles')
      }else {
        router.push('/login')
      }
    }, 1500)
  }
}

const setScreen = (status: string) => {
  window.controlAPI.setScreen(status)
}


onMounted(() => {
  flag.value = true
  setTimeout(() => {
    clickFlag.value = true
  }, 1400)
  window.addEventListener('scroll', e => {
    scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop;
  })
  window.controlAPI.checkUpdate((event, data) => {
    switch (data.key) {
      case "download_progress":
        percent.value = data.value
        break;
      case "update_available":
        snackbar.info(t('update_available'))
        break;
      case "update_downloaded":
        snackbar.success(t('update_downloaded'))
        break;
      case "error":
        snackbar.error(data.value)
        break;
      default:
        break;
    }
  })
})
</script>
<style>

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.name {
  font-size: 100px;
  font-weight: bold;
  font-style: italic;
  text-shadow: 3px 3px 2px #03DAC6;
  animation: shadow 5s linear infinite;
}

@keyframes shadow {
  0% {
    text-shadow: 3px 3px 2px #2196F3;
  }
  25% {
    text-shadow: 3px 3px 2px #349d17;
  }
  50% {
    text-shadow: 3px 3px 2px #835656;
  }
  75% {
    text-shadow: 3px 3px 2px #00ee53;
  }
  100% {
    text-shadow: 3px 3px 2px #2196F3;
  }
}
</style>
