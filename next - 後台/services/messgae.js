import axiosInstance, { fetcher } from './axios-instance'
import useSWR from 'swr'

/**
 * 檢查會員狀態使用
 */
export const getMessage = async (msg) => {
  return await axiosInstance.get(`/messages/${msg}`)
}

export const check_conversation = async (msg) => {
  return await axiosInstance.get(`/messages/check_conversation/${msg}`)
}

// 把訊息往資料庫送
export const offline = async (message) => {
  return await axiosInstance.post(`/messages/offline`, message)
}
