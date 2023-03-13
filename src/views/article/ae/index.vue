<template>
  <p
      class="
                        my-3
                        text-h5
                        font-weight-black
                        text-uppercase
                        d-flex
                        align-center
                        justify-center
                    "
  >
    <v-icon :icon="id ? 'mdi-circle-edit-outline' : 'mdi-circle-edit-outline'" class="mr-3"></v-icon>
    {{ id ? t('edit') : t('add') }}
  </p>
  <v-divider color="surface"/>
  <v-form class="ma-6" v-model="valid" lazy-validation ref="form" id="form">
    <v-text-field :label="t('title')" v-model="article.title" color="primary" variant="outlined"
                  density="comfortable"
                  :rules="titleRules"
    ></v-text-field>
    <editor style="background: #0d5aa7 !important;" api-key="4aoi5vbw5t6v7q43jt2w6s6q9cpzikf3384bpre1tq2pftid"
            :init="editorConfig" v-model="article.content" v-if="reborn"/>
    <v-overlay v-model="load" color="primary" class="d-flex justify-center align-center" persistent>
      <div style="width: 100px">
        <v-progress-linear
            color="primary"
            indeterminate
            rounded
            height="10"
        ></v-progress-linear>
      </div>

    </v-overlay>

    <v-combobox
        class="my-10"
        variant="outlined"
        color="primary"
        density="comfortable"
        v-model="select"
        :items="items"
        :label="t('tag')"
        multiple
        chips
        @update:searchInput="getTag"
        :rules="tagRules"
    ></v-combobox>
    <p class="d-flex">
      <v-btn color="primary" variant="tonal" @click="publish">{{ t('publish') }}</v-btn>
      <v-btn color="primary" variant="tonal" class="ml-1" @click="reset">{{ t('reset') }}</v-btn>
    </p>
  </v-form>
</template>

<script lang="ts" setup>
import {toRefs, reactive, getCurrentInstance, ref, onMounted, computed, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useConfig} from "@/store/config";
import {useTag} from "@/store/tag";
import COS from 'cos-js-sdk-v5'
import {useArticle} from "@/store/article";
import {useRoute} from "vue-router";
import {useTheme} from "vuetify";

interface Props {
  id: string | number
}

const {t} = useI18n()
const {getCosKey} = useConfig()
const {getTagList} = useTag()
const {create, get, edit} = useArticle()
const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs
const {id} = defineProps<Props>()
const route = useRoute()
const theme = useTheme()
const data = reactive({
  article: {
    title: '',
    content: '',
  },
  select: [],
  items: [],
  editorConfig: {
    skin_url: computed(() => {
      const val = ['light', 'dark'].includes(theme.global.name.value) ? theme.global.name.value : 'light'
      return `https://chen-1302611521.cos.ap-nanjing.myqcloud.com/tinymce/${val}/skins/ui/${val}`
    }),
    plugins: 'link lists image codesample code table wordcount  table fullscreen preview pagebreak insertdatetime', // 插件
    toolbar: 'codesample image bold italic underline alignleft aligncenter alignright alignjustify | forecolor backcolor | fontselect | fontsizeselect | formatselect |  bullist numlist | outdent indent blockquote | removeformat| undo redo | link unlink media insertdatetime table  hr pagebreak | fullscreen preview | strikethrough', // 工具条
    font_formats: 'Arial=arial,helvetica,sans-serif; 宋体=SimSun;  微软雅黑=Microsoft Yahei; Impact=impact,chicago;', // 字体
    fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', // 文字大小
    paste_data_images: true,
    codesample_languages: [
      {text: 'HTML/XML', value: 'markup'},
      {text: 'JavaScript', value: 'javascript'},
      {text: 'CSS', value: 'css'},
      {text: 'Java', value: 'java'},
      {text: 'C++', value: 'cpp'},
    ],
    branding: false,
    // 图片上传回调
    images_upload_handler: (blobInfo: any, success: Function) => new Promise((resolve, reject) => {
      const file = blobInfo.blob()
      getCosKey().then(res => {
        const cos = new COS({
          SecretId: res.credentials.tmpSecretId, // 身份识别ID
          SecretKey: res.credentials.tmpSecretKey,// 身份秘钥
          XCosSecurityToken: res.credentials.sessionToken
        })
        cos.putObject({
          Bucket: 'chen-1302611521', /* 存储桶 */
          Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
          Key: `/blog/article/${dayjs().format('YYYY-MM-DDTHH:mm:ss')}-${file.name}`, /* 文件名 */
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
    })
  },
  valid: true,
  form: null,
  titleRules: [
    (v: string) => !!v && !!v.trim() || 'Title is required',
  ],
  tagRules: [
    (v: []) => !!v.length || 'Tag is required'
  ],
})

const reborn = ref(true)
const load = ref(true)

watch(() => theme.global.name.value, value => {
  reborn.value = false
  setTimeout(() => {
    reborn.value = true
  })
})

onMounted(async () => {
  const form = document.getElementById('form') as HTMLElement
  const observer = new MutationObserver((mutations, observer) => {
    if (mutations.length) {
      load.value = false
    }
  })
  observer.observe(form, {childList: true})
  if (id) {
    const {title, content, tag} = await get(id)
    data.article.title = title
    data.article.content = content
    data.select = tag.map((i: any) => i.name)
  }
})

const getTag = async (e: string) => {
  const val = await getTagList({name: e})
  if (val && val.length) {
    data.items = val.map((i: any) => i.name)
  }
}

const publish = async () => {
  data.form.validate()
  const {valid} = await data.form.validate()
  if (valid) {
    const res = data.select.map(i => {
      return {
        'name': i
      }
    })
    if (id) {
      await edit(id, {title: data.article.title, content: data.article.content, tag: res})
    } else {
      await create({title: data.article.title, content: data.article.content, tag: res})
    }
    reset()
  }
}

const reset = () => {
  data.form.reset()
  setTimeout(() => {
    data.form.resetValidation()
  })
}

const {article, select, items, editorConfig, valid, form, titleRules, tagRules} = toRefs(data)

</script>

<style scoped>

</style>