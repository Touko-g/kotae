<template>
    <v-snackbar v-model="message.show" :color="message.color" :timeout="message.timeout"
                :content-class="message.contentClass" :location="message.location" :transition="message.transition">
      {{ message.text }}
      <template #actions>
        <v-btn icon="mdi-close" size="small" @click="close"></v-btn>
      </template>
    </v-snackbar>
</template>

<script lang="ts">
import {defineComponent, computed} from "vue";
import {useSnackBar} from "@/store/snackbar";

export default defineComponent({
  name: 'index',
  setup() {
    const store = useSnackBar()
    const message = computed(() => {
      return store.$state
    })
    const close = () => {
      store.show = false
    }
    return {
      message, close
    }
  }
})
</script>

<style scoped>

</style>