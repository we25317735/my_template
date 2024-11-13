import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '@/hooks/use-auth'
import useFirebase from '@/hooks/use-firebase'
import { google_bind } from '@/services/bind'
import { googleLogin, parseJwt, getUserById } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import { initUserData } from '@/hooks/use-auth'

const Google_bind = () => {
  const { loginGoogle } = useFirebase()
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // Google 登入後處理
  const callbackGoogleLoginPopup = async (providerData) => {
    console.log('google 綁定: ', providerData)
    console.log('使用者: ', auth.userData.id)

    // 將 auth.userData.id 添加到 providerData
    const data = {
      ...providerData,
      user_id: auth.userData.id, // 新增的屬性 userId
    }

    // 開始綁定帳號
    const res = await google_bind(data)
    console.log('google 綁定結果: ', res.data.google_uid)

    if (res.data.status === 'success') {
      // 更新 auth 中的 userData，將 line_uid 更新為最新值
      setAuth((prevAuth) => ({
        ...prevAuth,
        userData: {
          ...prevAuth.userData,
          google_uid: res.data.google_uid, // 根據 API 回傳資料更新 line_uid
        },
      }))

      toast.success('Google 帳號綁定成功')
    } else {
      toast.error('此帳號已被使用')
    }
  }

  return (
    <button
      className="btn btn-sm btn-outline-success"
      onClick={() => loginGoogle(callbackGoogleLoginPopup)}
    >
      未連接
    </button>
  )
}

export default Google_bind
