import axiosInstance, { fetcher } from './axios-instance'
import useSWR from 'swr'

export const Get_AllUser = async () => {
  return await axiosInstance.get(`/user`)
}
