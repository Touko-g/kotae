<template>
  <Transition @enter="onEnter" @leave="onLeave">
    <div v-show="currentIndex===index">
      <slot/>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {toRefs, watch, getCurrentInstance, ref, reactive, inject} from "vue";
import anime from "animejs";

const instance = getCurrentInstance()
const state = reactive({
  currentIndex: inject('currentIndex'),
  index: instance?.vnode.key,
  dir: inject('dir')
})

const onEnter = (el: any, done: any) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: state.dir === 'next' ? [-1000, 0] : [1000, 0],
    easing: 'linear',
    duration: 500,
    complete: done,
  })
}
const onLeave = (el: any, done: any) => {
  anime({
    targets: el,
    opacity: [1, 0],
    translateY: state.dir === 'next' ? [0, 1000] : [0, -1000],
    duration: 500,
    easing: 'linear',
    complete: done,
  })
}
const {currentIndex, index} = toRefs(state)
</script>

<style scoped>

</style>