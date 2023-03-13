<template>
  <Transition>
    <v-btn icon="mdi-chevron-up" color="primary" class="position-fixed"
           :style="mobile ? 'bottom:20px;right:20px;z-index:9999' : 'bottom:50px;right:80px;z-index:9999'"
           v-if="props.show" @click="scroll(0)">

    </v-btn>
  </Transition>
</template>

<script lang="ts" setup>
import {useDisplay} from "vuetify";
import anime from "animejs";

interface Props {
  show: boolean
}

const props = defineProps<Props>()

const {mobile} = useDisplay()

// const onEnter = (el: any, done: any) => {
//   anime({
//     targets: el,
//     // width: [0, 50],
//     // height: [0, 50],
//     scale:[0,1],
//     easing: 'linear',
//     duration: 100,
//     complete: done,
//   })
// }
// const onLeave = (el: any, done: any) => {
//   anime({
//     targets: el,
//     // width: [50, 0],
//     // height: [50, 0],
//     scale:[1,0],
//     easing: 'linear',
//     duration: 100,
//     complete: done,
//   })
// }
const scroll = (num: number) => {
  window.scrollTo({
    top: num,
    behavior: "smooth"
  });
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  scale: 0;
}
</style>