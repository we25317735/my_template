import axiosInstance, { fetcher } from './axios-instance'

/**
 * 帳號 第三方綁定
 */

export const Line_bind = async () => {
  // 向後端(express/node)伺服器要求line登入的網址，因密鑰的關係需要由後端產生
  axiosInstance.get('/line-bind/login').then((res) => {
    console.log('line 導向: ', res.data.url)
    // 重定向到line 登入頁
    if (res.data.url) {
      window.location.href = res.data.url
    }
  })
}

// Line 帳號綁定 callback
export const lineBindCallback = async (query, data) => {
  const qs = new URLSearchParams({
    ...query,
  }).toString()
  console.log('line綁定: ', data)

  return await axiosInstance.post(`/line-bind/callback?${qs}`, data)
}

/* Google 第三方綁定 */
export const google_bind = async (data) => {
  return await axiosInstance.post(`/google-bind`, data)
}
