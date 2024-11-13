import axiosInstance, { fetcher } from './axios-instance'
import useSWR from 'swr'

/**
 * 檢查會員狀態使用
 */
export const getMessage = async (msg) => {
  return await axiosInstance.get(`/messages/${msg}`)
}
