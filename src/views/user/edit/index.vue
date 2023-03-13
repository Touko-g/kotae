<template>
  <v-card class="ma-6" variant="text">
    <v-card-text>
      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-avatar size="100">
              <v-img :src="data.user.avatar" sizes="100" alt="avatar">

              </v-img>
            </v-avatar>
          </v-col>
          <v-col cols="12">
            <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon="mdi-camera"
                variant="outlined"
                :label="t('avatar')"
                @update:modelValue="upload"
            ></v-file-input>
          </v-col>
          <v-col cols="12">
            <v-text-field :label="t('username')" color="primary"
                          variant="outlined"
                          density="comfortable"
                          v-model="data.user.username"
                          :rules="data.nameRules"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field :label="t('email')" v-model="data.user.email" :rules="data.emailRules" color="primary"
                          variant="outlined"
                          density="comfortable">
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea :label="t('about')" v-model="data.user.about" color="primary" variant="outlined"
                        density="comfortable">
            </v-textarea>
          </v-col>
          <v-col class="d-flex">
            <v-btn color="primary" variant="tonal" class="mr-1" @click="edit">{{
                t('confirm')
              }}
            </v-btn>
            <v-btn color="primary" variant="tonal" class="mr-1" @click="reset">{{ t('clear') }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {useUser} from "@/store/user";
import {useI18n} from "vue-i18n";
import {useConfig} from "@/store/config";
import COS from "cos-js-sdk-v5";

const {proxy} = getCurrentInstance() as any;
const dayjs = proxy.dayjs
const {getCosKey} = useConfig()
const {t} = useI18n()
const {get, update, user} = useUser()

const form = ref(null)
const formValid = ref(true)

const avatar = ref(null)

const data = reactive({
  user: {
    username: '',
    email: '',
    about: '',
    avatar: ''
  },
  nameRules: [
    (v: string) => !!v && !!v.trim() || 'Username is required',
  ],
  emailRules: [
    (v: string) => !!v && !!v.trim() || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ]
})

onMounted(async () => {
  await init(user.id)
})

const init = async (id: number) => {
  data.user = await get(id)
  avatar.value = data.user.avatar
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
          Key: `/blog/avatar/${dayjs().format('YYYY-MM-DDTHH:mm:ss')}-${file.name}`, /* 文件名 */
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
      data.user.avatar = res
    })
  } else {
    data.user.avatar = avatar.value
  }
}

const edit = async () => {
  form.value.validate()
  const {valid} = await form.value.validate()
  if (valid) {
    const val = await update(user.id, data.user)
    user.username = val.username
  }
}

const reset = () => {
  form.value.reset()
}

</script>

<style scoped>

</style>