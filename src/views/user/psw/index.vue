<template>
  <v-row class="d-flex justify-center">
    <v-card width="500" class="mt-16 pa-6" variant="text">
      <v-card-text>

      </v-card-text>
      <v-form ref="form" v-model="data.valid" lazy-validation>
        <v-text-field :label="t('oldpsw')" v-model="data.old_password" color="primary" variant="outlined"
                      density="comfortable"
                      type="password"
                      :rules="data.oldPswRules"
        >
        </v-text-field>
        <v-text-field :label="t('newpsw')" v-model="data.password" color="primary" variant="outlined"
                      density="comfortable"
                      type="password"
                      :rules="data.pswRules"
        >
        </v-text-field>
        <v-text-field :label="t('cpsw')" v-model="data.password2" color="primary" variant="outlined"
                      density="comfortable"
                      type="password"
                      :rules="data.psw2Rules"
        >
        </v-text-field>
        <div class="d-flex">
          <v-btn color="primary" variant="tonal" class="mr-1" @click="edit">{{
              t('confirm')
            }}
          </v-btn>
          <v-btn color="primary" variant="tonal" class="mr-1" @click="reset">{{ t('clear') }}</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-row>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useUser} from "@/store/user";
import {useAuth} from "@/store/auth";
import {useSnackBar} from "@/store/snackbar";
import {useRouter} from "vue-router";

const router = useRouter()
const snackbar = useSnackBar()
const {t} = useI18n()
const {logOut} = useAuth()
const {editPassword} = useUser()
const refresh_token = localStorage.getItem('refresh') || ''
const form = ref(null)
const {user} = useUser()
const data = reactive({
  valid: true,
  old_password: '',
  password: '',
  password2: '',
  oldPswRules: [
    (v: string) => !!v && !!v.trim() || 'Password is required',
  ],
  pswRules: [
    (v: string) => !!v && !!v.trim() || 'New Password is required',
    (v: string) => v && v.length >= 8 || 'This password is too short. It must contain at least 8 characters.',
    (v: string) => checkPsw1(v) || 'The New Password cannot be the same as the Old Password'
  ],
  psw2Rules: [
    (v: string) => !!v && !!v.trim() || 'Confirm Password is required',
    (v: string) => checkPsw(v) || 'Confirm Password does not match'
  ]
})

onMounted(async () => {

})

const checkPsw1 = (v: string): boolean => {
  return data.old_password !== data.password
}

const checkPsw = (v: string): boolean => {
  return data.password === data.password2
}

const edit = async () => {
  form.value.validate()
  const {valid} = await form.value.validate()
  if (valid) {
    const res = await editPassword(user.id, {
      old_password: data.old_password,
      password: data.password,
      password2: data.password2
    })
    if (res) {
      await logOut({refresh_token})
      localStorage.removeItem('refresh')
      localStorage.removeItem('token')
      await router.push('/login')
      snackbar.success('密码修改成功，请重新登录')
    }
  }
}

const reset = () => {
  form.value.reset()
}

</script>

<style scoped>

</style>