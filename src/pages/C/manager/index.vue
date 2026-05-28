<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { NButton, NCard, NEl, NFlex, NForm, NFormItem, NH2, NInput, NText } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'

import { useAuthApi } from '@/api/useAuthApi'
import { CookieEnum } from '@/enum'
import { setToken } from '@/utils/cookie'

const router = useRouter()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const otpFormRef = ref<FormInst | null>(null)

const state = ref({
	data: {
		email: '',
		password: '',
		code: ''
	},
	feature: {
		step: 'credential' as 'credential' | 'otp',
		rules: {
			email: [
				{ required: true, message: '請輸入 Email', trigger: 'blur' },
				{ type: 'email', message: 'Email 格式錯誤', trigger: ['blur', 'input'] }
			],
			password: [
				{ required: true, message: '請輸入密碼', trigger: 'blur' }
			]
		} as FormRules,
		otpRules: {
			code: [
				{ required: true, message: '請輸入驗證碼', trigger: 'blur' }
			]
		} as FormRules
	}
})

const applyLoginSuccess = (data: { name: string, tokenPair: { accessToken: string, refreshToken: string } }) => {
	setToken(CookieEnum.AccessToken, data.tokenPair.accessToken)
	setToken(CookieEnum.RefreshToken, data.tokenPair.refreshToken)
	message.success(`歡迎 ${data.name}`)
	router.push('/manager/info')
}

const step1Mutation = useMutation({
	mutationFn: async () => {
		const res = await useAuthApi.loginStep1({
			email: state.value.data.email,
			password: state.value.data.password
		})
		return res.data
	},
	onSuccess: (data) => {
		if (data.requireOtp) {
			state.value.feature.step = 'otp'
			message.info('驗證碼已寄至 Email，請於下方輸入')
			return
		}
		if (data.loginResponse) {
			applyLoginSuccess(data.loginResponse)
		}
	},
	onError: () => {
		message.error('登入失敗，請確認 Email 或密碼')
	}
})

const loginMutation = useMutation({
	mutationFn: async () => {
		const res = await useAuthApi.login({
			email: state.value.data.email,
			password: state.value.data.password,
			code: state.value.data.code
		})
		return res.data
	},
	onSuccess: (data) => {
		applyLoginSuccess(data)
	},
	onError: () => {
		message.error('驗證失敗，請確認驗證碼')
	}
})

const handleStep1 = async () => {
	try {
		await formRef.value?.validate()
	}
	catch {
		return
	}
	step1Mutation.mutate()
}

const handleLogin = async () => {
	try {
		await otpFormRef.value?.validate()
	}
	catch {
		return
	}
	loginMutation.mutate()
}

const handleBackToCredential = () => {
	state.value.feature.step = 'credential'
	state.value.data.code = ''
}
</script>

<template>
  <n-flex
    align="center"
    justify="center"
    style="
      min-height: 100vh;
      padding: 16px;
      background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
    "
  >
    <n-card
      :bordered="false"
      style="max-width: 420px; width: 100%; border-radius: 18px; box-shadow: 0 20px 50px rgba(0,0,0,0.25);"
    >
      <n-flex
        vertical
        align="center"
        :size="6"
        style="margin-bottom: 24px;"
      >
        <n-el
          tag="div"
          style="
            width: 56px; height: 56px; border-radius: 14px;
            background: linear-gradient(135deg, #1e293b, #475569);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 6px 16px rgba(30,41,59,0.25);
          "
        >
          <n-text strong style="color: white; font-size: 18px; letter-spacing: 0.05em;">
            MGR
          </n-text>
        </n-el>
        <n-h2 style="margin: 0; font-size: 22px; color: #1f2937;">
          {{ state.feature.step === 'credential' ? '管理者登入' : '輸入驗證碼' }}
        </n-h2>
        <n-text depth="3" style="font-size: 13px;">
          {{ state.feature.step === 'credential' ? '請輸入您的 Email 與密碼以繼續' : `驗證碼已寄至 ${state.data.email}` }}
        </n-text>
      </n-flex>

      <n-form
        v-if="state.feature.step === 'credential'"
        ref="formRef"
        :model="state.data"
        :rules="state.feature.rules"
        label-placement="top"
        @keyup.enter="handleStep1"
      >
        <n-form-item label="Email" path="email">
          <n-input
            v-model:value="state.data.email"
            placeholder="name@example.com"
            size="large"
          />
        </n-form-item>
        <n-form-item label="密碼" path="password">
          <n-input
            v-model:value="state.data.password"
            type="password"
            show-password-on="click"
            placeholder="請輸入密碼"
            size="large"
          />
        </n-form-item>

        <n-button
          type="primary"
          size="large"
          block
          strong
          :loading="step1Mutation.isPending.value"
          style="height: 48px; font-size: 16px; background: linear-gradient(135deg, #1e293b, #475569); margin-top: 8px;"
          @click="handleStep1"
        >
          下一步
        </n-button>
      </n-form>

      <n-form
        v-else
        ref="otpFormRef"
        :model="state.data"
        :rules="state.feature.otpRules"
        label-placement="top"
        @keyup.enter="handleLogin"
      >
        <n-form-item label="Email 驗證碼" path="code">
          <n-input
            v-model:value="state.data.code"
            placeholder="請輸入 Email 收到的驗證碼"
            size="large"
          />
        </n-form-item>

        <n-button
          type="primary"
          size="large"
          block
          strong
          :loading="loginMutation.isPending.value"
          style="height: 48px; font-size: 16px; background: linear-gradient(135deg, #1e293b, #475569); margin-top: 8px;"
          @click="handleLogin"
        >
          登入
        </n-button>

        <n-button
          text
          block
          style="margin-top: 12px;"
          :disabled="loginMutation.isPending.value"
          @click="handleBackToCredential"
        >
          返回上一步
        </n-button>
      </n-form>
    </n-card>
  </n-flex>
</template>
