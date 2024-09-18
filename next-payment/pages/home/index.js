import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useFirebase from '@/hooks/use-firebase'
import {
  logout,
  lineLogout,
  lineLoginCallback,
  getUserById,
  parseJwt,
} from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { initUserData } from '@/hooks/use-auth'

const Home = () => {
  const { auth, setAuth, handleCheckAuth } = useAuth()
  const { logoutFirebase } = useFirebase() // 用於處理 Firebase 登出
  const router = useRouter()

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth, router])

  // 處理 LINE 登入後的回調，從 LINE 回應中解析資料並更新狀態
  const callbackLineLogin = async (query) => {
    const res = await lineLoginCallback(query)

    if (res.data.status === 'success') {
      // 從 JWT 解析會員資料
      const jwtUser = parseJwt(res.data.data.accessToken)
      const res1 = await getUserById(jwtUser.id)

      if (res1.data.status === 'success') {
        const dbUser = res1.data.data.user
        const userData = { ...initUserData }

        // 將資料表中的會員資料與 initUserData 中的屬性值進行對應
        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }

        // 更新全域的會員狀態
        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('LINE 登入成功')
      } else {
        toast.error('登入後無法取得會員資料')
      }
    } else {
      toast.error('LINE 登入失敗或已是登入狀態')
    }
  }

  // LINE 登入後的回調處理
  useEffect(() => {
    if (router.isReady) {
      if (!router.query.code) return // 沒有 code 表示非登入狀態
      callbackLineLogin(router.query) // 處理 LINE 登入回調
    }
  }, [router.isReady, router.query])

  // 處理 Google（Firebase）和 LINE 登出
  const handleLogout = async () => {
    // 1. 執行 Firebase 的登出
    logoutFirebase()

    // 2. 執行後端登出 API (Google 或其他系統的登出邏輯)
    const res = await logout()

    if (res.data.status === 'success') {
      // 3. 如果會員是透過 LINE 登入，執行 LINE 登出
      if (auth.userData.line_uid) {
        const lineLogoutRes = await lineLogout(auth.userData.line_uid)
        if (lineLogoutRes.data.status === 'success') {
          toast.success('LINE 登出成功')
        } else {
          toast.error('LINE 登出失敗')
          return
        }
      }

      toast.success('已成功登出')

      // 4. 重置會員認證狀態
      setAuth({
        isAuth: false,
        userData: initUserData,
      })

      // 5. 跳轉至登入頁面
      router.push('/login')
    } else {
      toast.error('Google 登出失敗')
    }
  }

  // 處理登入邏輯
  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div>
      <h1>首頁</h1>
      <div className="d-flex">
        <span>
          <Link href="./user">會員頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./product">商品頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./cart">購物車</Link>
        </span>
        <span className="ms-3">
          <Link href="./customer">客服中心</Link>
        </span>
      </div>
      <div className="mt-5">
        {/* 根據登入狀態顯示按鈕 */}
        {auth.isAuth ? (
          <button onClick={handleLogout} className="btn btn-danger mb-3">
            登出
          </button>
        ) : (
          <button onClick={handleLogin} className="btn btn-primary mb-3">
            登入
          </button>
        )}
        <p>會員狀態: {auth.isAuth ? '已登入' : '未登入'}</p>

        <div className="mt-5">
          <h4>會員資料</h4>
          <p>
            使用者ID: {auth.userData.id ? auth.userData.id : '(使用者未登入)'}
          </p>
          <p>
            使用者姓名:{' '}
            {auth.userData.name ? auth.userData.name : '(使用者未登入)'}
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default Home
