<template>
  <TransitionGroup :css="false" @enter="onEnter">
    <slot/>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import anime from "animejs";

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
</script>

<style scoped>

</style>