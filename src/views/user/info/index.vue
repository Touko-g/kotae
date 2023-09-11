<template>
  <v-row class="ma-2 ma-sm-6" v-if="userInfo">
    <v-col cols="12" sm="12" md="4" lg="3">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar
                  size="100"
                >
                  <v-img
                    sizes="100"
                    :src="userInfo.avatar"
                    :alt="userInfo.username"
                  ></v-img>
                </v-avatar>
                <h1 class="my-4">{{ userInfo.username }}</h1>
                <p class="text-caption mt-1">
                  {{ userInfo.email }}
                </p>
                <v-divider class="my-3" color="surface"></v-divider>
                <div style="word-break: break-all">
                  {{ userInfo.about }}
                </div>
              </div>
            </v-card-text>
            <v-card-actions v-show="isSelf">
              <v-spacer/>
              <v-btn variant="text" @click="jump">{{ t('edit_user') }}</v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-sheet class="d-flex align-center">
                <v-icon class="mr-2">mdi-camera</v-icon>
                {{ t('photo_album') }}
                <v-spacer/>
                <v-btn flat size="small" v-if="photo.length" @click="router.push({name:'photo',params:{username:userInfo.username}})">{{ t('more') }}</v-btn>
              </v-sheet>
            </v-card-title>
            <v-card-text>
              <v-sheet v-if="photo.length">
                <v-carousel :show-arrows="false" height="200" hide-delimiters cycle>
                  <v-carousel-item v-for="i in photo"
                                   :src="i.picture"
                                   cover
                  ></v-carousel-item>
                </v-carousel>

              </v-sheet>
              <v-sheet height="150" v-else class="d-flex justify-center align-center">
                <span class="font-weight-bold text-h5 text-grey">{{ t('no_photo') }}</span>
              </v-sheet>
              <v-sheet class="mt-4" v-show="isSelf">
                <v-file-input
                  prepend-icon="mdi-image-plus"
                  chips
                  density="compact"
                  accept="image/png, image/jpeg, image/bmp"
                  variant="outlined"
                  :label="t('photo')"
                  v-model="photoData.files"
                  @update:modelValue="upload"
                >
                  <template v-slot:selection="{ fileNames }">
                    <template v-for="fileName in fileNames" :key="fileName">
                      <v-chip
                        size="small"
                        label
                        color="primary"
                      >
                        {{ fileName }}
                      </v-chip>
                    </template>
                  </template>
                </v-file-input>
                <v-text-field density="compact" variant="outlined" :label="t('photo_name')"
                              v-model="photoData.photoName"></v-text-field>
                <v-sheet class="d-flex">
                  <v-btn size="small" @click="uploadPhoto" :disabled="!photoData.photoPath">{{ t('upload') }}</v-btn>
                  <v-btn size="small" class="ml-2" @click="reset">{{ t('reset') }}</v-btn>
                </v-sheet>
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="12" md="8" lg="9">
      <v-card>
        <v-card-title>
          <div class="d-flex">
            {{ t('my_article') }}
            <v-spacer/>
            <v-btn-toggle color="primary" density="compact" v-model="data.by">
              <v-btn variant="text">{{ t('newest') }}</v-btn>
              <v-btn variant="text">{{ t('like') }}</v-btn>
            </v-btn-toggle>
          </div>
        </v-card-title>
        <v-divider color="surface"/>
        <v-card-text>
          <v-list lines="two">
            <v-list-item v-for="i in articles" :key="i.id" @click="router.push(`/article/${i.id}`)">
              <template v-slot:title>
                <span>{{ i.title }}</span>
              </template>

              <template v-slot:subtitle>
                <div class="d-flex justify-space-between">
                  <div>
                    <span class="text-caption">{{ t('views') }}:{{ i.views }} </span>
                    <span class="text-caption mx-2">{{ t('likes') }}:{{ i.likes }}</span>
                    <span class="text-caption">   {{ t('comment') }}:{{ i.comments }}</span>
                  </div>
                  <div class="text-caption" v-show="width>400">
                    {{ dayjs(i.create_time).fromNow() }}
                  </div>
                </div>
                <div class="text-caption" v-show="width<400">
                  {{ dayjs(i.create_time).fromNow() }}
                </div>
              </template>
            </v-list-item>
          </v-list>
          <v-pagination
            v-if="page.count"
            :length="page.count"
            rounded="circle"
            @update:modelValue="changePage"
            v-model="page.page"
            density="compact"
          ></v-pagination>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {getCurrentInstance, onMounted, reactive, ref, toRefs, watch, computed} from "vue";
import {useUser} from "@/store/user";
import {useI18n} from "vue-i18n";
import {useArticle} from "@/store/article";
import {usePhoto} from "@/store/photo";
import {useRouter} from "vue-router";
import {useDisplay} from "vuetify";
import COS from "cos-js-sdk-v5";
import {useConfig} from "@/store/config";
import {useSnackBar} from "@/store/snackbar";

interface Props {
  id: string | number
}

const props = defineProps<Props>()

const {getCosKey} = useConfig()
const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs
const snackbar = useSnackBar()

const router = useRouter()
const {width} = useDisplay()

const {t} = useI18n()
const {get, user} = useUser()
const {list} = useArticle()
const {gets, add} = usePhoto()

const data = reactive({
  userInfo: null,
  articles: [],
  page: {
    page: 1,
    pagesize: 7,
    count: 0,
    order: '-create_time'
  },
  by: 0
})

const photo = ref([])
const photoData = reactive({
  files: [],
  photoName: '',
  photoPath: ''
})

watch(() => data.by, async value => {
  if (value === 0) {
    data.page.order = '-create_time'
  } else {
    data.page.order = '-likes'
  }
  await getArticles(data.page.page)
})

watch(()=>props.id,async value => {
  await init(value)
})

const isSelf = computed(() => {
  return props.id == user.id
})

onMounted(async () => {
  await init(props.id)
})

const getArticles = async (page: number) => {
  const {results} = await list({
    author: data.userInfo.username,
    pagesize: data.page.pagesize,
    page,
    order: data.page.order
  })
  data.articles = results
}

const getPhotos = async (user:string)=>{
  const {results} = await gets({
    user,
    pagesize: 3,
    order: '-create_time'
  })
  photo.value = results
}


const init = async (id: number) => {
  data.userInfo = await get(id)
  const {count, results} = await list({
    author: data.userInfo.username,
    pagesize: data.page.pagesize,
    order: data.page.order
  })
  data.articles = results
  data.page.count = Math.ceil(count / data.page.pagesize)
  await getPhotos(data.userInfo.username)
}

const changePage = async (page: number) => {
  await getArticles(page)
}

const jump = () => {
  router.push({name: 'user_edit'})
}

const upload = (e: any) => {
  if (e.length) {
    const file = e[0]
    new Promise((resolve, reject) => {
      getCosKey().then(res => {
        const cos = new COS({
          SecretId: res.credentials.tmpSecretId, // 身份识别ID
          SecretKey: res.credentials.tmpSecretKey,// 身份秘钥
          XCosSecurityToken: res.credentials.sessionToken
        })
        cos.putObject({
          Bucket: 'chen-1302611521', /* 存储桶 */
          Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
          Key: `/blog/photo/${data.userInfo.username}/${dayjs().format('YYYY-MM-DDTHH:mm:ss')}-${file.name}`, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: file, // 上传文件对象
          onProgress: (progressData) => { // 上传进度
            // console.log(JSON.stringify(progressData))
          }
        }, (err, data) => {
          // 上传成功之后
          if (data.statusCode === 200) {
            let path = `https://${data.Location}`
            resolve(path)
          }
          if (err) {
            reject('upload fail')
          }
        })
      }).catch(e => {
        reject(e)
      })
    }).then((res: any) => {
      photoData.photoPath = res
    })
  }
}

const uploadPhoto = async () => {
  if (photoData.photoPath) {
    await add({picture: photoData.photoPath, name: photoData.photoName})
    photo.value.push({picture: photoData.photoPath})
    reset()
  } else {
    snackbar.error('please upload photo')
  }
}

const reset = () => {
  photoData.files = []
  photoData.photoName = ''
  photoData.photoPath = ''
}

const {userInfo, page, articles} = toRefs(data)

</script>

<style scoped>

</style>
