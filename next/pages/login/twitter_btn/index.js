import React from 'react'
import { useRouter } from 'next/router'
import { FaTwitter } from 'react-icons/fa'
import useFirebase from '@/hooks/use-firebase'
import { useAuth } from '@/hooks/use-auth'
import { TwitterLogin } from '@/services/user'
import { parseJwt, getUserById } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import { initUserData } from '@/hooks/use-auth'

export default function Twitter_btn() {
  const { loginTwitter } = useFirebase()
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // Twitter 登入後處理
  const callbackTwitterLoginPopup = async (providerData) => {
    console.log('Twitter 返回: ', providerData)

    if (auth.isAuth) return

    const res = await TwitterLogin(providerData)

    if (res.data.status === 'success') {
      const jwtUser = parseJwt(res.data.data.accessToken)
      const res1 = await getUserById(jwtUser.id)

      // localStorage.setItem('TheToken', jwtUser) //

      if (res1.data.status === 'success') {
        const dbUser = res1.data.data.user
        const userData = { ...initUserData }

        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }

        setAuth({
          isAuth: true,
          userData: res1.data.data,
        })

        // console.log('資料: ', res1.data)

        toast.success('已成功登入')
        router.push('/home') // 登入成功後跳轉到首頁
      } else {
        toast.error('登入後無法得到會員資料')
      }
    } else {
      toast.error('登入失敗')
    }
  }

  return (
    <button
      className="btn d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: '#fff',
        color: '#1DA1F2', // Twitter 藍色
        padding: '8px',
        border: '1px solid #1DA1F2', // Twitter 藍色邊框
        borderRadius: '10px',
        width: '50px',
        height: '50px',
        fontSize: '24px',
      }}
      onClick={() => loginTwitter(callbackTwitterLoginPopup)}
    >
      <FaTwitter />
    </button>
  )
}
