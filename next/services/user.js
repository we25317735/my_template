import axiosInstance, { fetcher } from './axios-instance'
import useSWR from 'swr'

// 調取會員狀態(畫面每次 reload 都會執行一次)
export const checkAuth = async () => {
  return await axiosInstance.get('/auth/check')
}

// Google 登入(Firebase)登入用，providerData為登入後得到的資料
export const googleLogin = async (providerData = {}) => {
  return await axiosInstance.post('/google-login', providerData)
}

/* 推特登入(firebase) */
export const TwitterLogin = async (providerData = {}) => {
  return await axiosInstance.post('/twitter-login', providerData)
}

// line 登入用，導向到line登入頁
export const lineLoginRequest = async () => {
  // 向後端(express/node)伺服器要求line登入的網址，因密鑰的關係需要由後端產生
  axiosInstance.get('/line-login/login').then((res) => {
    console.log('line 導向: ', res.data.url)
    // 重定向到line 登入頁
    if (res.data.url) {
      window.location.href = res.data.url
    }
  })
}

/**
 * LINE Login登入用，處理line方登入後接者執行，會拿回傳的url執行lineLoginCallback。query為router.query
 */

// line 登入, callback 處理
export const lineLoginCallback = async (query) => {
  const qs = new URLSearchParams({
    ...query,
  }).toString()

  return await axiosInstance.get(`/line-login/callback?${qs}`)
}

// LINE 登出用(跟 firebaes 無關, 所以另外處理)
export const lineLogout = async (line_uid) => {
  return await axiosInstance.get(`/line-login/logout?line_uid=${line_uid}`)
}

// 一般會員登入(信箱 或 手機 登入)
export const login = async (loginData) => {
  console.log('user server, ', loginData)
  return await axiosInstance.post('/auth/login', loginData)
}
/**
 * 登出用
 */
export const logout = async () => {
  return await axiosInstance.post('/auth/logout', {})
}

// 純測試連線
export const getUser = async () => {
  return await axiosInstance.get(`/user`)
}

// 用使用者 id 去搜尋該筆使用者資訊
export const getUserById = async (id = 0) => {
  return await axiosInstance.get(`/user/${id}`)
}

// email 搜尋該使用者
export const getUserByEmail = async (email) => {
  return await axiosInstance.get(`/user/email/${email}`)
}

// 電話 搜尋該使用者
export const getUserByPhone = async (phone) => {
  return await axiosInstance.get(`/user/phone/${phone}`)
}

// 一般會員註冊
export const registerUser = async (data) => {
  return await axiosInstance.post(`/auth/register`, data)
}

/**
 * 忘記密碼/OTP 要求一次性密碼
 */
export const requestOtpToken = async (email = '') => {
  return await axiosInstance.post('/reset-password/otp', { email })
}
/**
 * 忘記密碼/OTP 重設密碼
 */
export const resetPassword = async (email = '', password = '', token = '') => {
  return await axiosInstance.post('/reset-password/reset', {
    email,
    token,
    password,
  })
}
/**
 * 註冊用
 */
export const register = async (user = {}) => {
  return await axiosInstance.post('/users', user)
}
/**
 * (可以試試看)
 * 修改會員一般資料用(排除password, username, email)
 */
export const updateProfile = async (id = 0, user = {}) => {
  return await axiosInstance.put(`/users/${id}/profile`, user)
}

// 解析accessToken用的函式
export const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}
