import type { AxiosPromise } from 'axios'

import { PublicApiRoute } from '@/enum/RequestRoute'

import { useApiRequest } from './http'

interface AuthRegisterPayload {
  name: string
  email: string
  password: string
}

interface AuthRegisterResponse {
  name: string
  memberId: string
  role: string
}

interface AuthLoginStep1Payload {
  email: string
  password: string
}

interface AuthLoginPayload {
  email: string
  password: string
  code: string
}

interface AuthLoginStoreAccessItem {
  storeId: string
  storeName: string
  storeActive: boolean
  role: string
  accessActive: boolean
}

interface AuthLoginTokenPair {
  accessToken: string
  refreshToken: string
}

interface AuthLoginResponse {
  name: string
  memberId: string
  role: string
  storeAccess: AuthLoginStoreAccessItem[]
  tokenPair: AuthLoginTokenPair
}

interface AuthLoginStep1Response {
  requireOtp: boolean
  email: string
  loginResponse: AuthLoginResponse | null
}

interface AuthRegisterAdminPayload {
  name: string
  email: string
  password: string
}

interface AuthRegisterAdminResponse {
  name: string
  memberId: string
  role: string
}

export const useAuthApi = {
  /*
   * 一般使用者註冊
  */
  register: (payload: AuthRegisterPayload): AxiosPromise<AuthRegisterResponse> => {
    return useApiRequest.post({
      url: PublicApiRoute.AuthRegister,
      data: payload
    })
  },

  /*
   * 登入 step1（email + 密碼）。若帳號需要 OTP，後端會寄驗證碼到 email 並回 requireOtp=true；
   * 否則直接回完整登入結果（loginResponse 含 tokenPair）。
  */
  loginStep1: (payload: AuthLoginStep1Payload): AxiosPromise<AuthLoginStep1Response> => {
    return useApiRequest.post({
      url: PublicApiRoute.AuthLoginStep1,
      data: payload
    })
  },

  /*
   * 登入（email + 密碼 + OTP code）。僅供 step1 觸發 requireOtp=true 的帳號使用。
  */
  login: (payload: AuthLoginPayload): AxiosPromise<AuthLoginResponse> => {
    return useApiRequest.post({
      url: PublicApiRoute.AuthLogin,
      data: payload
    })
  },

  /*
   * 建立 admin 帳號
  */
  registerAdmin: (payload: AuthRegisterAdminPayload): AxiosPromise<AuthRegisterAdminResponse> => {
    return useApiRequest.post({
      url: PublicApiRoute.AuthRegisterAdmin,
      data: payload
    })
  }
}
