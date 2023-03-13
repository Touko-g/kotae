<template>
  <div v-if="route.path!=='/'" class="w-100 h-100 d-flex justify-center align-center">
    <div class="d-flex justify-center align-center">
      <div class="text-uppercase">{{ t('not') }}</div>
      <v-divider vertical class="mx-2"/>
      <v-btn variant="text" @click="router.push('/articles')">Go Back</v-btn>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
const router = useRouter()
const route = useRoute()
const {t} =useI18n()
</script>

<style scoped>

</style>