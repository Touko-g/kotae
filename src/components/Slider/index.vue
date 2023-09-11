<template>
  <div class="h-100 d-flex flex-column align-center">
    <div class="top d-flex justify-center align-center" style="flex: 1">
      <v-btn icon="mdi-chevron-up" variant="flat" @click="pre" v-show="sum>1" size="42">

      </v-btn>
    </div>
    <div class="center d-flex flex-column justify-center overflow-hidden" style="flex: 10" ref="parent">
        <slot/>
    </div>
    <div class="bottom d-flex justify-center align-center" style="flex: 1">
      <v-btn icon="mdi-chevron-down" variant="flat" @click="next" v-show="sum>1" size="42">

      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent, onMounted, ref, provide} from "vue";

const sum = ref(0)
const currentIndex = ref(1)
const parent = ref(null)
const dir = ref('')

provide('currentIndex', currentIndex)
provide('dir', dir)

const next = () => {
  dir.value = 'next'
  if (currentIndex.value < sum.value) {
    currentIndex.value++
  } else {
    currentIndex.value = 1
  }


}
const pre = () => {
  dir.value = 'pre'
  if (currentIndex.value > 1) {
    currentIndex.value--
  } else {
    currentIndex.value = sum.value
  }

}
onMounted(() => {
  sum.value = parent.value.children.length
})
</script>

<style scoped>

</style>
