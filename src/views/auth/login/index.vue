<template>
  <v-container class="mt-sm-16" v-show="show">
    <v-row>
      <v-col cols="12">
        <h1 class="text-uppercase">{{ t('sign_in') }}</h1>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="text-button">{{ t('sign_in_sub') }}</p>
        <v-divider class="my-2" color="surface"/>
        <p class="text-subtitle-2 text-grey mb-6">{{ t('sign_in_help') }}</p>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field :label="t('username')" v-model="userInfo.username" color="primary" variant="outlined"
                        density="comfortable" :rules="nameRules" @keyup.enter="login">

          </v-text-field>
          <v-text-field :label="t('password')" v-model="userInfo.password" color="primary" variant="outlined"
                        density="comfortable"
                        type="password" :rules="passwordRules" @keyup.enter="login"></v-text-field>
          <div class="d-flex justify-space-between align-end">
            <div class="d-flex">
              <v-btn color="primary" variant="tonal" class="mr-1" @click="login">{{
                  t('sign_in')
                }}
              </v-btn>
              <v-btn color="primary" variant="tonal" @click="reset">{{ t('clear') }}</v-btn>
            </div>
            <p class="text-primary text-decoration-none" @click="resetDialog=true">{{ t('forget_psw') }}</p>
          </div>
        </v-form>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="text-button">{{ t('register') }}</p>
        <v-divider class="my-2" color="surface"/>
        <p class="text-subtitle-2 text-grey mb-6">{{ t('register_help') }}</p>
        <v-btn color="primary" rounded @click="dialog=true">{{ t('create_account') }}</v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <v-card>
        <template v-slot:prepend>
          <div class="d-flex align-center">
            <v-btn icon="mdi-close" variant="flat" @click="dialog=false"></v-btn>
            <p class="ml-4 text-h5">{{ t('create_account') }}</p>
          </div>
        </template>
        <v-card-item>
          <v-tabs
            fixed-tabs
            v-model="tab"
            color="primary"
            :disabled="flag"
          >
            <v-tab v-for="(v,k) in items" :key="v" :value="k">
              {{ t(`${v}`) }}
            </v-tab>
          </v-tabs>
        </v-card-item>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item :value="0">
              <p class="text-button">{{ t('email_for_code') }}</p>
              <v-divider class="my-2" color="surface"/>
              <p class="text-subtitle-2 text-grey mb-6">{{ t('code_help') }}</p>
              <v-form ref="codeForm" v-model="codeValid" lazy-validation>
                <v-text-field :label="t('email')" v-model="codeInfo.email" color="primary" variant="outlined"
                              density="comfortable" :rules="emailRules">
                </v-text-field>
                <div class="d-flex">
                  <v-btn color="primary" variant="tonal" class="mr-1" @click="getCode">{{
                      t('get_code')
                    }}
                  </v-btn>
                  <v-btn color="primary" variant="tonal" @click="reset" class="mr-1">{{ t('clear') }}</v-btn>
                  <v-btn color="primary" @click="tab=1" :disabled="flag">{{
                      t('next')
                    }}
                  </v-btn>
                </div>
              </v-form>
            </v-window-item>
            <v-window-item :value="1">
              <p class="text-button">{{ t('user_for_account') }}</p>
              <v-divider class="my-2" color="surface"/>
              <p class="text-subtitle-2 text-grey mb-6">{{ t('account_help') }}</p>
              <v-form ref="registerForm" v-model="registerValid" lazy-validation>
                <v-text-field :label="t('username')" v-model="registerInfo.username" :rules="nameRules" color="primary"
                              variant="outlined"
                              density="comfortable">
                </v-text-field>
                <v-text-field :label="t('email')" v-model="registerInfo.email" :rules="emailRules" color="primary"
                              variant="outlined"
                              density="comfortable">
                </v-text-field>
                <v-text-field :label="t('code')" v-model="registerInfo.code" :rules="codeRules" color="primary"
                              variant="outlined"
                              density="comfortable">
                </v-text-field>
                <v-textarea :label="t('about')" v-model="registerInfo.about" color="primary" variant="outlined"
                            density="comfortable">
                </v-textarea>
                <v-text-field :label="t('password')" v-model="registerInfo.password" :rules="passwordRules"
                              color="primary"
                              variant="outlined"
                              density="comfortable" type="password">
                </v-text-field>
                <v-text-field :label="t('password2')" v-model="registerInfo.password2" :rules="password2Rules"
                              color="primary" variant="outlined"
                              density="comfortable" type="password">
                </v-text-field>
                <div class="d-flex">
                  <v-btn color="primary" variant="tonal" class="mr-1" @click="signUp">{{
                      t('sign_up')
                    }}
                  </v-btn>
                  <v-btn color="primary" variant="tonal" class="mr-1" @click="reset">{{ t('clear') }}</v-btn>
                </div>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="resetDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <v-card>
        <template v-slot:prepend>
          <div class="d-flex align-center">
            <v-btn icon="mdi-close" variant="flat" @click="resetDialog=false"></v-btn>
            <p class="ml-4 text-h5">{{ t('resetPsw') }}</p>
          </div>
        </template>
        <v-card-item>
          <v-tabs
            fixed-tabs
            v-model="pswTab"
            color="primary"
            :disabled="pswFlag"
          >
            <v-tab v-for="(v,k) in pswItems" :key="v" :value="k">
              {{ t(`${v}`) }}
            </v-tab>
          </v-tabs>
        </v-card-item>
        <v-card-text>
          <v-window v-model="pswTab">
            <v-window-item :value="0">
              <p class="text-button">{{ t('email_for_code') }}</p>
              <v-divider class="my-2" color="surface"/>
              <p class="text-subtitle-2 text-grey mb-6">{{ t('code_help') }}</p>
              <v-form ref="pswCForm" v-model="pswCValid" lazy-validation>
                <v-text-field :label="t('email')" v-model="pswCodeInfo.email" color="primary" variant="outlined"
                              density="comfortable" :rules="emailRules">
                </v-text-field>
                <div class="d-flex">
                  <v-btn color="primary" variant="tonal" class="mr-1" @click="getPswCode">{{
                      t('get_code')
                    }}
                  </v-btn>
                  <v-btn color="primary" variant="tonal" @click="pswReset" class="mr-1">{{ t('clear') }}</v-btn>
                  <v-btn color="primary" @click="pswTab=1" :disabled="pswFlag">{{
                      t('next')
                    }}
                  </v-btn>
                </div>
              </v-form>
            </v-window-item>
            <v-window-item :value="1">
              <p class="text-button">{{ t('reset_for_psw') }}</p>
              <v-divider class="my-2" color="surface"/>
              <p class="text-subtitle-2 text-grey mb-6">{{ t('account_help') }}</p>
              <v-form ref="pswForm" v-model="pswValid" lazy-validation>
                <v-text-field :label="t('email')" v-model="pswResetInfo.email" :rules="emailRules" color="primary"
                              variant="outlined"
                              density="comfortable">
                </v-text-field>
                <v-text-field :label="t('code')" v-model="pswResetInfo.code" :rules="codeRules" color="primary"
                              variant="outlined"
                              density="comfortable">
                </v-text-field>
                <v-text-field :label="t('password')" v-model="pswResetInfo.password" :rules="passwordRules"
                              color="primary"
                              variant="outlined"
                              density="comfortable" type="password">
                </v-text-field>
                <v-text-field :label="t('password2')" v-model="pswResetInfo.password2" :rules="password2Rules"
                              color="primary" variant="outlined"
                              density="comfortable" type="password">
                </v-text-field>
                <div class="d-flex">
                  <v-btn color="primary" variant="tonal" class="mr-1" @click="resetPsw">{{
                      t('confirm')
                    }}
                  </v-btn>
                  <v-btn color="primary" variant="tonal" class="mr-1" @click="reset">{{ t('clear') }}</v-btn>
                </div>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from 'vue'
import {useI18n} from "vue-i18n";
import {useAuth} from "@/store/auth";
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'index',
  setup() {
    const {t} = useI18n()
    const {signIn, code, pswCode, register, resetPassword, verify} = useAuth()
    const router = useRouter()
    const data = reactive({
      form: null,
      valid: true,
      dialog: false,
      resetDialog: false,
      userInfo: {
        username: '',
        password: ''
      },
      codeInfo: {
        email: ''
      },
      pswCodeInfo: {
        email: ''
      },
      registerInfo: {
        username: '',
        about: '',
        email: '',
        code: '',
        password: '',
        password2: ''
      },
      pswResetInfo: {
        email: '',
        code: '',
        password: '',
        password2: ''
      },
      nameRules: [
        (v: string) => !!v && !!v.trim() || 'Username is required',
      ],
      passwordRules: [
        (v: string) => !!v && !!v.trim() || 'New Password is required',
        (v: string) => v && v.length >= 8 || 'This password is too short. It must contain at least 8 characters.',
      ],
      password2Rules: [
        (v: string) => !!v && !!v.trim() || 'Password is required',
        (v: string) => checkPsw(v) || 'Password does not match'
      ],
      emailRules: [
        (v: string) => !!v && !!v.trim() || 'Email is required',
        (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      codeRules: [
        (v: string) => !!v && !!v.trim() || 'Code is required',
      ],
      tab: 0,
      items: ['get_code', 'create_account'],
      flag: true,
      codeForm: null,
      codeValid: true,
      registerForm: null,
      registerValid: true,
      pswTab: 0,
      pswItems: ['get_code', 'resetPsw'],
      pswFlag: true,
      pswCForm: null,
      pswCValid: true,
      pswForm: null,
      pswValid: true
    })
    const show = ref(false)

    const token = localStorage.getItem('token') || ''
    if (token) {
      verify({token}).then(res => {
        if (res.status === 200) {
          router.push('/articles')
        }
      }).catch(e => {
        show.value = true
      })
    } else {
      show.value = true
    }

    const checkPsw = (v: string): any => {
      if (data.dialog === true) {
        return data.registerInfo.password === data.registerInfo.password2
      }
      if (data.resetDialog === true) {
        return data.pswResetInfo.password === data.pswResetInfo.password2
      }

    }

    const login = async () => {
      data.form.validate()
      const {valid} = await data.form.validate()
      if (valid) {
        const res = await signIn(data.userInfo)
        res && router.push('/home')
      }
    }

    const getCode = async () => {
      data.codeForm.validate()
      const {valid} = await data.codeForm.validate()
      if (valid) {
        const val = await code(data.codeInfo)
        val && (data.flag = false)
      }
    }

    const getPswCode = async () => {
      data.pswCForm.validate()
      const {valid} = await data.pswCForm.validate()
      if (valid) {
        const val = await pswCode(data.pswCodeInfo)
        val && (data.pswFlag = false)
      }
    }

    const resetPsw = async () => {
      data.pswForm.validate()
      const {valid} = await data.pswForm.validate()
      if (valid) {
        await resetPassword(data.pswResetInfo)
      }
    }


    const signUp = async () => {
      data.registerForm.validate()
      const {valid} = await data.registerForm.validate()
      if (valid) {
        const val = await register(data.registerInfo)
      }
    }

    const reset = () => {
      data.form.reset()
      data.codeForm.reset()
      data.registerForm.reset()
    }
    const pswReset = () => {
      data.pswCForm.reset()
      // data.pswForm.reset()
    }

    return {
      t, ...toRefs(data), signIn, reset, login, getCode, signUp, getPswCode, pswReset, resetPsw, show
    }
  }
})
</script>

<style scoped>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform .2s ease-in-out;
}
</style>
