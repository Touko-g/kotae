<template>
  <v-row class="ma-2 ma-sm-6">
    <template v-for="(v,i) in data.photos" :key="i">
      <v-col :cols=data.cols[i]>
        <v-img :src="v.picture" cover height="100%"
               lazy-src="https://chen-1302611521.cos.ap-nanjing.myqcloud.com/blog/photo/Touko/thumbbig-287318.webp"
               @click="view(v,i)">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                size="60"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>
    </template>
  </v-row>
  <v-dialog
    v-model="photoView.dialog"
    fullscreen
    :scrim="false"
  >
    <v-card>
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <v-btn icon="mdi-close" variant="flat" @click="photoView.dialog=false"></v-btn>
          <p class="ml-4 text-h5">Photo View</p>
        </div>
      </template>
      <v-card-text>
        <v-img :src="photoView.photoData.picture" height="80vh">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                size="60"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="next">{{ t('next') }}</v-btn>
        <v-btn @click="pre">{{ t('pre') }}</v-btn>
        <v-btn @click="openDel" v-show="isSelf">{{ t('del') }}</v-btn>
        <v-spacer/>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="photoView.delDialog" width="auto">
    <v-card>
      <v-card-title>
        {{ t('del_photo') }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="photoView.delDialog = false"
        >
          {{ t('cancel') }}
        </v-btn>
        <v-btn
          variant="text"
          @click="delPhoto"
        >
          {{ t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div ref="scrollRef"></div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref,computed} from "vue";
import {usePhoto} from "@/store/photo";
import {useIntersect} from "@/utils/hook/Intersect";
import {useI18n} from "vue-i18n";
import {useSnackBar} from "@/store/snackbar";
import {useUser} from "@/store/user";

interface Props {
  username: string
}

const props = defineProps<Props>()

const {gets, del} = usePhoto()
const {t} = useI18n()
const snackbar = useSnackBar()
const {user} = useUser()


const observer = ref(null);
const scrollRef = ref({});

interface Page {
  page: number,
  count: number
}

interface dat {
  user: string | null,
  photos: object[],
  page: Page,
  cols: number[],
  flag: Boolean
}

const data: dat = reactive({
  photos: [],
  page: {
    page: 1,
    count: 0,
  },
  cols: [],
  flag: true
})

const photoView = reactive({
  dialog: false,
  delDialog: false,
  photoData: null,
  index: 0
})

const isSelf = computed(()=>{
  return user.username === props.username
})

const getPhotos = async () => {
  if (props.username) {
    const {results} = await gets({page: data.page.page, order: '-create_time', user: props.username})
    data.photos.push(...results)
  }
}

const enter = () => {
  if (data.photos.length && data.page.page < data.page.count) {
    data.page.page += 1
    getPhotos()
  }
}
const leave = () => {

}

const view = (data: any, index: number) => {
  photoView.dialog = true
  photoView.photoData = data
  photoView.index = index
}

const next = () => {
  if (photoView.index < data.photos.length - 1) {
    photoView.photoData = data.photos[photoView.index + 1]
    photoView.index++
  } else {
    snackbar.info(`${t('last_one')}`)
  }
}

const pre = () => {
  if (photoView.index > 0) {
    photoView.photoData = data.photos[photoView.index - 1]
    photoView.index--
  } else {
    snackbar.info(`${t('first_one')}`)
  }
}

const openDel = () => {
  photoView.delDialog = true
}

const delPhoto = async () => {
  await del(photoView.photoData.id)
  photoView.delDialog = false
  photoView.dialog = false
  data.photos.splice(photoView.index, 1)
}


const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min
}

for (let i = 0; i < 1000; i++) {
  if (i % 5 === 0) {
    data.cols.push(12)
  } else {
    if (data.flag) {
      data.cols.push(getRandomIntInclusive(4, 8))
      data.flag = false
    } else {
      data.cols.push(12 - data.cols[data.cols.length - 1])
      data.flag = true
    }
  }
}

onMounted(async () => {
  if (props.username) {
    const {count, results} = await gets({order: '-create_time', user: props.username})
    data.photos = results
    data.page.count = Math.ceil(count / 10)
    observer.value = useIntersect(scrollRef.value as Element, enter, leave, false, {threshold: 1})
  }
})
onUnmounted(() => {
  observer.value && observer.value.disconnect()
})

</script>

<style scoped>

</style>
