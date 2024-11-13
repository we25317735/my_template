import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '@/hooks/use-auth'
import useFirebase from '@/hooks/use-firebase'
import { googleLogin, parseJwt, getUserById } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import { initUserData } from '@/hooks/use-auth'

const Google_btn = () => {
  const { loginGoogle } = useFirebase()
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // Google 登入後處理
  const callbackGoogleLoginPopup = async (providerData) => {
    if (auth.isAuth) return

    const res = await googleLogin(providerData)

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
        color: '#db4437',
        padding: '8px',
        border: '1px solid #db4437',
        borderRadius: '10px',
        width: '50px',
        height: '50px',
        fontSize: '24px',
      }}
      onClick={() => loginGoogle(callbackGoogleLoginPopup)}
    >
      <FaGoogle />
    </button>
  )
}

export default Google_btn
